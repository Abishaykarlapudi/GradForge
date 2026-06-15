const Assignment = require('../models/Assignment');
const aiService = require('../services/aiService');

exports.generateAssignment = async (req, res, next) => {
  try {
    const { topic, wordCount, formatting } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Assignment topic is required' });
    }

    // Free plan restriction on assignment generation length or limit
    if (req.user.plan === 'free') {
      const count = await Assignment.countDocuments({ userId: req.user._id });
      if (count >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan allows only 2 assignments. Upgrade to Premium for unlimited!'
        });
      }
    }

    const requestedWords = parseInt(wordCount || '500');
    const content = await aiService.generateAssignment(topic, requestedWords, formatting || 'academic');

    const assignment = await Assignment.create({
      userId: req.user._id,
      topic,
      wordCount: requestedWords,
      formatting: formatting || 'academic',
      content
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

exports.getMyAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    next(error);
  }
};

exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
