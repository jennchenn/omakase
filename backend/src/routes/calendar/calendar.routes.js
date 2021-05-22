const Calendar = require('../../services/calendar');
const calendarService = new Calendar();

const CalendarController = require('./calendar.controller');
const calendarController = new CalendarController();

exports.listEvents = async (req, res) => {
    try {
        const events = calendarService.listEvents();
        res.status(200).send(events);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.getCalendars = async (req, res) => {
    try {
        console.log(req.email);
        console.log(req.refreshToken);
        const calendars = await calendarController.getCalendars(req.refreshToken);
        console.log(calendars);
        res.status(200).send(calendars);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};
