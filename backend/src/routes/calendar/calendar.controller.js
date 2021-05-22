const Calendar = require('../../services/calendar');

class CalendarController {
    constructor() {
        this.calendarService = new Calendar();
    }

    async getCalendars(refreshToken) {
        return this.calendarService.getCalendars(refreshToken);
    }

    sortAvailability(availability) {
        return availability.sort((a, b) => {
            let dateA = new Date(a.start);
            let dateB = new Date(b.start);
            return dateA - dateB;
        });
    }
}

module.exports = CalendarController;