const Portfolio = require('../models/Portfolio');

exports.savePortfolio = async (req, res, next) => {
  try {
    const { slug, template, personalInfo, projects, skills, isPublished } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Custom subdomain slug is required' });
    }

    // Prevent duplicate slugs across users
    const existing = await Portfolio.findOne({ slug, userId: { $ne: req.user._id } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This slug URL is already taken by another user' });
    }

    let portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      // Limit check
      if (req.user.plan === 'free') {
        const count = await Portfolio.countDocuments({ userId: req.user._id });
        if (count >= 1) {
          return res.status(403).json({
            success: false,
            message: 'Free Plan allows only 1 portfolio. Upgrade to Premium for unlimited!'
          });
        }
      }

      portfolio = await Portfolio.create({
        userId: req.user._id,
        slug,
        template: template || 'dark-glass',
        personalInfo: personalInfo || {},
        projects: projects || [],
        skills: skills || [],
        isPublished: isPublished !== undefined ? isPublished : false
      });
    } else {
      portfolio.slug = slug;
      portfolio.template = template || portfolio.template;
      portfolio.personalInfo = personalInfo || portfolio.personalInfo;
      portfolio.projects = projects || portfolio.projects;
      portfolio.skills = skills || portfolio.skills;
      portfolio.isPublished = isPublished !== undefined ? isPublished : portfolio.isPublished;

      await portfolio.save();
    }

    res.json({ success: true, portfolio });
  } catch (error) {
    next(error);
  }
};

exports.getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not created yet' });
    }
    res.json({ success: true, portfolio });
  } catch (error) {
    next(error);
  }
};

exports.getPublicPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, isPublished: true });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found or private' });
    }
    res.json({ success: true, portfolio });
  } catch (error) {
    next(error);
  }
};

exports.submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    portfolio.contactMessages.push({ name, email, message });
    await portfolio.save();

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }
    res.json({ success: true, url: req.file.path });
  } catch (error) {
    next(error);
  }
};
