import express from 'express';
import bodyParser from 'body-parser';
import natural from 'natural';
import { promises as fs } from 'fs';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import taskman from './Schema/taskSchema.js';
import { fileURLToPath } from 'url';
import Sign from './Schema/SignInSchema.js';
import log from './Schema/LoginSchema.js';

const filePath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filePath);
const app = express();
app.use(bodyParser.json());
app.use(cors());

(async () => {
  const connectData = await mongoose.connect('mongodb+srv://anurag1086be22:Gojomadara123@cluster0.xp6yufo.mongodb.net/');
  if (connectData) console.log("Database connected");
  else console.log("Error while connecting to database");
})();

let taskData = [];
let tfidf = new natural.TfIdf();

async function loadTaskData() {
  try {
    const filePath = path.join(__dirname, 'realistic_user_tasks.json');
    const data = await fs.readFile(filePath, 'utf8');
    taskData = JSON.parse(data);
    console.log(`Loaded ${taskData.length} tasks.`);

    taskData.forEach((task) => {
      tfidf.addDocument(task.description);
    });
    console.log('TF-IDF initialized.');
  } catch (error) {
    console.error('Error loading task data:', error);
  }
}
function getRecommendations(taskId, topN = 5) {
  console.log(`Searching for task with ID: ${taskId}`);
  const taskIndex = taskData.findIndex(task => task.id === parseInt(taskId, 10));
  if (taskIndex === -1) {
    return [];
  }

  const taskDescription = taskData[taskIndex].description;
  const similarities = [];

  tfidf.tfidfs(taskDescription, (i, measure) => {
    if (i !== taskIndex && measure > 0) {
      similarities.push({ index: i, measure });
    }
  });


  similarities.sort((a, b) => b.measure - a.measure);


  const uniqueRecommendations = [];
  const seenTitles = new Set();

  for (const sim of similarities) {
    const task = taskData[sim.index];
    // console.log(task)
    if (!seenTitles.has(task.title)) {
      uniqueRecommendations.push({
        id: task.id,
        title: task.title,
        similarity: sim.measure,
        priority:task.priority,
        category:task.category,
        due_date:task.due_date
      });
      seenTitles.add(task.title);
    }
    if (uniqueRecommendations.length >= topN) {
      break;
    }
  }

  return uniqueRecommendations;
}


app.get('/', (req, res) => {
  console.log("under default");
  res.send("hello world aahuuu");
});



app.get('/getTask/:userid', async (req, res) => {
  try {
    const response = await taskman.find({UserId:req.params.userid});
    if (response) {
      console.log(response);
      res.json(response);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    console.log("Error has occurred", err);
  }
});
app.post('/DeleteTask', async (req, res) => {
  console.log("under delete")
  try {
    const taskToDelete = req.body;
    console.log("Task to delete:", taskToDelete);

    if (!taskToDelete.data || !taskToDelete.data._id) {
      return res.status(400).json({ error: "Invalid task data. _id is required." });
    }

    const response = await taskman.findByIdAndDelete({_id: taskToDelete.data._id});
    if (response) {
      console.log("Task deleted. Check your database.");
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "No task found with the given _id" });
    }
  } catch (err) {
    console.error("Error has occurred", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.put('/UpdateTask', async (req, res) => {
  console.log("Under update");
  try {
    const taskToUpdate = req.body;
    console.log("Task to update:", taskToUpdate.data._id);

    if (!taskToUpdate || !taskToUpdate.data._id) {
      return res.status(400).json({ error: "Invalid task data. _id is required." });
    }

    const response = await taskman.findByIdAndUpdate(
      { _id: taskToUpdate.data._id },
      taskToUpdate.data,
      { new: true, runValidators: false }
    );

    if (response) {
      console.log("Task updated. Check your database.");
      res.status(200).json({ message: "Task updated successfully", updatedTask: response });
    } else {
      res.status(404).json({ error: "No task found with the given _id" });
    }
  } catch (err) {
    console.error("Error has occurred", err.message);
    if (err.name === 'MongoError') {
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.post('/createTask', async (req, res) => {
  console.log("Under create task");
  console.log(req.body);
  const { title, creation_date, description, due_date, priority, UserId, category } = req.body;
  try {
    const createTemptask = new taskman({
      title: title,
      creationDate: creation_date,
      description: description,
      due_date: due_date,
      priority: priority,
      Status: false,
      UserId: UserId,
      category: category
    });
    console.log(createTemptask)
    const created = await createTemptask.save();
    if (created) {
      console.log("Temp task created. Check your database for more info.");
      res.sendStatus(200);
    } else {
      console.log('Error creating task');
    }
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
 
  console.log(`Server running on port ${PORT}`);
});
