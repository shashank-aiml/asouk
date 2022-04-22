const userRouter = require('express').Router();
const mongoose = require('mongoose');
const SendMail = require('../../utils/sendMail');
const recover = require('../../utils/recoverUtils');
const utils = require('../../utils/userUtils')
const User = mongoose.model('User');
const genKeyPair = require('../../utils/generateKey');
const { recoverVerify } = require('../../middleware/recoverVerifyMiddle');

userRouter.get('/', function (req, res) {
    res.send('No Login Request');
})

userRouter.post('/', function (req, res) {
    const email = req.body.email;
    User.findOne({ email: email })
        .then(async (user) => {
            if (!user) {
                return res.json({ success: false, msg: 'e2' });
                // e2=InvalidEmail
            }
            else if(!!user && !user.confirmed) {
                return res.json({ success: false, msg: 'e3' });
                // e3=UnconfirmedEmail
            }else{
                keyPair = genKeyPair();
                await user.updateOne({keyPair: keyPair})
                const recoverTokenObject = recover.issueRecoverJWT(user, 'recover', keyPair);
                const url = `http://localhost:8080/profile/forgot/${recoverTokenObject.token}`
                SendMail({url});
                res.json({ success: true, msg: 'Email Send' });
            }})
})

userRouter.post('/reset/:token',recoverVerify, async function (req, res){
    const newPassword = req.body.password;
    const saltHash = utils.genPassword(req.body.password);
    if(req.json.success){
        await User.updateOne({_id:req.json.id}, {$set:{hash:saltHash.hash, salt:saltHash.salt}, $unset:{keyPair:''}})
        .then(()=>{

            res.json({success: true, message:'Updated successfully'});
        })
        .catch((err)=>{
            console.log(err);
            res.json({ success:false, message:'Error Occured'})
        })
    }else{
        res.json({success:true, message:'Sessioin Expired'})
    }
})
module.exports = userRouter;