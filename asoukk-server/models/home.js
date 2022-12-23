const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    type:String
});

mongoose.model('Home', HomeSchema, 'home');