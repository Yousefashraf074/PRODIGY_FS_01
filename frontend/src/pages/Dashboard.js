import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, adminService } from '../services/api';
import Toast from '../components/Toast';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const response = await authService.getMe();
      setUser(response.data.user);
      setLoading(false);
    } catch {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const fetchAllUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data.users);
    } catch {
      setToast({ message: 'Failed to fetch users. Admin privileges required.', type: 'error' });
    }
  };

  const handleLogout = () => {
    authService.logout();
    setToast({ message: 'Logged out', type: 'info' });
    setTimeout(() => navigate('/login'), 600);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        fetchAllUsers();
        setToast({ message: 'User deleted', type: 'success' });
      } catch {
        setToast({ message: 'Failed to delete user', type: 'error' });
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchAllUsers();
      setToast({ message: 'Role updated', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update role', type: 'error' });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') fetchAllUsers();
  };

  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;
  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="dashboard-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <nav className="navbar">
        <h1>Authentication System</h1>
        <div className="user-info">
          <a href="/dashboard" className="nav-link active">Dashboard</a>
          <a href="/profile" className="nav-link">Profile</a>
          <div className="avatar-nav" title={`${user.firstName} ${user.lastName}`}>{initials}</div>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-banner">
          <h2>Welcome, {user.firstName}! 👋</h2>
          <p>Here's what's happening with your account.</p>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => handleTabChange('overview')}>Overview</button>
          <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')}>Profile</button>
          {user.role === 'admin' && (
            <button className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleTabChange('users')}>Manage Users</button>
          )}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-body">
                <h3>{user.firstName} {user.lastName}</h3>
                <p>Account name</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛡️</div>
              <div className="stat-body">
                <h3 className="capitalize">{user.role}</h3>
                <p>Access level</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✉️</div>
              <div className="stat-body">
                <h3>{user.email}</h3>
                <p>Email address</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-body">
                <h3>Active</h3>
                <p>Account status</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-header">
              <div className="avatar-large">{initials}</div>
              <div>
                <h2>{user.firstName} {user.lastName}</h2>
                <span className={`role-badge role-${user.role}`}>{user.role}</span>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-field"><strong>First Name</strong><span>{user.firstName}</span></div>
              <div className="profile-field"><strong>Last Name</strong><span>{user.lastName}</span></div>
              <div className="profile-field"><strong>Email</strong><span>{user.email}</span></div>
              <div className="profile-field"><strong>Role</strong><span>{user.role}</span></div>
              <div className="profile-field"><strong>User ID</strong><span className="mono">{user.id}</span></div>
              <div className="profile-actions">
                <a href="/profile" className="btn-action">Edit Profile</a>
              </div>
            </div>
          </div>
        )}

        {/* Users tab (admin) */}
        {activeTab === 'users' && user.role === 'admin' && (
          <div className="users-section">
            <div className="section-header">
              <h2>All Users ({users.length})</h2>
            </div>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-small">{`${u.firstName[0]}${u.lastName[0]}`.toUpperCase()}</div>
                          <span>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="role-select"
                          disabled={u._id === user.id}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={u._id === user.id}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
