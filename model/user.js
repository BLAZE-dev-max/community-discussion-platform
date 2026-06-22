const mongoose=require("mongoose")
const UserSchema=new mongoose.Schema({
    fullname:String,
    EmailAddress:String,
    password:String
    




})
const User=mongoose.model("User",UserSchema)
module.exports=User