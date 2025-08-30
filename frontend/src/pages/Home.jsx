import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">WebSec</span>
          </h1>
          <p className="hero-subtitle">
            Your secure authentication platform with advanced password protection
          </p>
          <p className="hero-description">
            Experience enterprise-grade security with real-time password validation, 
            account locking mechanisms, and comprehensive authentication features.
          </p>
          
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/password-validator" className="btn btn-secondary btn-large">
              Try Password Validator
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Security Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Advanced Password Validation</h3>
              <p>
                Real-time password strength checking with comprehensive security rules 
                including character requirements, pattern detection, and common password filtering.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Account Protection</h3>
              <p>
                Automatic account locking after failed login attempts with time-based 
                unlock mechanisms to prevent brute force attacks.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Password History</h3>
              <p>
                Track and prevent password reuse with a secure password history system 
                that maintains your last 5 passwords.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Validation</h3>
              <p>
                Instant password strength feedback as you type, helping you create 
                strong passwords that meet all security requirements.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>
                JWT-based authentication with secure token management and automatic 
                session handling for optimal security.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>User Management</h3>
              <p>
                Complete user profile management with secure password changes and 
                comprehensive account information tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="security-requirements">
        <div className="container">
          <h2 className="section-title">Password Requirements</h2>
          <div className="requirements-card">
            <div className="requirements-grid">
              <div className="requirement">
                <span className="req-icon">📏</span>
                <span>Minimum 8 characters</span>
              </div>
              <div className="requirement">
                <span className="req-icon">🔤</span>
                <span>Uppercase & lowercase letters</span>
              </div>
              <div className="requirement">
                <span className="req-icon">🔢</span>
                <span>At least one number</span>
              </div>
              <div className="requirement">
                <span className="req-icon">🎯</span>
                <span>Special characters</span>
              </div>
              <div className="requirement">
                <span className="req-icon">🚫</span>
                <span>No personal information</span>
              </div>
              <div className="requirement">
                <span className="req-icon">⚠️</span>
                <span>No common patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Secure Your Account?</h2>
            <p>Join thousands of users who trust WebSec for their authentication needs.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Create Account
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
