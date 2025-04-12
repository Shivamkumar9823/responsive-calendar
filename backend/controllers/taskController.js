const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const { goalId } = req.query;
    let query = {};
    
    if (goalId) {
      query.goalId = goalId;
    }
    
    const tasks = await Task.find(query).populate('goalId');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate('goalId');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true }).populate('goalId');
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
