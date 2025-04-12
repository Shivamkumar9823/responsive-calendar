const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);