const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Conversation =  mongoose.model("Conversation")
const User =  mongoose.model("User")

mongoose.set('useFindAndModify', false);

router.post('/createConversation',(req,res)=>{
    var conversationId=""
    const{lastactive,person1,person2}=req.body
    const conversation=new Conversation({
        lastactive,
        person1,
        person2
    })
    Conversation.find({person1:person1,person2:person2})
    .then((result)=>{
        if(result){
            conversationId=result[0]._id
            res.json({conversationId})
        }
        else{
            conversation.save().then(result=>{
                conversationId=result._id
                const con1={
                    person:result.person2,
                    conversation:conversationId
                }
                const con2={
                    person:result.person1,
                    conversation:conversationId
                }
                User.findByIdAndUpdate(result.person1,{
                    $push:{conversations:con1}
                }).then(result1=>{
                })
                User.findByIdAndUpdate(result.person2,{
                    $push:{conversations:con2}
                }).then(result2=>{
                })
                res.redirect(result[0]._id)
            })
            .catch(err=>{
                console.log(err)    
            })
            
        }
        
    }).catch((err)=>{
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
            res.redirect(`/getConversation/${result._id}`)
        }
    })
})

router.get('/conversationList',(req,res)=>{
    console.log("entered")
    Conversation.find()
    .populate("person1","_id name photo")
    .populate("person2","_id name photo")
    .populate("messages","data time senderId")
    .populate("messages.senderId","name photo")
    .then((result)=>{
        //var message=result[0].messages.pop()
        res.json({result})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/getConversation/:id',(req,res)=>{
    console.log("entered2")
    Conversation.findById(req.params.id)
    .populate("person1","_id name photo")
    .populate("person2","_id name photo")
    .populate("messages","data time senderId")
    .populate("messages.senderId","name photo")
    .then((result)=>{
        res.json(result)
    }).catch((err)=>{
        console.log(err)
    })
})



module.exports=router;