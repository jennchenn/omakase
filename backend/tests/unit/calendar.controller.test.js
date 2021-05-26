// const app = require('../src/server');
// const supertest = require('supertest');

// afterAll(async () => {
//     await mongoose.disconnect();
// });
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
});