import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const username = localStorage.getItem('username');
  const teacherId = localStorage.getItem('userId');
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);


  useEffect(() => {
    if (localStorage.getItem('role') !== 'teacher') {
      window.location.href = '/login';
    }
    fetchClassrooms();
  }, [teacherId]);

  const fetchClassrooms = async () => {
    try {
      const res = await axios.get(`https://codeclassroom-backend.onrender.com/classrooms/by-teacher/${teacherId}`);
      setClassrooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://codeclassroom-backend.onrender.com/classrooms/create', {
        name: newClassroomName,
        teacherId
      });
      setNewClassroomName('');
      fetchClassrooms();
    } catch (err) {
      console.error(err);
    }
  };

  // const handleDeleteClassroom = async (id, name) => {
  //   const confirm = window.confirm(`Are you sure you want to delete the classroom "${name}"?`);
  //   if (!confirm) return;

  //   try {
  //     await axios.delete(`http://localhost:8000/classrooms/${id}`);
  //     fetchClassrooms();
  //   } catch (err) {
  //     console.error('Failed to delete classroom:', err);
  //   }
  // };

  const handleLogout = () => {
    window.location.href = '/login';
  };
  

  return (
    <div className="teacher-dashboard-container">
      <div className="dashboard-header">
        <img src="/logo.png" alt="Logo" className="dashboard-logo" style={{ cursor: 'default' }}/>
        <h1 className="dashboard-title" style={{ cursor: 'default' }}>CodeClassroom</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>

      </div>
      
      <div className="teacher-card">
        <h2>Welcome, {username} (Teacher)</h2>
        <form onSubmit={handleCreateClassroom} className="create-class-form">
          <input
            value={newClassroomName}
            onChange={(e) => setNewClassroomName(e.target.value)}
            placeholder="Enter new classroom name"
            className="create-class-input"
          />
          <button type="submit" className="create-class-btn">Create Classroom</button>
        </form>
      </div>

      <h3 className="section-title">Your Classrooms</h3>
      <div className="classroom-list">
        {classrooms.map((c) => (
          <div className="classroom-card" key={c._id}>
            <button
              className="delete-class-btn"
              onClick={() => {
                setClassToDelete(c);
                setShowConfirmModal(true);
              }}
            >
              ×
            </button>

            <h4>{c.name}</h4>
            <p>Class Code:</p>
            <code>{c._id}</code>
            <a href={`/classroom/${c._id}`} className="go-button">Go to Classroom</a>
          </div>
        ))}
      </div>
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to delete <b>{classToDelete.name}</b>?</p>
            <div className="modal-buttons">
              <button
                onClick={async () => {
                  try {
                    await axios.delete(`https://codeclassroom-backend.onrender.com/classrooms/${classToDelete._id}`);
                    setShowConfirmModal(false);
                    fetchClassrooms();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="confirm-btn"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );

};

export default TeacherDashboard;
