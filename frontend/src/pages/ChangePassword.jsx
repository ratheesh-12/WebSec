import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');

    // Check password confirmation
    if (name === 'confirmPassword' || name === 'newPassword') {
      const newPassword = name === 'newPassword' ? value : formData.newPassword;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPassword && newPassword !== confirmPassword) {
        setPasswordMismatch(true);
      } else {
        setPasswordMismatch(false);
      }
    }
  };

  // Real-time password validation for new password
  useEffect(() => {
    const validatePassword = async () => {
      if (formData.newPassword) {
        try {
          const result = await authAPI.validatePasswordRealtime({
            password: formData.newPassword
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
  }, [formData.newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordValidation && !passwordValidation.isValid) {
      setError('Please fix all password requirements before changing password');
      setLoading(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (result.success) {
        setSuccess('Password changed successfully! Please login again with your new password.');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordValidation(null);
        
        // Auto logout after 3 seconds
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 3000);
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
      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="card-header">
          <h1>Change Password</h1>
          <p>Update your password to keep your account secure</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your current password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`form-input ${
                passwordValidation 
                  ? passwordValidation.isValid 
                    ? 'success' 
                    : 'error'
                  : ''
              }`}
              placeholder="Enter your new password"
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
            <label htmlFor="confirmPassword">Confirm New Password</label>
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
              placeholder="Confirm your new password"
              required
            />
            {passwordMismatch && (
              <div className="alert alert-error mt-1">
                Passwords do not match
              </div>
            )}
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className={`btn btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
              disabled={loading || (passwordValidation && !passwordValidation.isValid) || passwordMismatch}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>

          <div className="form-group">
            <a href="/dashboard" className="btn btn-secondary btn-full">
              Cancel
            </a>
          </div>
        </form>

        <div className="security-notice">
          <h3>🔒 Security Notice</h3>
          <ul>
            <li>You will be logged out after changing your password</li>
            <li>Your new password cannot be the same as your current password</li>
            <li>The system remembers your last 5 passwords to prevent reuse</li>
            <li>Make sure your new password meets all security requirements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
