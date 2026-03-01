import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Secure User Authentication System</h1>
        <p>A production-ready full-stack authentication solution</p>
      </header>

      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Secure Login & Registration</h3>
            <p>Password hashing with bcrypt for maximum security</p>
          </div>
          <div className="feature-card">
            <h3>JWT Authentication</h3>
            <p>Stateless token-based authentication</p>
          </div>
          <div className="feature-card">
            <h3>Role-Based Access Control</h3>
            <p>Admin, moderator, and user roles with fine-grained permissions</p>
          </div>
          <div className="feature-card">
            <h3>Protected Routes</h3>
            <p>Secure endpoints only accessible to authenticated users</p>
          </div>
          <div className="feature-card">
            <h3>Docker Containerization</h3>
            <p>Easy deployment with Docker and Docker Compose</p>
          </div>
          <div className="feature-card">
            <h3>User Management</h3>
            <p>Admin panel for managing users and roles</p>
          </div>
        </div>
      </section>

      <section className="get-started">
        <h2>Get Started</h2>
        <div className="button-group">
          <a href="/register" className="btn btn-primary">
            Sign Up
          </a>
          <a href="/login" className="btn btn-secondary">
            Log In
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
