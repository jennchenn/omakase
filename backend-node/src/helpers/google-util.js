const { google } = require('googleapis');
const { OAuth2 } = google.auth;

export const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);
