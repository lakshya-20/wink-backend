const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Conversation =  mongoose.model("Conversation")
const User =  mongoose.model("User")

mongoose.set('useFindAndModify', false);

router.post('/createConversation',(req,res)=>{
    var conversationId=""
    const{lastactive,person1,person2}=req.body
    var list=[]
    list.push(person1)
    list.push(person2)
    const conversation=new Conversation({
        lastactive,
        person1,
        person2
    })
    Conversation.find({person1:{$in:[list[0],list[1]]},person2:{$in:[list[0],list[1]]}})
    .then((result)=>{
        if(result[0]){
            conversationId=result[0]._id
            res.json(conversationId)
        }
        else{
            conversation.save().then(result3=>{
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
                conversationId=result3._id
                res.json(conversationId)
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
        res.json({result})
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/conversationList',(req,res)=>{
    console.log("entered")
    Conversation.find()
    .populate("person1","_id name photo")
    .populate("person2","_id name photo")
    .populate("messages","data time senderId")
    .populate("messages.senderId","name photo")
    .then((result)=>{
        var arr=[]
        for(var i=0;i<result.length;i++){
            arr.push(result[i].person1._id,result[i].person2._id)
            id=req.body.id
            if((id!=arr[0])&&(id!=arr[1])){
                result.splice(i,1)
            }
            arr=[];
        }
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

router.get('/getConversation',(req,res)=>{
    result=[]
    res.json(result)
})


router.put('/deleteConversation/:id',(req,res)=>{
    Conversation.findOne({_id:req.params.id})
    .populate("person1","_id")
    .populate("person2","_id")
    .exec((err,conversation)=>{
        if(err||!conversation){
            return res.status(422).json({error:err})
        }
        if(conversation && !err){
            conversation.remove()
            .then(result=>{
                User.findByIdAndUpdate(result.person1._id,{
                    $pull:{conversations:{conversation:result._id}}
                },{
                    new:true
                }).exec((err1,res1)=>{
                })
                User.findByIdAndUpdate(result.person2._id,{
                    $pull:{conversations:{conversation:result._id}}
                },{
                    new:true
                }).exec((err1,res1)=>{
                })
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})


module.exports=router;