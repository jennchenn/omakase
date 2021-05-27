const Repository = require('../../services/repository');

class GroupController {
  constructor() {
    this.repositoryService = new Repository();
  }

  async find(id) {
    console.log(`Searching for group with id ${id}`);
    return this.repositoryService.findGroup(id);
  }

  async create(name, user) {
    console.log(`Creating group with name ${name}`);
    return this.repositoryService.createGroup(name, user);
  }

  async addMember(groupId, email) {
    console.log(`Adding member with email ${email} to group ${groupId}`);
    const user = await this.repositoryService.findUser(email);
    return this.repositoryService.addMemberToGroup(groupId, user);
  }
}

module.exports = GroupController;
