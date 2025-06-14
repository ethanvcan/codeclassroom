import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://codeclassroom-backend.onrender.com/auth/signup', {
        username,
        password,
        role
      });
      toast.success('Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (err) {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <img src="/logo.png" alt="Site Logo" className="login-logo" />
      <h1 className="login-title">CodeClassroom</h1>

      <div className="login-card">
        <h2 className="login-title-card">Create Account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="login-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="login-input"
          />
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="login-input"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit" className="login-button">Sign Up</button>
        </form>
        <button onClick={() => navigate('/login')} className="signup-link">
          Already have an account? Log in
        </button>
      </div>
    </div>
  );
};

export default Signup;
