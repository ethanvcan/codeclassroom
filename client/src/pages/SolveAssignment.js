import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './SolveAssignment.css';

const SolveAssignment = () => {
  const navigate = useNavigate();
  const title = localStorage.getItem('currentAssignmentTitle');
  const description = localStorage.getItem('currentAssignmentDescription');
  const sampleInput = localStorage.getItem('currentAssignmentInput');
  const sampleOutput = localStorage.getItem('currentAssignmentOutput');

  const { id } = useParams(); // assignment ID
  const storageKey = `assignment_${id}_student_code`;

  const [code, setCode] = useState(localStorage.getItem(storageKey) || '');
  const [output, setOutput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      const res = await axios.get(`http://localhost:8000/assignments/info/${id}`);
      setAssignment(res.data);
    };
    fetchAssignment();
  }, [id]);

  useEffect(() => {
    localStorage.setItem(storageKey, code);
  }, [code, storageKey]);

  const handleRun = async () => {
    try {
      const res = await axios.post('http://localhost:8000/run', {
        code,
        input: sampleInput,
        expectedOutput: sampleOutput
      });
      setOutput(res.data.output + (res.data.correct ? "\n✅ Correct!" : "\n❌ Incorrect."));
      setIsCorrect(res.data.correct);
    } catch (err) {
      setOutput('Error running code');
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const studentId = localStorage.getItem('userId');
      const classroomId = assignment.classroomId;
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:8000/submissions', {
        assignment: id,
        classroom: classroomId,
        student: studentId,
        code,
        output
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Submission successful!');
    } catch (err) {
      console.error('Failed to submit:', err);
      alert('Failed to submit code');
    }
  };

  return (
    <div className="solve-container">
      <div className="dashboard-header">
        <img src="/logo.png" alt="Logo" className="dashboard-logo" style={{ cursor: 'default' }} />
        <h1 className="dashboard-title" style={{ cursor: 'default' }}>CodeClassroom</h1>
      </div>
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/student-dashboard')}>
          ← Back to Classroom
        </button>
      </div>

      <div className="solve-content">
        <h2>{title}</h2>
        <p>{description}</p>

        <div className="sample-section">
          <div>
            <h4>Sample Input:</h4>
            <pre>{sampleInput}</pre>
          </div>
          <div>
            <h4>Expected Output:</h4>
            <pre>{sampleOutput}</pre>
          </div>
        </div>

        <Editor
  height="400px"
  defaultLanguage="python"
  theme="vs-dark"
  value={code}
  onChange={(value) => setCode(value || '')}
  options={{
    fontSize: 14,
    minimap: { enabled: false },
    tabSize: 4,
    automaticLayout: true,
  }}
/>



        <div className="button-group">
          <button onClick={handleRun} className="blue-button">Run Code</button>
          {isCorrect && <button onClick={handleSubmit} className="submit-button">Submit</button>}
        </div>

        <h4>Output:</h4>
        <pre className="output-box">{output}</pre>
      </div>
    </div>
  );
};

export default SolveAssignment;
