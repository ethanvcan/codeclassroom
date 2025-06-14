import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <img src="/logo.png" alt="Logo" className="home-logo" />
        <h1 className="home-title">CodeClassroom</h1>
        <div className="home-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-text">
          <h2>Empower the next generation of coders</h2>
          <p>CodeClassroom lets teachers assign coding problems and students solve, run, and submit code — all in one platform.</p>
        </div>
        <div className="hero-image-placeholder">[ Add Hero Image Here ]</div>
      </section>

      <section className="features-section">
        <h2>Why CodeClassroom?</h2>
        <div className="features-grid">
          <div className="feature-card fade-in">
            <h3>Live Code Editor</h3>
            <p>Write, run, and debug code directly in the browser with real-time feedback.</p>
          </div>
          <div className="feature-card fade-in delay-1">
            <h3>Instant Feedback</h3>
            <p>Run test cases and get output comparisons instantly to improve learning.</p>
          </div>
          <div className="feature-card fade-in delay-2">
            <h3>Easy Classroom Management</h3>
            <p>Teachers can create classrooms, assignments, and track submissions effortlessly.</p>
          </div>
        </div>
        <div className="features-image-placeholder">[ Add Screenshot / UI Preview Here ]</div>
      </section>

      <section className="footer-section">
        <p>&copy; {new Date().getFullYear()} CodeClassroom. Built for students and teachers.</p>
      </section>
    </div>
  );
};

export default HomePage;
