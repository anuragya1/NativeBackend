import mongoose from "mongoose";
const Login=new mongoose.Schema({
    title:String,
    Description:String,
    priority:String,
    Due_date:Date,
    category:String,
    creationDate:Date,
    Status:Boolean,
    CompletionDate:Date
})
const Log=mongoose.model('login',Login);
export default Log;