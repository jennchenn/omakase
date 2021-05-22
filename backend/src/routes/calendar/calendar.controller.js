const Calendar = require('../../services/calendar');

class CalendarController {
    constructor() {
        this.calendarService = new Calendar();
    }

    async getCalendars() {
        return this.calendarService.getCalendars();
    }
}

module.exports = CalendarController;