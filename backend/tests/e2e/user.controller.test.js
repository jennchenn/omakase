const mongoose = require('mongoose');
const UserController = require('../../src/routes/user/user.controller');
const User = require('../../src/models/User');
const Group = require('../../src/models/Group');
const app = require('../../src/server');

let userController;
const testUser = {
    email: 'peachyburgundy@gmail.com',
    name: 'Jenn Test',
    refreshToken: process.env.TEST_REFRESH_TOKEN
};
let id;
let user;

beforeAll(() => {
    userController = new UserController();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
    user = await User.create(testUser);
    // id = user._id;
});

afterAll(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
    await mongoose.disconnect();
});

describe('Test user controller functions', () => {
    it('Search for an existing user', async () => {
        const findUserRes = await userController.find(user.email);
        expect(findUserRes.toJSON()).toStrictEqual(user.toJSON());
    });

    it('Register a new user', async () => {
        const newTestUser = {
            email: 'jenn.chenn93@gmail.com',
            name: 'Jenn Test',
            refreshToken: 'some refresh token',
            picture: 'https://lh3.googleusercontent.com/a-/WhLWD_3kzFRQ=s96-c'
        };
        const createdUser = await userController.register(newTestUser);
        expect(createdUser.email).toBe(newTestUser.email);
        expect(createdUser.name).toBe(newTestUser.name);
        expect(createdUser.picture).toBe('https://lh3.googleusercontent.com/a-/WhLWD_3kzFRQ=s384-c');
    });

    it('Update a user refresh token', async () => {
        const newRefreshToken = 'my new refresh token';
        const updatedUser = await userController.update({ email: user.email, refreshToken: newRefreshToken });
        expect(updatedUser.email).toBe(user.email);
        expect(updatedUser.refreshToken).toBe(newRefreshToken);
    });
});