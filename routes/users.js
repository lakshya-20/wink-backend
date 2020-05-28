const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User =  mongoose.model("User")

router.post('/searchUsers',(req,res)=>{
    let userPattern=new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern}})
    .select("_id name photo")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})




module.exports=router;