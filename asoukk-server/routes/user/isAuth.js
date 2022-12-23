const userRouter = require('express').Router();
const authMiddle = require('../../middleware/authMiddle').authMiddle;

userRouter.get('/', authMiddle, async function (req, res){
        const authProp = req.authProp;
        res.json(authProp);
})
module.exports = userRouter;