const express = require('express');
const router = express.Router();
const { checkoutPremium, getSubscriptionStatus } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/checkout', checkoutPremium);
router.get('/status', getSubscriptionStatus);

module.exports = router;
