import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Toast from './Toast';
import '../styles/Auth.css';

const getPasswordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: '#ef4444', pct: 20 };
  if (score <= 2) return { label: 'Fair', color: '#f59e0b', pct: 40 };
  if (score <= 3) return { label: 'Good', color: '#3b82f6', pct: 65 };
  if (score <= 4) return { label: 'Strong', color: '#22c55e', pct: 85 };
  return { label: 'Very strong', color: '#16a34a', pct: 100 };
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToast({ message: 'Account created successfully!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map((e) => e.msg).join('\n'));
      } else {
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join us today — it only takes a minute</p>
        {error && (
          <div className="error-message">
            {error.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-toggle">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.password && (
              <div className="strength-bar-wrapper">
                <div className="strength-bar" style={{ width: `${strength.pct}%`, background: strength.color }} />
              </div>
            )}
            <small className="field-hint">
              {formData.password
                ? <span style={{ color: strength.color }}>{strength.label}</span>
                : 'Min 6 chars · uppercase · number · symbol for best strength'}
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-toggle">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="toggle-pw" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <small className="field-hint" style={{ color: '#ef4444' }}>Passwords do not match</small>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
