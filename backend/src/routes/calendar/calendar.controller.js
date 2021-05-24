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
        try {
            const sortedAvailability = this.sortAvailability(availability);
            const mergedTimes = this.mergeOverlappingSlots(sortedAvailability);
            console.log(mergedTimes);

            let proposedMeetingStart = this.addMinutesToDate(moment(), 30);
            proposedMeetingStart = this.rountToNearestHalfHour(proposedMeetingStart);
            proposedMeetingStart = moment(proposedMeetingStart);
            let counter = 0;
            if (mergedTimes.length > 0 && proposedMeetingStart.isBetween(mergedTimes[0][0], mergedTimes[0][1])) {
                proposedMeetingStart = mergedTimes[0][1];
                counter += 1;
            }

            while (moment(proposedMeetingStart) < moment().add(14, 'days')) {
                let maxTime = mergedTimes.length > counter ? new Date(mergedTimes[counter][0]) : moment().add(14, 'days');
                console.log('START', proposedMeetingStart, maxTime);
                let res = this.findAvailability(moment(proposedMeetingStart), maxTime, meetingLengthMinutes);
                if (res !== null) return res;
                proposedMeetingStart = mergedTimes[counter][1];
                counter += 1;
            }

            // for (let i = 0; i < mergedTimes.length; i += 1) {
            //     let proposedMeetingStart = new Date(mergedTimes[i][1]);
            //     let maxTime = i + 1 < mergedTimes.length ? new Date(mergedTimes[i][0]) : moment().add(14, 'days');
            //     console.log(proposedMeetingStart, maxTime);
            //     let res = this.findAvailability(proposedMeetingStart, maxTime, meetingLengthMinutes);
            //     console.log(res);

            //     if (res !== null) return res;
            //     // console.log(proposedMeetingStart);
            //     // if (this.isTimeInBetween(proposedMeetingStart, minTime, endTime)) {
            //     //     let proposedMeetingEnd = this.addMinutesToDate(proposedMeetingStart, meetingLengthMinutes);
            //     //     if (proposedMeetingEnd <= new Date(mergedTimes[i + 1][0]) && this.isTimeInBetween(proposedMeetingEnd, minTime, endTime)) {
            //     //         return { start: proposedMeetingStart, end: proposedMeetingEnd };
            //     //     }
            //     // } else {
            //     //     let temp = moment.utc(proposedMeetingStart);
            //     //     proposedMeetingStart = moment.utc(proposedMeetingStart);
            //     //     temp.hours(12);
            //     //     temp.minutes(30);
            //     //     let duration = moment.duration(temp.diff(proposedMeetingStart));
            //     //     let hours = duration.asHours();
            //     //     proposedMeetingStart.add(hours, 'hours');
            //     //     if (hours < 0) {
            //     //         proposedMeetingStart.add(24, 'hours');
            //     //     }
            //     // }
            // }
            // TODO: handle no availabilities within two weeks
            return null;
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    findAvailability(proposedMeetingStart, maxTime, meetingLengthMinutes) {
        const minTime = new Date();
        minTime.setUTCHours(12, 30, 0);
        const endTime = new Date();
        endTime.setUTCHours(3, 0, 0);
        console.log(proposedMeetingStart, maxTime);
        while (proposedMeetingStart < maxTime) {
            console.log(proposedMeetingStart);
            if (this.isTimeInBetween(proposedMeetingStart, minTime, endTime)) {
                let proposedMeetingEnd = this.addMinutesToDate(proposedMeetingStart, meetingLengthMinutes);
                if (proposedMeetingEnd <= maxTime && this.isTimeInBetween(proposedMeetingEnd, minTime, endTime)) {
                    console.log({ start: proposedMeetingStart, end: proposedMeetingEnd });
                    return { start: proposedMeetingStart, end: proposedMeetingEnd };
                } else {
                    break;
                }
            } else {
                let temp = moment.utc(proposedMeetingStart);
                proposedMeetingStart = moment.utc(proposedMeetingStart);
                console.log('OG', proposedMeetingStart);
                temp.hours(12);
                temp.minutes(30);
                let duration = moment.duration(temp.diff(proposedMeetingStart)).asHours();
                proposedMeetingStart.add(duration, 'hours');
                console.log('SHIFTED', proposedMeetingStart, duration);
                if (proposedMeetingStart < temp) {
                    proposedMeetingStart.add(24, 'hours');
                    console.log('SHIFT 24', proposedMeetingStart);
                }
                console.log(proposedMeetingStart);
            }
        }
        return null;
    }

    sortAvailability(availability) {
        if (availability.length == 0) {
            return [];
        }
        return availability.sort((a, b) => {
            let dateA = new Date(a.start);
            let dateB = new Date(b.start);
            return dateA - dateB;
        });
    }

    mergeOverlappingSlots(availability) {
        if (availability.length == 0) {
            return [];
        }
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
        start.hour(12);
        start.minute(30);
        end.hour(6);
        end.minute(30);
        if (start.isAfter(end)) {
            end.add(1, 'days');
        }
        console.log('IS BETWEEN', start, end, time);
        console.log(time.isSameOrAfter(start));
        console.log(time.isSameOrBefore(end));
        return time.isSameOrAfter(start) && time.isSameOrBefore(end);
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