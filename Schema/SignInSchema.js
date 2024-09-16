import mongoose from "mongoose";
const SignIn=new mongoose.Schema({
    user:String,
    email:String,
    password:String
})
const Sign=mongoose.model('Sign',SignIn);
export default Sign;