import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Toast from '../components/Toast';
import '../styles/Dashboard.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const res = await authService.getMe();
      setUser(res.data.user);
      setProfileForm({ firstName: res.data.user.firstName, lastName: res.data.user.lastName });
      setLoading(false);
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile(profileForm);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setEditing(false);
      setToast({ message: 'Profile updated!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Update failed', type: 'error' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNew) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    try {
      await authService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmNew: '' });
      setChangingPw(false);
      setToast({ message: 'Password changed successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Password change failed', type: 'error' });
    }
  };

  const handleLogout = () => { authService.logout(); navigate('/login'); };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="dashboard-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <nav className="navbar">
        <h1>Authentication System</h1>
        <div className="user-info">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/profile" className="nav-link active">Profile</a>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="profile-section">
          <div className="profile-header">
            <div className="avatar-large">{initials}</div>
            <div>
              <h2>{user.firstName} {user.lastName}</h2>
              <span className={`role-badge role-${user.role}`}>{user.role}</span>
            </div>
          </div>

          {/* Profile info / edit */}
          {!editing ? (
            <div className="profile-card">
              <div className="profile-field"><strong>First Name</strong><span>{user.firstName}</span></div>
              <div className="profile-field"><strong>Last Name</strong><span>{user.lastName}</span></div>
              <div className="profile-field"><strong>Email</strong><span>{user.email}</span></div>
              <div className="profile-field"><strong>Role</strong><span>{user.role}</span></div>
              <div className="profile-field"><strong>Member since</strong><span>{new Date().toLocaleDateString()}</span></div>
              <div className="profile-actions">
                <button className="btn-action" onClick={() => setEditing(true)}>Edit Profile</button>
                <button className="btn-action btn-action-secondary" onClick={() => setChangingPw(!changingPw)}>
                  {changingPw ? 'Cancel' : 'Change Password'}
                </button>
              </div>
            </div>
          ) : (
            <form className="profile-card" onSubmit={handleProfileSave}>
              <div className="form-group">
                <label>First Name</label>
                <input value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} required />
              </div>
              <div className="profile-actions">
                <button type="submit" className="btn-action">Save</button>
                <button type="button" className="btn-action btn-action-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* Change password */}
          {changingPw && !editing && (
            <form className="profile-card" style={{ marginTop: 20 }} onSubmit={handlePasswordChange}>
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                <small className="field-hint">Must be at least 6 characters</small>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={pwForm.confirmNew} onChange={(e) => setPwForm({ ...pwForm, confirmNew: e.target.value })} required />
              </div>
              <div className="profile-actions">
                <button type="submit" className="btn-action">Update Password</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
