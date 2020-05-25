const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Conversation =  mongoose.model("Conversation")

router.post('/createConversation',(req,res)=>{
    const{lastactive,person1,person2}=req.body
    const conversation=new Conversation({
        lastactive,
        person1,
        person2
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

router.get('/conversationList',(req,res)=>{
    Conversation.find()
    .populate("person1","_id name photo")
    .populate("person2","_id name photo")
    .populate("messages","data time senderId")
    .then((result)=>{
        res.json({result})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router;