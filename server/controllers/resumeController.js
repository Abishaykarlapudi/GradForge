const Resume = require('../models/Resume');

exports.createResume = async (req, res, next) => {
  try {
    const { title, template, personalInfo, education, experience, skills, projects, certifications } = req.body;

    // Enforce subscription limitation rules
    if (req.user.plan === 'free') {
      const count = await Resume.countDocuments({ userId: req.user._id });
      if (count >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Free Plan allows only 1 resume. Upgrade to Premium for unlimited access!'
        });
      }
    }

    const resume = await Resume.create({
      userId: req.user._id,
      title: title || 'New Resume',
      template: template || 'modern',
      personalInfo: personalInfo || {},
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      projects: projects || [],
      certifications: certifications || []
    });

    res.status(201).json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

exports.getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, resumes });
  } catch (error) {
    next(error);
  }
};

exports.getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

exports.updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const { title, template, personalInfo, education, experience, skills, projects, certifications } = req.body;
    
    resume.title = title || resume.title;
    resume.template = template || resume.template;
    resume.personalInfo = personalInfo || resume.personalInfo;
    resume.education = education || resume.education;
    resume.experience = experience || resume.experience;
    resume.skills = skills || resume.skills;
    resume.projects = projects || resume.projects;
    resume.certifications = certifications || resume.certifications;

    await resume.save();
    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    next(error);
  }
};
