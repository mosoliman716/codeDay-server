import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { title, priority, status, dueDate } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newTask = new Task({
      user_id: userId,
      title,
      status,
      priority,
      dueDate,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasks = async (req, res) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tasks = await Task.find({ user_id: userId });
    res.status(201).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editTask = async (req, res) => {
  const { _id: taskId, title, status, priority, dueDate } = req.body;
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const task = await Task.findOne({ _id: taskId, user_id: userId });
    if (!task) {
      console.log("Task not found for editing:", taskId, userId);
      return res.status(404).json({ message: "Task not found" });
    }
    task.title = title || task.title;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { _id: taskId } = req.body;
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user_id: userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { addTask, getTasks, editTask, deleteTask };
