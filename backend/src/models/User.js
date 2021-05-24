const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    refreshToken: { type: String, required: true },
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    ]

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;