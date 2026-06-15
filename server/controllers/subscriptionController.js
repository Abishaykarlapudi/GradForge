const Subscription = require('../models/Subscription');
const User = require('../models/User');

exports.checkoutPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.plan = 'premium';
    await user.save();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 Days

    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user._id },
      {
        plan: 'premium',
        status: 'active',
        startDate: new Date(),
        endDate
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Subscription upgraded to Premium successfully!',
      subscription,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        plan: user.plan
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubscriptionStatus = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    res.json({ success: true, subscription });
  } catch (error) {
    next(error);
  }
};
