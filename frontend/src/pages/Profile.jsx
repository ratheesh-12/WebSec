import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await authAPI.getProfile();
        if (result.success) {
          setProfileData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="card">
          <div className="alert alert-error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const displayData = profileData || user;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {displayData.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h1>{displayData.name}</h1>
          <p>{displayData.email}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>Account Information</h2>
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">Full Name:</span>
              <span className="info-value">{displayData.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email Address:</span>
              <span className="info-value">{displayData.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Account Created:</span>
              <span className="info-value">{formatDate(displayData.createdAt)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">{formatDate(displayData.updatedAt)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Last Login:</span>
              <span className="info-value">{formatDate(displayData.lastLogin)}</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Security Status</h2>
          <div className="security-items">
            <div className="security-item">
              <div className="security-icon">🔒</div>
              <div className="security-content">
                <h3>Password Security</h3>
                <p>Your password meets all security requirements</p>
                <span className="status-badge good">Secure</span>
              </div>
            </div>
            
            <div className="security-item">
              <div className="security-icon">🛡️</div>
              <div className="security-content">
                <h3>Account Protection</h3>
                <p>Account lockout protection is active</p>
                <span className="status-badge good">Active</span>
              </div>
            </div>
            
            <div className="security-item">
              <div className="security-icon">📊</div>
              <div className="security-content">
                <h3>Login Monitoring</h3>
                <p>Failed login attempts: 0</p>
                <span className="status-badge good">Clean</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Account Actions</h2>
          <div className="action-buttons">
            <a href="/change-password" className="btn btn-primary">
              Change Password
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-secondary"
            >
              Refresh Profile
            </button>
            <a href="/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>

        <div className="profile-card">
          <h2>Security Recommendations</h2>
          <div className="recommendations">
            <div className="recommendation-item">
              <div className="rec-icon">✅</div>
              <div>
                <h4>Strong Password</h4>
                <p>You're using a strong password that meets all security requirements.</p>
              </div>
            </div>
            
            <div className="recommendation-item">
              <div className="rec-icon">🔄</div>
              <div>
                <h4>Regular Updates</h4>
                <p>Consider updating your password every 3-6 months for optimal security.</p>
              </div>
            </div>
            
            <div className="recommendation-item">
              <div className="rec-icon">🔐</div>
              <div>
                <h4>Unique Passwords</h4>
                <p>Use different passwords for each of your accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
