const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"https://drive.google.com/uc?id=1a6RhWRlSfZ8sLpyJydE8RCIDjkHsLlDy"
    },
    conversations:[{
    type:ObjectId,
    ref:"Conversation"
    }]
},{timestamps:true})


mongoose.model("User",userSchema)