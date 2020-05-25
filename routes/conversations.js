const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Conversation =  mongoose.model("Conversation")

router.post('/createConversation',(req,res)=>{
    const{lastactive}=req.body
    const conversation=new Conversation({
        lastactive
    })
    conversation.save().then(result=>{
        res.json({conversation:result})
    })
    .catch(err=>{
        console.log(err)    
    })
})

router.post('/createMessage',(req,res)=>{
    const message={
        data:req.body.data,
        senderId:req.body.senderId,
    }
    Conversation.findByIdAndUpdate(req.body.conversationId,{
        $push:{messages:message}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})



module.exports=router;