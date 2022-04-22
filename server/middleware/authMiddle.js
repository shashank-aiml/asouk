const mongoose = require('mongoose');
const utils = require('../utils/userUtils');
const User = mongoose.model('User');

module.exports.authMiddle = async (req, res, next) =>{
    const Cookies = req.cookies;
    const jwt = Cookies.jwt;
    const status = utils.verifyToken(jwt);
    if(!!jwt && status.status){
        await User.findById(status.id).then(user => {
            if(user.token===jwt) {
                console.log('verified');
                req.authProp = {auth: true, user: {id:user._id, name: user.name, email: user.email, phone: user.phone}}
                next();
            }else{
                console.log('token expired or invalid');
                res.json({auth: false, msg: 'Token expired or invalid'});
                // next();
            }
        })
    }else{
        console.log('not verified');
        res.json({auth:false, msg: 'Token not verified'})
        }
}
