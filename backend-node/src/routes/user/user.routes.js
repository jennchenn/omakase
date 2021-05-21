const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Calendar = require('../../services/calendar');

const calendarService = new Calendar();

exports.login = async (req, res) => {
    try {
        console.log('Received request to login user');
        const { id_token, refresh_token } = req.body;
        const profile = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email } = profile.getPayload();
        calendarService.setCredentials(refresh_token);
        console.log('User successfully logged in!');
        res.status(200).send({ name, email });
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};