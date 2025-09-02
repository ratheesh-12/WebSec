import { Link } from 'react-router-dom';
import './Home_new.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">WebSec</span>
          </h1>
          <p className="hero-subtitle">
            🔐 Enterprise-Grade Authentication Platform
          </p>
          <p className="hero-description">
            Experience next-generation security with real-time password validation, 
            intelligent threat detection, and military-grade encryption. Protect your digital assets 
            with our advanced cybersecurity framework.
          </p>
          
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              <span className="btn-icon">🚀</span>
              Get Started
            </Link>
            <Link to="/password-validator" className="btn btn-secondary btn-large">
              <span className="btn-icon">🛡️</span>
              Test Security
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">🔒 Security Arsenal</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">�</div>
              <h3>Advanced Password Validation</h3>
              <p>
                Real-time password strength analysis with AI-powered threat detection. 
                Our system checks against 10+ billion compromised passwords and analyzes 
                patterns to ensure maximum security.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Smart Account Protection</h3>
              <p>
                Intelligent account locking with adaptive security measures. 
                Machine learning algorithms detect suspicious activities and automatically 
                trigger protective protocols.
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
