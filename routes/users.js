const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User =  mongoose.model("User")

router.post('/searchUsers',(req,res)=>{
    if(req.body.query!=''){
        let userPattern=new RegExp("^"+req.body.query)
        User.find({name:{$regex:userPattern}})
        .select("_id name photo")
        .then(user=>{
            for(var i=0;i<user.length;i++){
                if(user[i]._id==req.body.id){
                    user.splice(i,1)
                }
            }
            res.json({user})
        }).catch(err=>{
            console.log(err)
        })
    }
})




module.exports=router;