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
          timezone: 'UTC',
        },
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

  async createEvent(refreshToken, startDateTime, endDateTime, meetingDetails) {
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
          summary: meetingDetails.title,
          description: meetingDetails.description,
          start: {
            dateTime: startDateTime,
            timezone: 'UTC',
          },
          end: {
            dateTime: endDateTime,
            timezone: 'UTC',
          },
          conferenceData: {
            createRequest: {
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
              requestId: uuidv4(),
            },
          },
          attendees: meetingDetails.attendees,
        },
      });
      return res;
    } catch (err) {
      console.log(`API returned error: ${err}`);
      return;
    }
  }
}

module.exports = Calendar;
