const { google } = require('googleapis');
const { OAuth2 } = google.auth;


class Calendar {
    // constructor() {

    // }

    setCredentials(refresh_token) {
        oAuth2Client.setCredentials({
            refresh_token: refresh_token,
        });
        return true;
    }

    listEvents(refresh_token) {
        oAuth2Client.setCredentials({
            refresh_token: refresh_token,
        });
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const events = res.data.items;
            if (events.length) {
                console.log('Upcoming 10 events:');
                events.map((event, i) => {
                    console.log(event);
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                });
            } else {
                console.log('No upcoming events found.');
            }
        });
    }

    async getCalendars(refreshToken) {
        try {
            console.log(refreshToken);
            const oAuth2Client = new OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
            );
            oAuth2Client.setCredentials({
                refresh_token: refreshToken,
            });
            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

            const res = await calendar.calendarList.list();
            const calendars = res.data.items;
            console.log(`Number calendars found: ${calendars.length}`);
            return calendars;
        } catch (err) {
            console.log(`API returned error: ${err}`);
            return;
        }
    }
};

module.exports = Calendar;