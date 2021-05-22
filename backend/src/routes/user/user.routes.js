
const { updateMany } = require('../../models/User');
const Calendar = require('../../services/calendar');
const calendarService = new Calendar();

const UserController = require('./user.controller');
const userController = new UserController();


exports.register = async (req, res) => {
    try {
        console.log('Received request to register user');
        const { id_token, refresh_token } = req.body;
        const user = await userController.verify(id_token);
        const existingUser = await userController.find(user.email);
        user.refresh_token = refresh_token;

        if (existingUser) {
            console.log('User already exists, updating refresh token.');
            const update = await userController.update(user);
        } else {
            console.log('Registering user.');
            await userController.register(user);
        }
        calendarService.setCredentials(refresh_token);
        console.log('User successfully registered!');
        res.status(200).send({ user: user.name, email: user.email });
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Received request to login user');
        // const { id_token, refresh_token } = req.body;
        // const user = await userController.verify(id_token);
        // const isRegistered = await userController.find(user.email);
        // console.log(isRegistered);
        // // Register user if this is their first time entering the application
        // if (isRegistered === null) {
        //     user = {
        //         ...user,
        //         refresh_token
        //     };
        //     await userController.register(user);
        // }
        // calendarService.setCredentials(refresh_token);
        // console.log('User successfully logged in!');
        res.status(200).send({ "SUCCESS": true });
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};
