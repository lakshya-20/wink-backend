const express = require('express')
const mongoose = require('mongoose')


const {mongourl}=require('./config');
var connect=mongoose.connect(mongourl);
connect.then((db) =>{
  console.log('Connected correctly to mongodb');
},(err)=>{console.log(err)});

const app=express()
const PORT=process.env.PORT ||5000


app.use(express.json())


app.listen(PORT,()=>{
    console.log("Server starting on port no: ",PORT)
})