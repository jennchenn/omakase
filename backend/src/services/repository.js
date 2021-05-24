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
            ...{ $set: user }
        );
    }

    findUser(email) {
        return User.findOne({
            email
        }).populate('groups');
    }

    findGroup(id) {
        return Group.findById(id).populate('members');
    }

    async createGroup(name, user) {
        const group = {
            name,
            members: [user._id]
        };
        console.log(group);
        const createdGroup = await Group.create(group);
        console.log(createdGroup);
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
        console.log(groupId);
        return User.findOneAndUpdate(
            { email: email },
            { $addToSet: { groups: groupId } }
        );
    }
};

module.exports = Repository;