const wishRouter = require('express').Router();
const mongoose = require('mongoose')
const authMiddle = require('../../middleware/authMiddle').authMiddle;
const User = mongoose.model('User');

wishRouter.post('/add', authMiddle, async(req, res) => {
    const item = req.body.item;
    const id = item.name;
    const authProp = req.authProp;
        await User.findById(authProp.user.id)
        .then(async (user)=>{
            let wishArray = user.wishArray;
            let some = wishArray.find(o => o.id === id);
            if(!!some){
                res.json({auth: true, status:false, msg:'Item found'});
            }else{
                wishArray.push(item);
                console.log('something');
                await user.updateOne({wishArray: wishArray});
                res.json({auth: true, status:true, msg:'Item Added'})
            }
        }).catch((error)=>{
            console.log(error);
            res.status(404)
        });
})

wishRouter.get('/', authMiddle, async(req,res)=>{
    const userId = req.authProp.user.id;
    await User.findById(userId).then((user)=>{
        let wishArray = user.wishArray;
        res.json(wishArray);
    }).catch((error)=>{
        console.log(error);
        res.status(404);
    })
})

wishRouter.put('/remove', authMiddle, async(req, res)=>{
    const id = req.body.itemId;
    console.log(id);
    const userId = req.authProp.user.id;
    await User.findById(userId).then(async(user)=>{
        let wishArray = user.wishArray;
        let finalArray =[]
        wishArray.forEach((wish)=>{
            if(wish.id===id){}
            else{finalArray.push(wish)}
        })
        await user.updateOne({wishArray:finalArray});
        res.json({auth: true, status:true, msg:'Item Removed'})
    
    }).catch((error)=>{
        console.log(error);
        res.status(404);
    })
})
module.exports = wishRouter;