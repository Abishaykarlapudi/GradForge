const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    default: 'My Resume'
  },
  template: {
    type: String,
    default: 'modern' // modern, minimal, cyber
  },
  personalInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  education: [{
    school: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startYear: { type: String, default: '' },
    endYear: { type: String, default: '' },
    gpa: { type: String, default: '' }
  }],
  experience: [{
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  skills: {
    type: [String],
    default: []
  },
  projects: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' }
  }],
  certifications: [{
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    year: { type: String, default: '' }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
