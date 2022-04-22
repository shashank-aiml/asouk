const confirmRouter = require('express').Router();
const utils = require('../../utils/userUtils');
const recoverVerify = require('../../middleware/recoverVerifyMiddle').recoverVerify;

const mongoose = require('mongoose');
const User = mongoose.model('User');


confirmRouter.get('/confirmation/:token', async (req, res) => {
    const token = req.params.token;
    console.log(token);
    const verify = utils.verifyToken(token, 'email');
    if (verify.status == true) {
        await User.updateOne({ _id: verify.id }, { $set: { confirmed: true } }).then(() => { 
                res.redirect('http://localhost:8080/login')
             }).
            catch(err => console.log(err))
    } else {
        console.log('err');
    }
})

confirmRouter.get('/recover/:token',recoverVerify, async (req, res) => {
   res.json(req.json);
})


module.exports = confirmRouter;