const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
}, {timestamps: true});


const User = mongoose.model('User');
module.exports = User;