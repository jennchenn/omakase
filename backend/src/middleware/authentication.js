const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const RepositoryService = require('../services/repository');
const repositoryService = new RepositoryService();

module.exports = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            res.status(401).json({ message: 'No token provided' });
        }
        const token = req.cookies.token;
        const profile = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { email } = profile.getPayload();
        console.log(`Verified user ${email}`);
        const user = await repositoryService.findUser(email);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unable to authenticate user.' });
    }
};