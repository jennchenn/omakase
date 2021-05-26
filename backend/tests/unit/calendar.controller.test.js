const moment = require('moment');
const CalendarController = require('../../src/routes/calendar/calendar.controller');

let calendarController;

beforeAll(() => {
    calendarController = new CalendarController();
});

describe('Test calendar controller helper functions', () => {
    it('Test rounding to nearest half hour function', async () => {
        const currentTime = moment.utc('2021-05-24T17:43:59.251Z');
        const roundedTime = calendarController.roundToNearestHalfHour(currentTime);
        expect(roundedTime.toJSON()).toEqual(moment.utc('2021-05-24T18:00:59.251Z').toJSON());
    });

    it('Test adding minutes to date', async () => {
        const currentTime = moment.utc('2021-05-24T17:43:59.251Z');
        const newTime = calendarController.addMinutesToDate(currentTime, 10);
        expect(newTime.toJSON()).toEqual(moment.utc('2021-05-24T17:53:59.251Z').toJSON());
    });

    it('Test shift meeting start time to be within set meeting hours just after end', async () => {
        const currentTime = moment.utc('2021-05-24T06:43:59.251Z');
        const shiftedTime = calendarController.shiftTimeToBound(currentTime);
        expect(shiftedTime.toJSON()).toEqual(moment.utc('2021-05-24T12:30:59.251Z').toJSON());
    });

    it('Test shift meeting start time to be within set meeting hours just before start', async () => {
        const currentTime = moment.utc('2021-05-24T11:43:59.251Z');
        const shiftedTime = calendarController.shiftTimeToBound(currentTime);
        expect(shiftedTime.toJSON()).toEqual(moment.utc('2021-05-24T12:30:59.251Z').toJSON());
    });

    it('Test isTimeBetweenBounds returns true for time within business hours', async () => {
        const currentTime = moment.utc('2021-05-24T17:43:59.251Z');
        const isTimeBetweenBounds = calendarController.isTimeBetweenBounds(currentTime);
        expect(isTimeBetweenBounds).toBe(true);
    });

    it('Test isTimeBetweenBounds returns false for time not within business hours', async () => {
        const currentTime = moment.utc('2021-05-24T07:43:59.251Z');
        const isTimeBetweenBounds = calendarController.isTimeBetweenBounds(currentTime);
        expect(isTimeBetweenBounds).toBe(false);
    });

    it('Test sorting availabilities', async () => {
        const availabilities = [
            { start: '2021-05-26T18:30:00Z', end: '2021-05-26T19:20:00Z' },
            { start: '2021-05-26T22:30:00Z', end: '2021-05-26T23:30:00Z' },
            { start: '2021-05-26T20:00:00Z', end: '2021-05-26T21:00:00Z' },
            { start: '2021-05-26T17:00:00Z', end: '2021-05-26T17:50:00Z' },
            { start: '2021-05-26T16:30:00Z', end: '2021-05-26T18:00:00Z' },
            { start: '2021-05-27T01:00:00Z', end: '2021-05-27T02:00:00Z' },
            { start: '2021-05-26T16:30:00Z', end: '2021-05-26T20:00:00Z' },
        ];
        const sortedAvailabilities = [
            { start: '2021-05-26T16:30:00Z', end: '2021-05-26T18:00:00Z' },
            { start: '2021-05-26T16:30:00Z', end: '2021-05-26T20:00:00Z' },
            { start: '2021-05-26T17:00:00Z', end: '2021-05-26T17:50:00Z' },
            { start: '2021-05-26T18:30:00Z', end: '2021-05-26T19:20:00Z' },
            { start: '2021-05-26T20:00:00Z', end: '2021-05-26T21:00:00Z' },
            { start: '2021-05-26T22:30:00Z', end: '2021-05-26T23:30:00Z' },
            { start: '2021-05-27T01:00:00Z', end: '2021-05-27T02:00:00Z' }
        ];
        const sortAvailabilityRes = calendarController.sortAvailability(availabilities);
        expect(sortAvailabilityRes).toEqual(sortedAvailabilities);
    });

    it('Test merging availabilities', async () => {
        const availabilities = [
            { start: '2021-05-26T16:30:00Z', end: '2021-05-26T18:00:00Z' },
            { start: '2021-05-26T16:30:00Z', end: '2021-05-26T20:00:00Z' },
            { start: '2021-05-26T17:00:00Z', end: '2021-05-26T17:50:00Z' },
            { start: '2021-05-26T18:30:00Z', end: '2021-05-26T19:20:00Z' },
            { start: '2021-05-26T20:00:00Z', end: '2021-05-26T21:00:00Z' },
            { start: '2021-05-26T21:00:00Z', end: '2021-05-26T21:30:00Z' },
            { start: '2021-05-26T21:00:00Z', end: '2021-05-26T21:30:00Z' },
            { start: '2021-05-26T22:30:00Z', end: '2021-05-26T23:30:00Z' },
            { start: '2021-05-27T01:00:00Z', end: '2021-05-27T02:00:00Z' },
            { start: '2021-05-27T01:00:00Z', end: '2021-05-27T03:30:00Z' },
            { start: '2021-05-27T12:30:00Z', end: '2021-05-27T19:30:00Z' },
            { start: '2021-05-27T13:30:00Z', end: '2021-05-27T14:20:00Z' },
            { start: '2021-05-27T14:30:00Z', end: '2021-05-27T15:15:00Z' },
            { start: '2021-05-27T14:30:00Z', end: '2021-05-27T15:15:00Z' },
            { start: '2021-05-27T16:30:00Z', end: '2021-05-27T19:30:00Z' },
            { start: '2021-05-27T17:30:00Z', end: '2021-05-27T20:00:00Z' },
            { start: '2021-05-27T20:30:00Z', end: '2021-05-27T22:30:00Z' },
            { start: '2021-05-27T22:30:00Z', end: '2021-05-27T23:30:00Z' },
            { start: '2021-05-27T23:00:00Z', end: '2021-05-28T02:00:00Z' }
        ];
        const mergedAvailabilities = [
            ['2021-05-26T16:30:00Z', '2021-05-26T21:30:00Z'],
            ['2021-05-26T22:30:00Z', '2021-05-26T23:30:00Z'],
            ['2021-05-27T01:00:00Z', '2021-05-27T03:30:00Z'],
            ['2021-05-27T12:30:00Z', '2021-05-27T20:00:00Z'],
            ['2021-05-27T20:30:00Z', '2021-05-28T02:00:00Z'],
        ];
        const mergeAvailabilityRes = calendarController.mergeOverlappingSlots(availabilities);
        expect(mergeAvailabilityRes).toEqual(mergedAvailabilities);
    });

    it('Test finding first availability slot', async () => {
        const availabilities = [
            { start: '2021-05-26T17:00:00Z', end: '2021-05-26T17:50:00Z' },
            { start: '2021-05-26T18:30:00Z', end: '2021-05-26T19:20:00Z' },
            { start: '2021-05-27T13:30:00Z', end: '2021-05-27T14:20:00Z' },
            { start: '2021-05-27T14:30:00Z', end: '2021-05-27T15:15:00Z' },
            { start: '2021-05-27T16:30:00Z', end: '2021-05-27T19:30:00Z' },
            { start: '2021-05-28T00:00:00Z', end: '2021-05-28T01:00:00Z' },
            { start: '2021-05-31T12:30:00Z', end: '2021-05-31T13:50:00Z' },
            { start: '2021-05-31T14:00:00Z', end: '2021-05-31T15:20:00Z' },
            { start: '2021-05-31T17:00:00Z', end: '2021-05-31T17:50:00Z' },
            { start: '2021-05-31T18:00:00Z', end: '2021-05-31T18:50:00Z' },
            { start: '2021-05-26T22:30:00Z', end: '2021-05-26T23:30:00Z' },
            { start: '2021-05-27T22:30:00Z', end: '2021-05-27T23:30:00Z' },
            { start: '2021-05-28T22:30:00Z', end: '2021-05-28T23:30:00Z' },
            { start: '2021-05-29T02:00:00Z', end: '2021-05-29T04:00:00Z' },
            { start: '2021-05-29T22:30:00Z', end: '2021-05-29T23:30:00Z' },
            { start: '2021-05-30T22:30:00Z', end: '2021-05-30T23:30:00Z' },
            { start: '2021-05-31T22:30:00Z', end: '2021-05-31T23:30:00Z' },
            { start: '2021-05-30T01:00:00Z', end: '2021-05-30T04:00:00Z' },
            { start: '2021-05-28T01:00:00Z', end: '2021-05-28T02:00:00Z' },
            { start: '2021-05-29T00:00:00Z', end: '2021-05-29T01:30:00Z' },
            { start: '2021-05-31T00:00:00Z', end: '2021-05-31T02:00:00Z' },
            { start: '2021-05-26T20:00:00Z', end: '2021-05-26T21:00:00Z' },
            { start: '2021-05-27T01:00:00Z', end: '2021-05-27T02:00:00Z' },
            { start: '2021-05-28T00:00:00Z', end: '2021-05-28T01:00:00Z' },
            { start: '2021-05-28T20:00:00Z', end: '2021-05-28T21:00:00Z' },
            { start: '2021-05-29T00:00:00Z', end: '2021-05-29T01:00:00Z' },
            { start: '2021-05-29T15:30:00Z', end: '2021-05-29T16:00:00Z' },
            { start: '2021-05-29T17:30:00Z', end: '2021-05-29T19:30:00Z' },
            { start: '2021-05-28T13:00:00Z', end: '2021-05-28T13:15:00Z' },
            { start: '2021-05-31T01:00:00Z', end: '2021-05-31T01:15:00Z' },
            { start: '2021-05-31T13:00:00Z', end: '2021-05-31T13:15:00Z' },
            { start: '2021-05-26T16:30:00Z', end: '2021-05-26T18:00:00Z' },
            { start: '2021-05-27T14:30:00Z', end: '2021-05-27T15:15:00Z' },
            { start: '2021-05-27T17:30:00Z', end: '2021-05-27T20:00:00Z' },
            { start: '2021-05-28T00:00:00Z', end: '2021-05-28T01:00:00Z' },
            { start: '2021-05-28T18:00:00Z', end: '2021-05-28T19:00:00Z' },
            { start: '2021-05-31T12:30:00Z', end: '2021-05-31T14:00:00Z' },
            { start: '2021-05-31T16:30:00Z', end: '2021-05-31T18:00:00Z' },
        ];
        const meetingTime = {
            start: moment.utc('2021-05-26T18:00:00Z'),
            end: moment.utc('2021-05-26T18:30:00Z')
        };
        const proposedMeetingTime = calendarController.findFirstAvailableSlot(availabilities, 30);
        expect(proposedMeetingTime.start.toJSON()).toEqual(meetingTime.start.toJSON());
        expect(proposedMeetingTime.end.toJSON()).toEqual(meetingTime.end.toJSON());
    });
});