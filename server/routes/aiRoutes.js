const express = require('express');
const router = express.Router();
const { chat, getChats } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/chat', chat);
router.get('/chats', getChats);

module.exports = router;
