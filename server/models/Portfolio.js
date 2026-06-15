const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  template: {
    type: String,
    default: 'dark-glass' // dark-glass, neon-cyber, light-minimal
  },
  personalInfo: {
    name: { type: String, default: '' },
    title: { type: String, default: '' }, // e.g. "Full Stack Developer"
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    email: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  projects: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    demoUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' }
  }],
  skills: [{
    category: { type: String, default: '' }, // e.g. "Languages"
    list: { type: [String], default: [] }
  }],
  contactMessages: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

portfolioSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
