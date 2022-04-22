const recover = require('../utils/recoverUtils');
const base64url = require('base64url');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.recoverVerify = async (req, res, next) =>{
    const token = req.params.token;
    const tokenParts = token.split('.');
    const payload = base64url.decode(tokenParts[1]);
    const id = JSON.parse(payload).sub;
    User.findById(id).then(async(user) => {
        const keyPair = user.keyPair;
        const verify = recover.verifyRecoverJWT(token, keyPair);
        if (verify.status == true) {
            req.json={success:true, message:'Verified', id:id};
            next();
        } else {
            console.log('err');
            req.json={success:false, message:'404'};
            next();
        }
    })
}
