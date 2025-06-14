import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://codeclassroom-backend.onrender.com/auth/login', {
        username,
        password
      });

      localStorage.setItem('username', username);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('userId', res.data.userId);

      toast.success('Login successful! Redirecting...');

      if (res.data.role === 'teacher') {
        setTimeout(() => navigate('/teacher-dashboard'), 2000);
      } else {
        setTimeout(() => navigate('/student-dashboard'), 2000);
      }
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <img src="/logo.png" alt="Site Logo" className="login-logo" />
      <h1 className="login-title">CodeClassroom</h1>
      <div className="login-card">
        <h2 className="login-title-card">Welcome Back</h2>
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
          <button type="submit" className="login-button">Login</button>
        </form>
        <button onClick={() => navigate('/signup')} className="signup-link">
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
