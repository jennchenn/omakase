const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

}, { timestamps: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;