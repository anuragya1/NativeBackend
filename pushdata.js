import fs from 'fs';
import mongoose from 'mongoose';
import User from './Schema/UserSchema.js'; 
const mongoURI = 'mongodb+srv://anurag1086be22:Gojomadara123@cluster0.xp6yufo.mongodb.net/';

async function importData() {
  try {
    await mongoose.connect(mongoURI);


    const data = JSON.parse(fs.readFileSync('./realistic_user_tasks.json', 'utf8'));
    await User.insertMany(data);

    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the import function
importData();
