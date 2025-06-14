import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeacherSubmissionsPage.css';

const TeacherSubmissionsPage = () => {
  const { id } = useParams(); // assignmentId
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`https://codeclassroom-backend.onrender.com/submissions/by-assignment/${id}`);
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, [id]);


  const handleBack = () => {
    navigate(-1); // Go back to previous page (ideally the classroom page)
  };

  return (
    <div className="submissions-container">
      <div className="dashboard-header">
        <img src="/logo.png" alt="Logo" className="dashboard-logo" style={{ cursor: 'default' }}/>
        <h1 className="dashboard-title" style={{ cursor: 'default' }}>CodeClassroom</h1>
      </div>
      <div className="back-button-container">
          <button className="back-button" onClick={handleBack}>← Back to Classroom</button>
        </div>
      <div className="submissions-content">
        

        <h2 className="submissions-title">Submissions</h2>
        {submissions.length === 0 ? (
          <p className="empty-text">No submissions yet.</p>
        ) : (
          submissions.map((s, idx) => (
            <div key={idx} className="submission-card">
              <strong>{s.student?.username || 'Unknown Student'}</strong>
              <pre className="submission-code">{s.code}</pre>
              <p><b>Output:</b> {s.output || '(no output)'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherSubmissionsPage;
