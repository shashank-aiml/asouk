const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
    _id:String,
    query: String,
    sort: String,
    prange1: String,
    prange2: String,
    start: Date,
    data: Object,
});

mongoose.model('Search', SearchSchema, 'searches');