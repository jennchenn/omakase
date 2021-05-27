const mongoose = require('mongoose');
const GroupController = require('../../src/routes/group/group.controller');
const User = require('../../src/models/User');
const Group = require('../../src/models/Group');
const app = require('../../src/server');

let groupController;
const testUser = {
    email: 'jennistesting@gmail.com',
    name: 'Jenn Test',
    refreshToken: process.env.TEST_REFRESH_TOKEN
};
let id;
let user;

beforeAll(() => {
    groupController = new GroupController();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
    user = await User.create(testUser);
    id = user._id;
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Test group controller functions', () => {
    it('Check test database is seeded with one user', async () => {
        const userCount = await User.countDocuments();
        expect(userCount).toEqual(1);
        const groupCount = await Group.countDocuments();
        expect(groupCount).toEqual(0);
    });

    it('Try creating a group', async () => {
        const groupName = 'My first testing group!';
        const res = await groupController.create(groupName, user);
        expect(res.name).toBe(groupName);
        expect(res.members.toObject()).toStrictEqual([id]);
    });

    it('Find group by id', async () => {
        const groupName = 'My first testing group!';
        const createdGroup = await groupController.create(groupName, user);
        const foundGroup = await groupController.find(createdGroup._id);
        expect(foundGroup._id).toStrictEqual(createdGroup._id);
        expect(foundGroup.name).toBe(createdGroup.name);
        expect(foundGroup.members[0]._id).toEqual(id);
    });


    it('Add member to group', async () => {
        const testUser = {
            email: 'jennistestingagain@gmail.com',
            name: 'Jenn Test',
            refreshToken: process.env.TEST_REFRESH_TOKEN
        };
        const newMember = await User.create(testUser);
        const createdGroup = await groupController.create('My other group', user);
        const updatedGroup = await groupController.addMember(createdGroup._id, newMember.email);
        expect(updatedGroup._id).toStrictEqual(createdGroup._id);
        expect(updatedGroup.name).toBe(createdGroup.name);
        expect(updatedGroup.members[0]._id).toEqual(id);
        expect(updatedGroup.members[1]._id).toEqual(newMember._id);
    });

});