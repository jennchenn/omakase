const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Repository = require('../../services/repository');

class UserController {
  constructor() {
    this.repositoryService = new Repository();
  }

  async verify(id_token) {
    const profile = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = profile.getPayload();
    console.log(`Verified user ${email}`);
    return { name, email, picture };
  }

  async find(email) {
    console.log(`Searching for user with email ${email}`);
    return this.repositoryService.findUser(email);
  }

  async register(user) {
    console.log(`Creating user with email ${user.email}`);
    // Save image with higher quality
    user.picture = user.picture.replace('s96-c', 's384-c');
    return this.repositoryService.createUser(user);
  }

  async update(user) {
    console.log(`Updating user with email ${user.email}`);
    return this.repositoryService.updateUser(user);
  }
}

module.exports = UserController;
