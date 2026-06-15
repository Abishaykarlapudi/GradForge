const express = require('express');
const router = express.Router();
const { getUsers, toggleSubscription, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(admin);

router.get('/users', getUsers);
router.put('/users/toggle-subscription/:id', toggleSubscription);
router.get('/stats', getStats);

module.exports = router;
