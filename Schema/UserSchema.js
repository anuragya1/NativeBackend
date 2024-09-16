import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  creation_date: {
    type: Date,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  completion_date: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'In Progress','On Hold','Not Started'], 
    required: true
  }
}, {
  timestamps: true 
});


const User = model('User', userSchema);

export default User;