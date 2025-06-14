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
    const updatedSubmission = await Submission.findOneAndUpdate(
      { assignment, student },               // Match student + assignment
      { assignment, classroom, student, code, output }, // Data to set/update
      { upsert: true, new: true }            // Create if not exists, return updated
    );

    res.status(200).json(updatedSubmission);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



module.exports = router;
