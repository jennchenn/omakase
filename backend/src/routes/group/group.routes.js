const GroupController = require('./group.controller');
const groupController = new GroupController();

exports.getUserGroups = async (req, res) => {
  try {
    console.log(`Received request to get groups for user ${req.user.email}`);
    res.status(200).send({ groups: req.user.groups });
  } catch (err) {
    res.status(500).send({ message: err.toString() });
  }
};

exports.findGroup = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Received request to get group with id ${id}`);
    const group = await groupController.find(id);
    res.status(200).send(group);
  } catch (err) {
    res.status(500).send({ message: err.toString() });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const user = req.user;
    const name = req.body.name;
    console.log(`Received request to create group for user ${req.user.email}`);
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
    console.log(`Received request to add member ${email} to group ${groupId}`);
    const group = await groupController.addMember(groupId, email);
    res.status(200).send(group);
  } catch (err) {
    res.status(500).send({ message: err.toString() });
  }
};
