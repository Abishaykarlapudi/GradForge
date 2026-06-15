const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, forgotPassword, resetPassword, getMe, resendVerification } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);
router.get('/me', protect, getMe);

module.exports = router;
