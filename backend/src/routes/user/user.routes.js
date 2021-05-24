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
        user.refreshToken = refresh_token;

        let savedUser;
        if (existingUser) {
            console.log('User already exists, updating refresh token.');
            savedUser = await userController.update(user);
        } else {
            console.log('Registering user.');
            savedUser = await userController.register(user);
        }
        console.log('User successfully registered!');
        res.status(200).send({ user: user.name, email: user.email });
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Received request to login user');
        res.status(200).send({ user: req.name, email: req.email });
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};
