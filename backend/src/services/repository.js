const User = require('../models/User');

// Make all queries to database using Repository class
class Repository {
    createUser(user) {
        return User.create(user);
    }

    updateUser(user) {
        return User.updateOne(
            { email: user.email },
            { refreshToken: user.refreshToken }
        );
    }

    findUser(email) {
        return User.findOne({
            email
        });
    }
};

module.exports = Repository;