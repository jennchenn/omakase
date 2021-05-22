const Calendar = require('../../services/calendar');

class CalendarController {
    constructor() {
        this.calendarService = new Calendar();
    }

    async getCalendars(refreshToken) {
        return this.calendarService.getCalendars(refreshToken);
    }

    sortAvailability(availability) {
        return availability.sort((a, b) => {
            let dateA = new Date(a.start);
            let dateB = new Date(b.start);
            return dateA - dateB;
        });
    }

    findFirstAvailableSlot(meetingLengthMinutes) {
        const availability = [
            {
                "start": "2021-05-24T13:30:00Z",
                "end": "2021-05-25T21:20:00Z"
            },
            {
                "start": "2021-05-24T17:00:00Z",
                "end": "2021-05-24T17:50:00Z"
            },

            {
                "start": "2021-05-25T16:30:00Z",
                "end": "2021-05-25T18:20:00Z"
            },
            {
                "start": "2021-05-25T18:30:00Z",
                "end": "2021-05-25T19:20:00Z"
            },
            {
                "start": "2021-05-25T20:00:00Z",
                "end": "2021-05-25T21:00:00Z"
            },
            {
                "start": "2021-05-26T00:00:00Z",
                "end": "2021-05-26T01:00:00Z"
            },
            {
                "start": "2021-05-26T12:30:00Z",
                "end": "2021-05-26T13:50:00Z"
            },
            {
                "start": "2021-05-26T14:00:00Z",
                "end": "2021-05-26T15:20:00Z"
            },
            {
                "start": "2021-05-26T17:00:00Z",
                "end": "2021-05-26T17:50:00Z"
            },
            {
                "start": "2021-05-26T18:00:00Z",
                "end": "2021-05-26T18:50:00Z"
            },
            {
                "start": "2021-05-27T13:30:00Z",
                "end": "2021-05-27T14:20:00Z"
            },
            {
                "start": "2021-05-27T16:30:00Z",
                "end": "2021-05-27T19:30:00Z"
            },
            {
                "start": "2021-05-28T00:00:00Z",
                "end": "2021-05-28T01:00:00Z"
            },
            {
                "start": "2021-05-31T12:30:00Z",
                "end": "2021-05-31T13:50:00Z"
            },
            {
                "start": "2021-05-31T14:00:00Z",
                "end": "2021-05-31T15:20:00Z"
            },
            {
                "start": "2021-05-31T17:00:00Z",
                "end": "2021-05-31T17:50:00Z"
            },
            {
                "start": "2021-05-31T18:00:00Z",
                "end": "2021-05-31T18:50:00Z"
            },
            {
                "start": "2021-05-31T19:00:00Z",
                "end": "2021-05-31T19:50:00Z"
            },
            {
                "start": "2021-06-01T13:30:00Z",
                "end": "2021-06-01T15:20:00Z"
            },
            {
                "start": "2021-06-01T16:30:00Z",
                "end": "2021-06-01T18:20:00Z"
            },
            {
                "start": "2021-06-01T18:30:00Z",
                "end": "2021-06-01T19:20:00Z"
            },
            {
                "start": "2021-06-01T20:00:00Z",
                "end": "2021-06-01T22:00:00Z"
            }];

        const mergedTimes = this.mergeOverlappingSlots(availability);
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