import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth_new.css';

const Register = ({ login }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    // Check password confirmation
    if (name === 'confirmPassword' || name === 'password') {
      const newPassword = name === 'password' ? value : formData.password;
      const newConfirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (newConfirmPassword && newPassword !== newConfirmPassword) {
        setPasswordMismatch(true);
      } else {
        setPasswordMismatch(false);
      }
    }
  };

  // Real-time password validation
  useEffect(() => {
    const validatePassword = async () => {
      if (formData.password) {
        try {
          const result = await authAPI.validatePasswordRealtime({
            password: formData.password,
            email: formData.email,
            name: formData.name
          });
          
          if (result.success) {
            setPasswordValidation(result.data);
          }
        } catch (err) {
          console.error('Password validation error:', err);
        }
      } else {
        setPasswordValidation(null);
      }
    };

    const debounceTimer = setTimeout(validatePassword, 300);
    return () => clearTimeout(debounceTimer);
  }, [formData.password, formData.email, formData.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordValidation && !passwordValidation.isValid) {
      setError('Please fix all password requirements before registering');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        const { token, user } = result.data;
        login(user, token);
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
      <div className="form-container slide-in-up" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-icon">🛡️</div>
          <h1>Create Account</h1>
          <p>Join WebSec with enterprise-grade security</p>
        </div>

        {error && (
          <div className="alert alert-error slide-in-down">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

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
              className={`form-input ${
                passwordValidation 
                  ? passwordValidation.isValid 
                    ? 'success' 
                    : 'error'
                  : ''
              }`}
              placeholder="Create a strong password"
              required
            />
            
            {passwordValidation && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${(passwordValidation.strength.score / 8) * 100}%`,
                      backgroundColor: passwordValidation.strength.color
                    }}
                  />
                </div>
                <div 
                  className="strength-text"
                  style={{ color: passwordValidation.strength.color }}
                >
                  {passwordValidation.strength.level}
                </div>
                
                {passwordValidation.message && (
                  <div className={`alert mt-2 ${passwordValidation.isValid ? 'alert-success' : 'alert-warning'}`}>
                    {passwordValidation.message}
                  </div>
                )}

                {passwordValidation.requirements && (
                  <div className="requirements-list">
                    <h4>Password Requirements:</h4>
                    <div className={`requirement-item ${passwordValidation.requirements.length ? 'met' : 'unmet'}`}>
                      At least 8 characters
                    </div>
                    <div className={`requirement-item ${passwordValidation.requirements.uppercase ? 'met' : 'unmet'}`}>
                      Uppercase letter (A-Z)
                    </div>
                    <div className={`requirement-item ${passwordValidation.requirements.lowercase ? 'met' : 'unmet'}`}>
                      Lowercase letter (a-z)
                    </div>
                    <div className={`requirement-item ${passwordValidation.requirements.numbers ? 'met' : 'unmet'}`}>
                      At least one number
                    </div>
                    <div className={`requirement-item ${passwordValidation.requirements.special ? 'met' : 'unmet'}`}>
                      Special character (@ # $ % & *)
                    </div>
                    <div className={`requirement-item ${passwordValidation.requirements.noPersonalInfo ? 'met' : 'unmet'}`}>
                      No personal information
                    </div>
                    <div className={`requirement-item ${passwordValidation.requirements.noCommonPatterns ? 'met' : 'unmet'}`}>
                      No common patterns
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${
                passwordMismatch 
                  ? 'error' 
                  : formData.confirmPassword && !passwordMismatch 
                    ? 'success' 
                    : ''
              }`}
              placeholder="Confirm your password"
              required
            />
            {passwordMismatch && (
              <div className="alert alert-error mt-1">
                Passwords do not match
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
            disabled={loading || (passwordValidation && !passwordValidation.isValid) || passwordMismatch}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="nav-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
