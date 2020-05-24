const express = require('express')
const router = express.Router()
const mongoose=require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt= require('jsonwebtoken');
const {JWT_SECRET}=require('../config')


router.post('/signup',(req,res)=>{
    const {name,email,password,pic,gender,username}=req.body
    if(!email || !password || !name || !gender || !username){
        res.status(422).json({error:"all entries required"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that mail"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                photo:pic,
                gender:gender,
                username
            })
    
            user.save()
            .then(user=>{
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
        
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json({error:"email and password are required"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid username or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,photo}=savedUser
                res.json({token,user:{_id,name,email,followers,following,photo}})
            }
            else{
                return res.status(422).json({error:"Invalid username or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


router.post('/username',(req,res)=>{
    User.findOne({username:req.body.username})
    .then(user=>{
        if(user){
            return res.status(422).json({error:"User already exists with that username"})
        }
        return res.json({message:"username available"})
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router