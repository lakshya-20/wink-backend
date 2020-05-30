const express = require('express')
const mongoose = require('mongoose')
const http = require('http');

//const socketio = require('socket.io');
const client = require('socket.io').listen(4000).sockets;


const {mongourl}=require('./config');
var connect=mongoose.connect(mongourl);
connect.then((db) =>{
  console.log('Connected correctly to mongodb');
},(err)=>{console.log(err)});

const app=express()
const PORT=process.env.PORT ||5000
const server=http.createServer(app);
require('./models/user')
require('./models/conversation')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/conversations'))
app.use(require('./routes/users'))


client.on('connection',function(socket){
  
  console.log("connected")
  socket.on('disconnect',function(){
    console.log("disconnected")
  })
  socket.on('input',function(conversationId,data){
    console.log("con",conversationId)
    client.emit('output',conversationId,data);
  })
});



app.listen(PORT,()=>{
    console.log("Server starting on port no: ",PORT)
})