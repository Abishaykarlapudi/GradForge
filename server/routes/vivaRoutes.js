const express = require('express');
const router = express.Router();
const { startViva, submitVivaAnswers, getMyVivaSessions } = require('../controllers/vivaController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startViva);
router.post('/submit', submitVivaAnswers);
router.get('/', getMyVivaSessions);

module.exports = router;
