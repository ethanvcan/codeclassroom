const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// POST create assignment
router.post('/', async (req, res) => {
  const { title, description, sampleInput, sampleOutput, classroomId } = req.body;

  try {
    const assignment = new Assignment({
      title,
      description,
      sampleInput,
      sampleOutput,
      classroomId
    });

    await assignment.save();
    res.json({ message: 'Assignment created', assignment });
  } catch (err) {
    console.error('Assignment creation failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET all assignments for a classroom
router.get('/classroom/:classroomId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ classroomId: req.params.classroomId });
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

// GET assignment info by ID
router.get('/info/:id', async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Not found' });
  res.json(assignment);
});

// DELETE an assignment by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error('Failed to delete assignment:', err);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});


module.exports = router;
