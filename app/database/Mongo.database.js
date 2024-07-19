require('dotenv').config();
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)




mongoose.connect(process.env.MONGODB_URI 
    ).then((data)=>{
        console.log('DATABASE CONNECTION SET')
    }).catch((err)=>{
        console.log(err)
    })