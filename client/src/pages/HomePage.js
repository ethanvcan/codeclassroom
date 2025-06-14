// client/src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <img src="/logo.png" alt="Logo" className="home-logo" />
        <h1 className="home-title">Welcome to CodeClassroom</h1>
        <p className="home-subtitle">Empowering Teachers. Engaging Students. One Line of Code at a Time.</p>
        <div className="home-buttons">
          <button onClick={() => navigate('/login')} className="home-btn">Login</button>
          <button onClick={() => navigate('/signup')} className="home-btn secondary">Sign Up</button>
        </div>
      </header>

      <section className="features">
        <div className="feature-card fade-in">
          <h3>🧑‍🏫 For Teachers</h3>
          <p>Create assignments, track submissions, and manage classrooms with ease.</p>
        </div>
        <div className="feature-card fade-in delay-1">
          <h3>👩‍💻 For Students</h3>
          <p>Write and test code directly in the browser, then submit with one click.</p>
        </div>
        <div className="feature-card fade-in delay-2">
          <h3>🧠 Real-Time Feedback</h3>
          <p>Our integrated Python runner gives instant output validation and feedback.</p>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} CodeClassroom. Built with ❤️ for educators and coders.</p>
      </footer>
    </div>
  );
};

export default HomePage;
