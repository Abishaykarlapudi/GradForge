const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  wordCount: {
    type: Number,
    required: true
  },
  formatting: {
    type: String,
    enum: ['academic', 'standard', 'detailed'],
    default: 'academic'
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
