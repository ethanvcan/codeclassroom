const express = require('express');
const router = express.Router();
const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Create Classroom
router.post('/create', async (req, res) => {
    const { name, teacherId } = req.body;
  
    if (!name || !teacherId) {
      return res.status(400).json({ message: 'Missing name or teacherId' });
    }
  
    try {
      const newClassroom = new Classroom({
        name,
        teacher: teacherId,
        students: []
      });
      await newClassroom.save();
      res.json(newClassroom);
    } catch (err) {
      console.error(err);
      console.error('Error creating classroom:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Add Student
router.post('/addStudent', async (req, res) => {
  const { classroomId, studentId } = req.body;
  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    classroom.students.push(studentId);
    await classroom.save();
    res.json({ message: 'Student added successfully' });
    } catch (err) {
    console.error(err);  // 👈 log the error
    res.status(500).json({ message: 'Server error', error: err.message });
    }
  
});

// Get classrooms by teacher
router.get('/by-teacher/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    try {
      const classrooms = await Classroom.find({ teacher: teacherId });
      res.json(classrooms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

// get classsrooms by srudnet
router.get('/by-student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const classrooms = await Classroom.find({ students: studentId });
        res.json(classrooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
  
// Add student to a classroom using class code (ID)
router.post('/join', async (req, res) => {
    const { classroomId, studentId } = req.body;

    if (!classroomId || !studentId) {
        return res.status(400).json({ message: 'Missing classroomId or studentId' });
    }

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
        return res.status(404).json({ message: 'Classroom not found' });
        }
        // Prevent duplicates
        if (!classroom.students.includes(studentId)) {
        classroom.students.push(studentId);
        await classroom.save();
        }

        res.json({ message: 'Joined classroom successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get students in a classroom
router.get('/:id/students', async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id).populate('students', 'username');
        if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
        res.json(classroom.students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Kick a student from a classroom
router.post('/:id/kick', async (req, res) => {
    const { studentId } = req.body;
  
    try {
      const classroom = await Classroom.findById(req.params.id);
      if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
  
      classroom.students = classroom.students.filter(id => id.toString() !== studentId);
      await classroom.save();
  
      res.json({ message: 'Student removed' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
});

  
// GET classroom by ID
router.get('/:id', async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
    res.json(classroom);
  } catch (err) {
    console.error('Failed to fetch classroom by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//DELEte classroom by ID
router.delete('/:id', async (req, res) => {
  try {
    const classroomId = req.params.id;
    await Classroom.findByIdAndDelete(classroomId);
    res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete classroom' });
  }
});



module.exports = router;
