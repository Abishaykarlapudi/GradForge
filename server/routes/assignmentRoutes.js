const express = require('express');
const router = express.Router();
const { generateAssignment, getMyAssignments, getAssignmentById, deleteAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateAssignment);
router.get('/', getMyAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);

module.exports = router;
