const GroupController = require('./group.controller');
const groupController = new GroupController();


exports.getUserGroups = async (req, res) => {
    try {
        console.log('Received request to get groups for user');
        res.status(200).send({ groups: req.user.groups });
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.findGroup = async (req, res) => {
    try {
        const id = req.params.id;
        const group = groupController.find(id);
        res.status(200).send(group);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const user = req.user;
        const name = req.body.name;
        const group = await groupController.create(name, user);
        res.status(200).send(group);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

exports.addMember = async (req, res) => {
    try {
        const groupId = req.body.id;
        const email = req.body.email;
        const group = await groupController.addMember(groupId, email);
        res.status(200).send(group);
    } catch (err) {
        res.status(500).send({ message: err.toString() });
    }
};

