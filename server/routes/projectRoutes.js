const express = require('express');
const router = express.Router();
const { generateIdeas, generateDetails, getMyProjects, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate-ideas', generateIdeas);
router.post('/generate-details', generateDetails);
router.get('/', getMyProjects);
router.delete('/:id', deleteProject);

module.exports = router;
