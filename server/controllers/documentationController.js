const Documentation = require('../models/Documentation');
const aiService = require('../services/aiService');

exports.generateSection = async (req, res, next) => {
  try {
    const { projectTitle, sectionName } = req.body;

    if (!projectTitle || !sectionName) {
      return res.status(400).json({ success: false, message: 'Project title and section name are required' });
    }

    // Limit check on free tier
    if (req.user.plan === 'free') {
      const count = await Documentation.countDocuments({ userId: req.user._id });
      if (count >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan allows only 1 project documentation. Upgrade to Premium for unlimited!'
        });
      }
    }

    const sectionContent = await aiService.generateDocSection(projectTitle, sectionName);

    let doc = await Documentation.findOne({ userId: req.user._id, projectTitle });

    if (!doc) {
      doc = new Documentation({
        userId: req.user._id,
        projectTitle,
        sections: {}
      });
    }

    // Assign dynamically
    doc.sections[sectionName] = sectionContent;
    await doc.save();

    res.json({ success: true, doc });
  } catch (error) {
    next(error);
  }
};

exports.getMyDocs = async (req, res, next) => {
  try {
    const docs = await Documentation.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, docs });
  } catch (error) {
    next(error);
  }
};

exports.getDocById = async (req, res, next) => {
  try {
    const doc = await Documentation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Documentation not found' });
    }
    res.json({ success: true, doc });
  } catch (error) {
    next(error);
  }
};

exports.deleteDoc = async (req, res, next) => {
  try {
    const doc = await Documentation.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Documentation not found' });
    }
    res.json({ success: true, message: 'Documentation deleted successfully' });
  } catch (error) {
    next(error);
  }
};
