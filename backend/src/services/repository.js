const User = require('../models/User');
const Group = require('../models/Group');

// Make all queries to database using Repository class
class Repository {
    createUser(user) {
        return User.create(user);
    }

    updateUser(user) {
        return User.findOneAndUpdate(
            { email: user.email },
            { refreshToken: user.refreshToken },
            { new: true }
        );
    }

    findUser(email) {
        return User.findOne({
            email
        }).populate('groups');
    }

    findUserById(id) {
        return User.findById(id);
    }

    findGroup(id) {
        return Group.findById(id).populate('members');
    }

    async createGroup(name, user) {
        const group = {
            name,
            members: [user._id]
        };
        const createdGroup = await Group.create(group);
        await this.addGroupToUser(user.email, createdGroup._id);
        return createdGroup;
    }

    async addMemberToGroup(groupId, member) {
        const group = await Group.findOneAndUpdate(
            { _id: groupId },
            { $addToSet: { members: member._id } },
            { new: true }
        );
        await this.addGroupToUser(member.email, groupId);
        return group;
    }

    async addGroupToUser(email, groupId) {
        return User.findOneAndUpdate(
            { email: email },
            { $addToSet: { groups: groupId } }
        );
    }
};

module.exports = Repository;