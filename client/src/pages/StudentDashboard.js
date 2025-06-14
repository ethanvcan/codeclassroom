import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StudentDashboard = () => {
  const username = localStorage.getItem('username');
  const studentId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    if (localStorage.getItem('role') !== 'student') {
      window.location.href = '/login';
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://codeclassroom-backend.onrender.com/classrooms/by-student/${studentId}`);
        setClassrooms(res.data);

        let allAssignments = [];
        for (const classroom of res.data) {
          const a = await axios.get(`https://codeclassroom-backend.onrender.com/assignments/classroom/${classroom._id}`);
          const tagged = a.data.map((assign) => ({
            ...assign,
            classroomId: classroom._id
          }));
          allAssignments = [...allAssignments, ...tagged];
        }
        setAssignments(allAssignments);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [studentId]);

  const handleOpenAssignment = (assignment, classroomId) => {
    localStorage.setItem('currentAssignmentId', assignment._id);
    localStorage.setItem('currentAssignmentTitle', assignment.title);
    localStorage.setItem('currentAssignmentDescription', assignment.description);
    localStorage.setItem('currentAssignmentInput', assignment.sampleInput);
    localStorage.setItem('currentAssignmentOutput', assignment.sampleOutput);
    localStorage.setItem('currentAssignmentClassroomId', classroomId);
    navigate(`/solve/${assignment._id}`);
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://codeclassroom-backend.onrender.com/classrooms/join', {
        classroomId: joinCode,
        studentId
      });
      toast.success('❌ Joined class! Redirecting...');
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('❌ Invalid class code. Please try again.');
    }
  };
  
  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <div className="student-dashboard">
      <ToastContainer />
      <header className="dashboard-header">
        <img src="/logo.png" alt="Logo" className="dashboard-logo"  style={{ cursor: 'default' }}/>
        <h1 className="dashboard-title" style={{ cursor: 'default' }}>CodeClassroom</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        {classrooms.length === 0 ? (
          <div className="join-card">
            <h2>Welcome, {username}</h2>
            <form onSubmit={handleJoinClass}>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter class code"
                className="join-input"
              />
              <button type="submit" className="join-button">Join Class</button>
            </form>
          </div>
        ) : (
          <main className="dashboard-main">
            <h2>Welcome, {username}</h2>
            <h3>Assignments</h3>
            <div className="assignment-grid">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="assignment-card"
                  onClick={() => handleOpenAssignment(assignment, assignment.classroomId)}
                >
                  <h4>{assignment.title}</h4>
                  <p>{assignment.description}</p>
                </div>
              ))}
            </div>
          </main>

        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
