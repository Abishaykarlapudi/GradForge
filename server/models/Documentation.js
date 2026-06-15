const mongoose = require('mongoose');

const documentationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  sections: {
    abstract: { type: String, default: '' },
    introduction: { type: String, default: '' },
    literatureSurvey: { type: String, default: '' },
    srs: { type: String, default: '' },
    erDiagramDesc: { type: String, default: '' },
    umlDiagramDesc: { type: String, default: '' },
    methodology: { type: String, default: '' },
    conclusion: { type: String, default: '' },
    references: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Documentation', documentationSchema);
