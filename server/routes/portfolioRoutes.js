const express = require('express');
const router = express.Router();
const { savePortfolio, getPortfolio, getPublicPortfolio, submitContactMessage, uploadAvatar } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');
const { upload, uploadToCloudinary } = require('../middleware/uploadMiddleware');

// Public endpoints (accessed by portfolio visitors)
router.get('/public/:slug', getPublicPortfolio);
router.post('/contact/:slug', submitContactMessage);

// Protected endpoints (accessed by authenticated students)
router.post('/', protect, savePortfolio);
router.get('/me', protect, getPortfolio);
router.post('/upload', protect, upload.single('avatar'), uploadToCloudinary, uploadAvatar);

module.exports = router;
