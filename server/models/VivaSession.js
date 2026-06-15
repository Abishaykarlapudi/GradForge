const mongoose = require('mongoose');

const vivaSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  questions: [{
    question: { type: String, required: true },
    correctAnswer: { type: String, default: '' },
    studentAnswer: { type: String, default: '' },
    feedback: { type: String, default: '' },
    isCorrect: { type: Boolean, default: null }
  }],
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VivaSession', vivaSessionSchema);
