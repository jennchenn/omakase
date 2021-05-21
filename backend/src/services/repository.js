const User = require('../models/User');

// Make all queries to database using Repository class
class Repository {
    createUser(email, passwordHash) {
        const user = {
            email: email,
            password: passwordHash
        };
        return User.create(user);
    }

    findUser(email) {
        return User.findOne({
            email
        });
    }
};

module.exports = Repository;