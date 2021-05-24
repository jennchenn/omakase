const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const { v4: uuidv4 } = require('uuid');

class Calendar {
    setCredentials(refresh_token) {
        oAuth2Client.setCredentials({
            refresh_token: refresh_token,
        });
        return true;
    }

    listEvents(refresh_token) {
        const oAuth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
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
            const oAuth2Client = new OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
            );
            oAuth2Client.setCredentials({
                refresh_token: refreshToken,
            });
            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
            const calendars = await calendar.calendarList.list();
            return calendars.data.items;
        } catch (err) {
            console.log(`API returned error: ${err}`);
            return;
        }
    }

    async getTimesBusy(refreshToken, calendars) {
        try {
            const oAuth2Client = new OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
            );
            oAuth2Client.setCredentials({
                refresh_token: refreshToken,
            });
            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

            const numWeeks = 2;
            const currentDate = new Date();
            const twoWeeksFromNow = new Date();
            twoWeeksFromNow.setDate(currentDate.getDate() + numWeeks * 7);
            const res = await calendar.freebusy.query({
                resource: {
                    items: calendars,
                    timeMin: currentDate.toISOString(),
                    timeMax: twoWeeksFromNow.toISOString(),
                    timezone: 'UTC'
                }
            });
            const events = res.data.calendars;
            const availability = Object.keys(events).reduce(function (res, cal) {
                return res.concat(events[cal].busy);
            }, []);

            return availability;
        } catch (err) {
            console.log(`API returned error: ${err}`);
            return;
        }
    }

    async createEvent(refreshToken, startDateTime, endDateTime) {
        try {
            const oAuth2Client = new OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET
            );
            oAuth2Client.setCredentials({
                refresh_token: refreshToken,
            });
            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
            const res = await calendar.events.insert({
                calendarId: 'primary',
                conferenceDataVersion: 1,
                requestBody: {
                    summary: 'New Event MEET!',
                    description: 'Event descr',
                    start: {
                        dateTime: startDateTime,
                        timezone: 'UTC'
                    },
                    end: {
                        dateTime: endDateTime,
                        timezone: 'UTC'
                    },
                    conferenceData: {
                        createRequest: {
                            conferenceSolutionKey: {
                                type: "hangoutsMeet"
                            },
                            requestId: uuidv4()
                        },
                    }
                }
            });
            return res;
        } catch (err) {
            console.log(`API returned error: ${err}`);
            return;
        }
    }
};

module.exports = Calendar;