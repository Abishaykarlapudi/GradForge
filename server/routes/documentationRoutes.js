const express = require('express');
const router = express.Router();
const { generateSection, getMyDocs, getDocById, deleteDoc } = require('../controllers/documentationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateSection);
router.get('/', getMyDocs);
router.get('/:id', getDocById);
router.delete('/:id', deleteDoc);

module.exports = router;
