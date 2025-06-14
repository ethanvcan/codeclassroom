import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TeacherClassroomPage.css'; // CSS file for styling

const TeacherClassroomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null, message: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sampleInput: '',
    sampleOutput: ''
  });
  const [classroomName, setClassroomName] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || id.length !== 24) {
        console.error('Invalid classroom ID');
        return;
      }

      try {
        const classroomRes = await axios.get(`https://codeclassroom-backend.onrender.com/classrooms/${id}`);
        setClassroomName(classroomRes.data.name);

        const assignmentsRes = await axios.get(`https://codeclassroom-backend.onrender.com/assignments/classroom/${id}`);
        setAssignments(assignmentsRes.data);

        const studentsRes = await axios.get(`https://codeclassroom-backend.onrender.com/classrooms/${id}/students`);
        setStudents(studentsRes.data);
      } catch (err) {
        console.error('Error loading classroom page:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://codeclassroom-backend.onrender.com/assignments', {
        ...formData,
        classroomId: id
      });
      setFormData({ title: '', description: '', sampleInput: '', sampleOutput: '' });
      const res = await axios.get(`https://codeclassroom-backend.onrender.com/assignments/classroom/${id}`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKickStudent = async (studentId) => {
    try {
      await axios.post(`https://codeclassroom-backend.onrender.com/classrooms/${id}/kick`, { studentId });
      const res = await axios.get(`https://codeclassroom-backend.onrender.com/classrooms/${id}/students`);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to remove student:', err);
    }
  };

  return (
    <div className="teacher-dashboard-container">
      <div className="dashboard-header">
        <img src="/logo.png" alt="Logo" className="dashboard-logo" style={{ cursor: 'default' }}/>
        <h1 className="dashboard-title" style={{ cursor: 'default' }}>CodeClassroom</h1>
      </div>

      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/teacher-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="classroom-content">
        <h2>Classroom: {classroomName}</h2>

        <div className="assignment-section">
          <h3>Create Assignment</h3>
          <form onSubmit={handleCreate} className="assignment-form">
            <input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <textarea
              placeholder="Sample Input"
              value={formData.sampleInput}
              onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
            />
            <textarea
              placeholder="Sample Output"
              value={formData.sampleOutput}
              onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
            />
            <button type="submit" className="blue-button">Create</button>
          </form>
        </div>

        <div className="section-block">
          <h3>Assignments</h3>
          <ul className="item-list">
            {assignments.map(a => (
              <li key={a._id} className="assignment-item">
                <span
                  className="delete-assignment-button"
                  onClick={() => setConfirmModal({
                    open: true,
                    message: `Are you sure you want to delete "${a.title}"?`,
                    action: async () => {
                      try {
                        await axios.delete(`https://codeclassroom-backend.onrender.com/assignments/${a._id}`);
                        const updated = await axios.get(`https://codeclassroom-backend.onrender.com/assignments/classroom/${id}`);
                        setAssignments(updated.data);
                      } catch (err) {
                        console.error('Failed to delete assignment:', err);
                      }
                    }
                  })}
                >
                  ×
                </span>

                <button
                  className="assignment-link"
                  onClick={() => {
                    window.location.href = `/assignment/${a._id}/submissions`;
                  }}
                >
                  {a.title}
                </button>
              </li>
            ))}

          </ul>
        </div>

        <div className="section-block">
          <h3>Students</h3>
          <ul className="item-list">
            {students.map(s => (
              <li key={s._id} className="item-box">
                {s.username}
                <button
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      message: `Remove student "${s.username}" from the class?`,
                      action: () => handleKickStudent(s._id)
                    })
                  }
                  className="remove-button"
                >
                  Remove
                </button>
              </li>
            ))}

          </ul>
        </div>
      </div>
      {confirmModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{confirmModal.message}</p>
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setConfirmModal({ open: false })}>Cancel</button>
              <button className="modal-confirm" onClick={() => {
                confirmModal.action();
                setConfirmModal({ open: false });
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default TeacherClassroomPage;
