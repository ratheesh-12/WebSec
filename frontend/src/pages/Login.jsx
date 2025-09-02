import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth_new.css';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authAPI.login(formData);
      
      if (result.success) {
        const { token, ...userData } = result.data;
        login(userData, token);
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-particles"></div>
      </div>
      <div className="form-container slide-in-up">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1>Welcome Back</h1>
          <p>Access your secure WebSec account</p>
        </div>
        
        {error && (
          <div className="alert alert-error slide-in-down">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Authenticating...
              </>
            ) : (
              <>
                <span className="btn-icon">🔓</span>
                Sign In Securely
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-divider">
            <span>New to WebSec?</span>
          </div>
          <Link to="/register" className="btn btn-secondary btn-full">
            <span className="btn-icon">✨</span>
            Create Secure Account
          </Link>
          <div className="auth-links">
            <Link to="/password-validator" className="auth-link">
              <span className="link-icon">🛡️</span>
              Test Password Strength
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
