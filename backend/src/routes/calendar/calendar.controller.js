const Calendar = require('../../services/calendar');

class CalendarController {
    constructor() {
        this.calendarService = new Calendar();
    }

    async getCalendars(refreshToken) {
        return this.calendarService.getCalendars(refreshToken);
    }
}

module.exports = CalendarController;