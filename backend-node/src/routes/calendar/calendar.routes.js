const Calendar = require('../../services/calendar');
const calendarService = new Calendar();

exports.listEvents = async (req, res) => {
    try {
        const events = calendarService.listEvents();
        res.status(200).send(events);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};
