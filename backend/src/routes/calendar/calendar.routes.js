const Calendar = require('../../services/calendar');
const calendarService = new Calendar();

const CalendarController = require('./calendar.controller');
const calendarController = new CalendarController();

exports.listEvents = async (req, res) => {
    try {
        const events = calendarService.listEvents(req.user.refreshToken);
        res.status(200).send(events);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.getCalendars = async (req, res) => {
    try {
        const calendars = await calendarController.getCalendars(req.user.refreshToken);
        res.status(200).send(calendars);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.setNextMeeting = async (req, res) => {
    try {
        const meetingTime = await calendarController.setNextMeeting(req.user.refreshToken, req.body.meeting);
        res.status(200).send(meetingTime);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};


exports.setNextMeetingGroup = async (req, res) => {
    try {
        const meetingTime = await calendarController.setNextMeetingGroup(req.user.refreshToken, req.body.id, req.body.meeting);
        res.status(200).send(meetingTime);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};
