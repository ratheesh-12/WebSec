import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Manage your secure account and explore security features</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card user-info">
          <div className="card-icon">👤</div>
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Account Created:</label>
              <span>{formatDate(user.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>Last Login:</label>
              <span>{formatDate(user.lastLogin)}</span>
            </div>
          </div>
          <Link to="/profile" className="btn btn-secondary">
            View Full Profile
          </Link>
        </div>

        <div className="dashboard-card security-tools">
          <div className="card-icon">🔐</div>
          <h2>Security Tools</h2>
          <p>Manage your account security and password settings</p>
          <div className="tools-grid">
            <Link to="/change-password" className="tool-item">
              <div className="tool-icon">🔑</div>
              <div>
                <h3>Change Password</h3>
                <p>Update your account password securely</p>
              </div>
            </Link>
            <Link to="/password-validator" className="tool-item">
              <div className="tool-icon">✅</div>
              <div>
                <h3>Password Validator</h3>
                <p>Test password strength in real-time</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-card security-status">
          <div className="card-icon">🛡️</div>
          <h2>Security Status</h2>
          <div className="status-grid">
            <div className="status-item good">
              <div className="status-icon">✅</div>
              <div>
                <h3>Account Secure</h3>
                <p>Your account is protected with strong security measures</p>
              </div>
            </div>
            <div className="status-item good">
              <div className="status-icon">🔒</div>
              <div>
                <h3>Password Protected</h3>
                <p>Strong password with advanced validation</p>
              </div>
            </div>
            <div className="status-item info">
              <div className="status-icon">📊</div>
              <div>
                <h3>Login Monitoring</h3>
                <p>Account lockout protection active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <div className="card-icon">⚡</div>
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button 
              onClick={() => window.location.reload()} 
              className="action-item"
            >
              <div className="action-icon">🔄</div>
              <span>Refresh Session</span>
            </button>
            <Link to="/profile" className="action-item">
              <div className="action-icon">👤</div>
              <span>Edit Profile</span>
            </Link>
            <Link to="/password-validator" className="action-item">
              <div className="action-icon">🔍</div>
              <span>Test Password</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-card tips">
          <div className="card-icon">💡</div>
          <h2>Security Tips</h2>
          <ul className="tips-list">
            <li>
              <strong>Use unique passwords</strong> for each of your accounts
            </li>
            <li>
              <strong>Enable two-factor authentication</strong> when available
            </li>
            <li>
              <strong>Update passwords regularly</strong> especially for important accounts
            </li>
            <li>
              <strong>Avoid public Wi-Fi</strong> for sensitive account access
            </li>
            <li>
              <strong>Keep software updated</strong> to prevent security vulnerabilities
            </li>
          </ul>
        </div>

        <div className="dashboard-card stats">
          <div className="card-icon">📈</div>
          <h2>Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Account Security</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Failed Login Attempts</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">Active</div>
              <div className="stat-label">Account Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
