const Project = require('../models/Project');
const aiService = require('../services/aiService');

exports.generateIdeas = async (req, res, next) => {
  try {
    const { category, keywords } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Project category (Full Stack, Machine Learning, Deep Learning) is required' });
    }

    const ideas = await aiService.generateProjectIdeas(category, keywords);
    res.json({ success: true, ideas });
  } catch (error) {
    next(error);
  }
};

exports.generateDetails = async (req, res, next) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Please provide project title and category' });
    }

    // Limit check on free tier
    if (req.user.plan === 'free') {
      const count = await Project.countDocuments({ userId: req.user._id });
      if (count >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan allows only 1 project generation. Upgrade to Premium for unlimited!'
        });
      }
    }

    const details = await aiService.generateProjectDetails(title, category);
    
    // Auto-save generated details
    const project = await Project.create({
      userId: req.user._id,
      category,
      title: details.title || title,
      description: details.description || '',
      techStack: details.techStack || [],
      roadmap: details.roadmap || [],
      databaseSchema: details.databaseSchema || '',
      architecture: details.architecture || '',
      starterTemplateUrl: details.starterTemplateUrl || '',
      deploymentGuide: details.deploymentGuide || ''
    });

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
