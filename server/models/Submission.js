const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: String,
  output: String,
  grade: {
    status: {
      type: String,
      enum: ['correct', 'incorrect', 'none'],
      default: 'none'
    },
    feedback: {
      type: String,
      default: ''
    }
  }
});

module.exports = mongoose.model('Submission', submissionSchema);
