const userRouter = require('express').Router();
const mongoose = require('mongoose');
const SendMail = require('../../utils/sendMail');
const utils = require('../../utils/userUtils');
const User = mongoose.model('User');

userRouter.post('/', function (req, res) {
    const saltHash = utils.genPassword(req.body.password);
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        salt: saltHash.salt,
        hash: saltHash.hash,
        confirmed: false,
    });
    User.findOne({ email: req.body.email }).
    then((user) => {
        if (!user) {
            newUser.save()
                .then((user) => {
                    const emailjwt = utils.issueJWT(user);
                    const url = `http://localhost:5000/user/verify/confirmation/${emailjwt.token}`
                    console.log(emailjwt.token)
                    SendMail({ url: url })
                    res.json({ success: true, msg: 'Email Send' });
                });
        }
        if(!!user && !user.confirmed){
            user.delete();
            newUser.save()
                .then((user) => {
                    const emailjwt = utils.issueJWT(user, 'email');
                    const url = `http://localhost:5000/user/verify/confirmation/${emailjwt.token}`
                    SendMail({ url: url })
                    res.json({ success: true, msg: 'Email Send' });
                });
        }
        else {
            res.json({ success: false, msg: 'Email already exists' })
        
    }
    }).catch((err) => {
        console.log(err);
        return res.status(401).json({ success: false, msg: "Could not connect" });
    });
})

userRouter.get('/', function (req, res) {
    res.send('No Get Request')
})

module.exports = userRouter;