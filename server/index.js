const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const classroomRoutes = require('./routes/classroom');
app.use('/classrooms', classroomRoutes);

const assignmentRoutes = require('./routes/assignments');
app.use('/assignments', assignmentRoutes);

const submissionRoutes = require('./routes/submissions');
app.use('/submissions', submissionRoutes);

const runRoute = require('./routes/run');
app.use('/run', runRoute);


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/classroom', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Simple test route
app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
