const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;


const conversationSchema = new mongoose.Schema({
    messages:[{
    data:String,
    senderId:{type:ObjectId,ref:"User"},
    time:{type:String,default:dateTime},
    }]
},{timestamps:true})

mongoose.model("Conversation",conversationSchema)