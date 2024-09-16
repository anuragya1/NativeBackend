import mongoose from "mongoose";
const task=new mongoose.Schema({
    title:String,
    description:String,
    priority:String,
    due_date:Date,
    category:String,
    creationDate:Date,
    Status:Boolean,
  
    UserId:String,
})

const taskman=mongoose.model('Tasks',task);
export default taskman;