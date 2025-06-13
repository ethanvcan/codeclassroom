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
  try {
    const { assignment, classroom, student, code, output } = req.body;

    console.log('Incoming submission:', req.body); // ← Add this!

    const submission = new Submission({
      assignment,
      classroom,
      student,
      code,
      output
    });

    await submission.save();
    res.json({ message: 'Submission saved!' });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ message: 'Server error saving submission' });
  }
});



module.exports = router;
