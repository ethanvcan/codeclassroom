const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const authMiddleware = require('../middleware/authMiddleware');


// Get all submissions for a specific assignment
router.get('/by-assignment/:id', async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'username');
    
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { assignment, classroom, student, code, output } = req.body;

  try {
    let existing = await Submission.findOne({ assignment, student });

    if (existing) {
      // Update existing submission
      existing.code = code;
      existing.output = output;
      await existing.save();
      return res.status(200).json({ message: 'Submission updated' });
    }

    // Else create new one
    const newSubmission = new Submission({ assignment, classroom, student, code, output });
    await newSubmission.save();
    res.status(201).json({ message: 'Submission created' });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /submissions/status/:studentId/:assignmentId
router.get('/status/:studentId/:assignmentId', async (req, res) => {
  const { studentId, assignmentId } = req.params;
  try {
    const submission = await Submission.findOne({
      student: studentId,
      assignment: assignmentId
    });

    res.json({
      submitted: !!submission,
      grade: submission?.grade || { status: 'none', feedback: '' }
    });
  } catch (err) {
    console.error('Error checking submission status:', err);
    res.status(500).json({ submitted: false, grade: { status: 'none', feedback: '' } });
  }
});


// PATCH /submissions/:id/grade
router.patch('/:id/grade', async (req, res) => {
  const { status, feedback } = req.body;
  try {
    const updated = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade: { status, feedback } },
      { new: true }
    );
    res.json({ message: 'Grade saved', submission: updated });
  } catch (err) {
    console.error('Error updating grade:', err);
    res.status(500).json({ message: 'Failed to save grade' });
  }
});



module.exports = router;
