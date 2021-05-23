const moment = require('moment');
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
        const availability = await this.calendarService.getTimesBusy(refreshToken, calendars);
        const meetingTime = this.findFirstAvailableSlot(availability, meetingLengthMinutes);
        return this.calendarService.createEvent(refreshToken, meetingTime.start, meetingTime.end);
    }

    findFirstAvailableSlot(availability, meetingLengthMinutes) {
        const sortedAvailability = this.sortAvailability(availability);
        const mergedTimes = this.mergeOverlappingSlots(sortedAvailability);
        console.log(mergedTimes);

        const minTime = new Date();
        minTime.setUTCHours(12, 30, 0);
        const endTime = new Date();
        endTime.setUTCHours(3, 0, 0);

        let proposedMeetingStart = this.addMinutesToDate(moment(), 30);
        proposedMeetingStart = this.rountToNearestHalfHour(proposedMeetingStart);

        while (proposedMeetingStart < new Date(mergedTimes[0][0])) {
            if (this.isTimeInBetween(proposedMeetingStart, minTime, endTime)) {
                let proposedMeetingEnd = this.addMinutesToDate(proposedMeetingStart, meetingLengthMinutes);

                if (proposedMeetingEnd <= new Date(mergedTimes[0][0]) && this.isTimeInBetween(proposedMeetingEnd, minTime, endTime)) {
                    return { start: proposedMeetingStart, end: proposedMeetingEnd };
                } else {
                    break;
                }
            } else {
                proposedMeetingStart.setUTCHours(12, 30, 0);
            }
        }

        for (let i = 0; i < mergedTimes.length - 1; i += 1) {
            let proposedMeetingStart = new Date(mergedTimes[i][1]);
            if (this.isTimeInBetween(proposedMeetingStart, minTime, endTime)) {
                let proposedMeetingEnd = this.addMinutesToDate(proposedMeetingStart, meetingLengthMinutes);
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
        const time = moment.utc(desiredDateString);
        const start = moment.utc(desiredDateString);
        const end = moment.utc(desiredDateString);
        start.hour('8');
        start.minute('30');
        end.hour('22');
        end.minute('30');
        if (start.isAfter(end)) {
            end.add(1, 'days');
        }
        return time.isAfter(start) && time.isBefore(end);
    }

    addMinutesToDate(date, minutes) {
        const newDate = moment.utc(date);
        newDate.add(minutes, 'minutes');
        return newDate;
    }

    rountToNearestHalfHour(date) {
        const remainder = 30 - (date.minute() % 30);
        return moment.utc(date).add(remainder, 'minutes');
    }

}

module.exports = CalendarController;