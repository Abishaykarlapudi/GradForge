const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Full Stack', 'Machine Learning', 'Deep Learning'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: {
    type: [String],
    default: []
  },
  roadmap: {
    type: [String],
    default: []
  },
  databaseSchema: {
    type: String,
    default: ''
  },
  architecture: {
    type: String,
    default: ''
  },
  starterTemplateUrl: {
    type: String,
    default: ''
  },
  deploymentGuide: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
