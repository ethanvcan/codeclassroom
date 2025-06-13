import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherClassroomPage from './pages/TeacherClassroomPage';
import TeacherSubmissionsPage from './pages/TeacherSubmissionsPage';
import SolveAssignment from './pages/SolveAssignment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<h1>Welcome to the Coding Platform</h1>} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/classroom/:id" element={<TeacherClassroomPage />} />
        <Route path="/assignment/:id/submissions" element={<TeacherSubmissionsPage />} />
        <Route path="/solve/:id" element={<SolveAssignment />} />


      </Routes>
    </Router>
  );
}

export default App;
