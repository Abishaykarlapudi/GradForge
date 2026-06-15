const User = require('../models/User');
const Resume = require('../models/Resume');
const Portfolio = require('../models/Portfolio');
const Assignment = require('../models/Assignment');
const Subscription = require('../models/Subscription');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

exports.toggleSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newPlan = user.plan === 'free' ? 'premium' : 'free';
    user.plan = newPlan;
    await user.save();

    // Sync in Subscription schema
    await Subscription.findOneAndUpdate(
      { userId: user._id },
      { 
        plan: newPlan, 
        status: 'active', 
        endDate: newPlan === 'premium' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null 
      },
      { upsert: true }
    );

    res.json({ success: true, message: `User upgraded to ${newPlan}`, user });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalResumes = await Resume.countDocuments({});
    const totalPortfolios = await Portfolio.countDocuments({});
    const totalAssignments = await Assignment.countDocuments({});
    const premiumUsers = await User.countDocuments({ plan: 'premium' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalResumes,
        totalPortfolios,
        totalAssignments,
        premiumUsers
      }
    });
  } catch (error) {
    next(error);
  }
};
