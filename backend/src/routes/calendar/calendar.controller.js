const Calendar = require('../../services/calendar');

class CalendarController {
    constructor() {
        this.calendarService = new Calendar();
    }

    async getCalendars(refreshToken) {
        return this.calendarService.getCalendars(refreshToken);
    }

    async setNextMeeting(refreshToken, meetingLengthMinutes) {
        const calendars = await this.calendarService.getCalendars(refreshToken);
        console.log(calendars);

        const availability = await this.calendarService.getTimesBusy(refreshToken, calendars);
        return this.findFirstAvailableSlot(availability, meetingLengthMinutes);
    }

    findFirstAvailableSlot(availability, meetingLengthMinutes) {
        const sortedAvailability = this.sortAvailability(availability);
        const mergedTimes = this.mergeOverlappingSlots(sortedAvailability);
        const minTime = new Date();
        minTime.setUTCHours(8, 30, 0);
        const endTime = new Date();
        endTime.setUTCHours(22, 0, 0);
        for (let i = 0; i < mergedTimes.length - 1; i += 1) {
            let proposedMeetingStart = new Date(mergedTimes[i][1]);
            if (this.isTimeInBetween(proposedMeetingStart, minTime, endTime)) {
                let proposedMeetingEnd = new Date(mergedTimes[i][1]);
                proposedMeetingEnd.setMinutes(proposedMeetingEnd.getMinutes() + meetingLengthMinutes);
                if (proposedMeetingEnd <= new Date(mergedTimes[i + 1][0]) && this.isTimeInBetween(proposedMeetingEnd, minTime, endTime)) {
                    return { start: proposedMeetingStart, end: proposedMeetingEnd };
                }
            }
        }
        // TODO: handle no availabilities within two weeks
        return;
    }

    sortAvailability(availability) {
        return availability.sort((a, b) => {
            let dateA = new Date(a.start);
            let dateB = new Date(b.start);
            return dateA - dateB;
        });
    }

    mergeOverlappingSlots(availability) {
        const mergedTimes = [];
        let previousEvent = [availability[0].start, availability[0].end];
        for (let i = 1; i < availability.length; i += 1) {
            if (previousEvent[1] >= availability[i].start) {
                let endDate = (previousEvent[1] >= availability[i].end) ? previousEvent[1] : availability[i].end;
                previousEvent = [previousEvent[0], endDate];
            } else {
                mergedTimes.push(previousEvent);
                previousEvent = [availability[i].start, availability[i].end];
            }
        }

        mergedTimes.push(previousEvent);
        return mergedTimes;
    }

    isTimeInBetween(desiredDateString, startTime, endTime) {
        let desiredDate = new Date(desiredDateString);
        return desiredDate.getHours >= startTime.getHours()
            || desiredDate.getMinutes >= startTime.getMinutes()
            || desiredDate.getHours() <= endTime.getHours()
            || desiredDate.getMinutes() <= endTime.getMinutes();
    }

}

module.exports = CalendarController;