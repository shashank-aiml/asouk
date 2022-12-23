const userRouter = require('express').Router();
const mongoose = require('mongoose');
const utils = require('../../utils/userUtils');
const User = mongoose.model('User');

userRouter.get('/', async function(req, res){
    console.log();
    const Cookies = req.cookies;
    const jwt = Cookies.jwt;
    const status = utils.verifyToken(jwt, 'session');

    if(!!jwt && status.status){
        console.log('verified');
        const id =  status.id;
        await User.updateOne({_id: id},{$unset:{token:'', expire:''}})
        let options = {
            maxAge: 1,
        }
        res.clearCookie('jwt').json({loggedOut:true})
    }else{
        console.log('not verified');
        res.json({loggedOut:false})}
})
module.exports = userRouter;