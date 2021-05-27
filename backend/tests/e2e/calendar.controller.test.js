const mongoose = require('mongoose');
const CalendarController = require('../../src/routes/calendar/calendar.controller');
const User = require('../../src/models/User');
const Group = require('../../src/models/Group');
const app = require('../../src/server');

let calendarController;
const refreshToken = process.env.TEST_REFRESH_TOKEN;

let group;
let user1;
let user2;

const testUser1 = {
    email: 'jennistesting@gmail.com',
    name: 'Jenn Test',
    refreshToken: process.env.TEST_REFRESH_TOKEN
};

const testUser2 = {
    email: 'jennistestingagain@gmail.com',
    name: 'Jenn Test',
    refreshToken: process.env.TEST_REFRESH_TOKEN
};

beforeAll(() => {
    calendarController = new CalendarController();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
    user1 = await User.create(testUser1);
    user2 = await User.create(testUser2);
    group = await Group.create(
        {
            name: 'Group Name',
            description: 'Group for testing',
            members: [user1._id, user2._id]
        });
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Test calendar controller functions', () => {
    it('Test single user meeting creation', async () => {
        const meetingDetails = {
            "title": "My test meeting",
            "lengthMinutes": 30
        };
        const res = await calendarController.setNextMeeting(refreshToken, meetingDetails);
        expect(res.data.status).toBe('confirmed');
        expect(res.data.summary).toBe(meetingDetails.title);
    });

    it('Test group meeting creation', async () => {
        const meetingDetails = {
            "title": "My test meeting",
            "lengthMinutes": 30
        };
        const res = await calendarController.setNextMeetingGroup(refreshToken, group._id, meetingDetails);
        expect(res.data.status).toBe('confirmed');
        expect(res.data.summary).toBe(meetingDetails.title);
        expect(res.data.attendees).toStrictEqual([
            {
                email: user1.email,
                responseStatus: 'needsAction'
            },
            {
                email: user2.email,
                responseStatus: 'needsAction'
            }
        ]);
    });
});