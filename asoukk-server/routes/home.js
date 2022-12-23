const homeRouter = require('express').Router();
const mongoose = require('mongoose');
const Home = mongoose.model('Home');

homeRouter.get('/', async function(req, res){
    const data = await Home.find()
    res.send(data);
})

module.exports = homeRouter;