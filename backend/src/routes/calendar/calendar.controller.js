const moment = require('moment');
const Calendar = require('../../services/calendar');
const Repository = require('../../services/repository');

class CalendarController {
    constructor() {
        this.calendarService = new Calendar();
        this.repositoryService = new Repository();
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

    async setNextMeetingGroup(currentUserRefreshToken, groupId, meetingLengthMinutes) {
        let availability = [];
        const group = await this.repositoryService.findGroup(groupId);
        for (let member of group.members) {
            let calendars = await this.calendarService.getCalendars(member.refreshToken);
            let memberAvailability = await this.calendarService.getTimesBusy(member.refreshToken, calendars);
            availability = availability.concat(memberAvailability);
        }
        const meetingTime = this.findFirstAvailableSlot(availability, meetingLengthMinutes);
        return this.calendarService.createEvent(currentUserRefreshToken, meetingTime.start, meetingTime.end);
    }

    findFirstAvailableSlot(availability, meetingLengthMinutes) {
        try {
            const sortedAvailability = this.sortAvailability(availability);
            const mergedTimes = this.mergeOverlappingSlots(sortedAvailability);
            let proposedMeetingStart = this.findNearestHalfHourTime();

            let counter = 0;
            // Shift proposedMeetingStart if it overlaps with an existing event
            if (mergedTimes.length > 0 && proposedMeetingStart.isBetween(mergedTimes[0][0], mergedTimes[0][1])) {
                proposedMeetingStart = mergedTimes[0][1];
                counter += 1;
            }

            // Only schedule events within two week time frame from current date
            while (moment(proposedMeetingStart) < moment().add(14, 'days')) {
                let maxTime = mergedTimes.length > counter ? new Date(mergedTimes[counter][0]) : moment().add(14, 'days');
                let meetingTime = this.findAvailability(moment(proposedMeetingStart), maxTime, meetingLengthMinutes);
                if (meetingTime !== null) return meetingTime;
                proposedMeetingStart = mergedTimes[counter][1];
                counter += 1;
            }
            // TODO: handle no availabilities within two weeks
            return null;
        } catch (err) {
            throw new Error(err);
        }
    }

    findAvailability(proposedMeetingStart, maxTime, meetingLengthMinutes) {
        // TODO: set these bounds from db
        const minTime = new Date();
        minTime.setUTCHours(12, 30, 0);
        const endTime = new Date();
        endTime.setUTCHours(3, 0, 0);

        try {
            while (proposedMeetingStart < maxTime) {
                if (this.isTimeBetweenBounds(proposedMeetingStart, minTime, endTime)) {
                    let proposedMeetingEnd = this.addMinutesToDate(proposedMeetingStart, meetingLengthMinutes);
                    if (proposedMeetingEnd <= maxTime && this.isTimeBetweenBounds(proposedMeetingEnd, minTime, endTime)) {
                        return { start: proposedMeetingStart, end: proposedMeetingEnd };
                    } else {
                        break;
                    }
                } else {
                    // Shift to nearest time that falls between user's business hours
                    proposedMeetingStart = this.shiftTimeToBound(proposedMeetingStart);
                }
            }
            return null;
        } catch (err) {
            console.log(err);
        }
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

    findNearestHalfHourTime() {
        // Give at least 30 minute notice for new events
        let earliestStartTime = this.addMinutesToDate(moment(), 30);
        let proposedMeetingStart = this.roundToNearestHalfHour(earliestStartTime);
        return moment(proposedMeetingStart);
    }

    isTimeBetweenBounds(desiredDateString, startTime, endTime) {
        // TODO: read start and end bounds from db
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
        return time.isSameOrAfter(start) && time.isSameOrBefore(end);
    }

    shiftTimeToBound(proposedStart) {
        let proposedMeetingStart = moment.utc(proposedStart);
        let startOfMeetingTimes = moment.utc(proposedMeetingStart);
        startOfMeetingTimes.hours(12);
        startOfMeetingTimes.minutes(30);
        let duration = moment.duration(startOfMeetingTimes.diff(proposedMeetingStart)).asHours();
        proposedMeetingStart.add(duration, 'hours');
        if (proposedMeetingStart < startOfMeetingTimes) {
            proposedMeetingStart.add(24, 'hours');
        }
        return proposedMeetingStart;
    }

    addMinutesToDate(date, minutes) {
        const newDate = moment.utc(date);
        newDate.add(minutes, 'minutes');
        return newDate;
    }

    roundToNearestHalfHour(date) {
        const remainder = 30 - (date.minute() % 30);
        return moment.utc(date).add(remainder, 'minutes');
    }
}

module.exports = CalendarController;