const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    salt: String,
    hash: String,
    confirmed:Boolean,
    token: String,
    expire: String,
    wishArray:Array,
    keyPair:Object
});

mongoose.model('User', UserSchema, 'users');