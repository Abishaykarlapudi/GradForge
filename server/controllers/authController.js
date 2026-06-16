const User = require('../models/User');
const TemporaryUser = require('../models/TemporaryUser');
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gradforge_secret_jwt_key_123', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Store in TemporaryUser (upsert so subsequent registration attempts with same email overwrite the old request)
    await TemporaryUser.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        name,
        password: hashedPassword,
        otp: hashedOtp,
        attempts: 0,
        lastSentAt: Date.now(),
        createdAt: Date.now() // resets 10-minute expiry
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP to email asynchronously in the background (no await)
    sendMail({
      to: email.toLowerCase().trim(),
      subject: 'GradForge Email Verification Code',
      text: `Your GradForge verification OTP code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6d28d9; text-align: center;">Welcome to GradForge!</h2>
          <p>Thank you for signing up. Please verify your email address using the following 6-digit OTP code:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 5px; background: #f3f4f6; padding: 10px 20px; border-radius: 5px; color: #1f2937;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 12px; text-align: center;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      `
    }).catch(err => {
      console.error('[ASYNC SMTP ERROR] Failed to send email in background:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Verification OTP sent to your email.',
      verificationToken: otp // Exposing token directly for on-screen prompt bypass helper
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
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

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'OTP is required' });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const tempUser = await TemporaryUser.findOne({ email: email.toLowerCase().trim() });
    if (!tempUser) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification OTP' });
    }

    // Check failed attempts
    if (tempUser.attempts >= 5) {
      await TemporaryUser.deleteOne({ _id: tempUser._id });
      return res.status(400).json({ success: false, message: 'Too many failed verification attempts. Please sign up again.' });
    }

    // Increment attempts count
    tempUser.attempts += 1;
    await tempUser.save();

    // Verify OTP
    const isOtpMatch = await bcrypt.compare(token, tempUser.otp);
    if (!isOtpMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect verification OTP' });
    }

    // Check if user already exists (just in case they registered/verified in a concurrent request)
    let user = await User.findOne({ email: tempUser.email });
    if (!user) {
      // Create user in the database
      user = await User.create({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password, // already hashed
        isVerified: true
      });

      // Create free subscription record
      await Subscription.create({
        userId: user._id,
        plan: 'free',
        status: 'active'
      });
    }

    // Delete temporary user record
    await TemporaryUser.deleteOne({ _id: tempUser._id });

    res.json({
      success: true,
      message: 'Email verified and logged in successfully.',
      token: generateToken(user._id),
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user with that email exists' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    const text = `You requested a password reset. Please click on the link to reset your password: ${resetUrl} \n\nToken: ${resetToken}`;
    await sendMail({
      to: user.email,
      subject: 'GradForge Password Reset',
      text,
      html: `<p>You requested a password reset.</p><p>Please click <a href="${resetUrl}">here</a> to reset your password or use the token below:</p><strong>${resetToken}</strong>`
    });

    res.json({
      success: true,
      message: 'Reset token generated successfully.',
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isVerified: req.user.isVerified,
        plan: req.user.plan
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const emailKey = email.toLowerCase().trim();

    // Check if the user is already verified and exists in permanent database
    const user = await User.findOne({ email: emailKey });
    if (user) {
      return res.status(400).json({ success: false, message: 'Account is already verified' });
    }

    // Check if there is an active temporary registration
    const tempUser = await TemporaryUser.findOne({ email: emailKey });
    if (!tempUser) {
      return res.status(404).json({ success: false, message: `No pending registration found for email: ${email}. Please sign up first.` });
    }

    // Rate Limiting: 60 seconds between resends
    const timeSinceLastSend = Date.now() - new Date(tempUser.lastSentAt).getTime();
    if (timeSinceLastSend < 60000) {
      const secondsLeft = Math.ceil((60000 - timeSinceLastSend) / 1000);
      return res.status(429).json({ success: false, message: `Please wait ${secondsLeft} seconds before requesting a new OTP.` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    tempUser.otp = hashedOtp;
    tempUser.attempts = 0;
    tempUser.lastSentAt = Date.now();
    tempUser.createdAt = Date.now(); // reset the 10-minute expiry
    await tempUser.save();

    // Resend the email asynchronously in the background (no await)
    sendMail({
      to: tempUser.email,
      subject: 'GradForge Email Verification Code (Resend)',
      text: `Your new GradForge verification OTP code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #6d28d9; text-align: center;">Welcome to GradForge!</h2>
          <p>Please use the following 6-digit OTP code to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 5px; background: #f3f4f6; padding: 10px 20px; border-radius: 5px; color: #1f2937;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 12px; text-align: center;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      `
    }).catch(err => {
      console.error('[ASYNC SMTP ERROR] Failed to resend email in background:', err.message);
    });

    res.json({
      success: true,
      message: 'Verification OTP sent successfully.',
      verificationToken: otp
    });
  } catch (error) {
    next(error);
  }
};
