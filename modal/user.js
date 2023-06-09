const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:2,
        max:50,
    },
    email:{
        type:String,
        required:true,
        mix:50,
    },
    password:{
        type:String,
        required:true,
        min:5,
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

const User = mongoose.model("User",UserSchema);
module.exports =  User;