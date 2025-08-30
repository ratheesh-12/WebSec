import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';

const PasswordValidator = () => {
  const [formData, setFormData] = useState({
    password: '',
    email: '',
    name: ''
  });
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Real-time password validation
  useEffect(() => {
    const validatePassword = async () => {
      if (formData.password) {
        setLoading(true);
        try {
          const result = await authAPI.validatePasswordRealtime(formData);
          
          if (result.success) {
            setValidation(result.data);
          }
        } catch (err) {
          console.error('Password validation error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setValidation(null);
      }
    };

    const debounceTimer = setTimeout(validatePassword, 300);
    return () => clearTimeout(debounceTimer);
  }, [formData.password, formData.email, formData.name]);

  const clearForm = () => {
    setFormData({
      password: '',
      email: '',
      name: ''
    });
    setValidation(null);
  };

  return (
    <div className="validator-container">
      <div className="validator-header">
        <h1>🔍 Password Strength Validator</h1>
        <p>Test your password strength in real-time with our advanced security validator</p>
      </div>

      <div className="validator-grid">
        <div className="validator-card">
          <h2>Test Your Password</h2>
          
          <div className="form-group">
            <label htmlFor="password">Password to Test</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${
                validation 
                  ? validation.isValid 
                    ? 'success' 
                    : 'error'
                  : ''
              }`}
              placeholder="Enter a password to test its strength"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (Optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Email to check against password"
            />
            <small>Used to ensure password doesn't contain email parts</small>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name (Optional)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Name to check against password"
            />
            <small>Used to ensure password doesn't contain personal information</small>
          </div>

          <button 
            onClick={clearForm}
            className="btn btn-secondary btn-full"
          >
            Clear All
          </button>
        </div>

        {validation && (
          <div className="validation-results">
            <div className="strength-display">
              <h2>Password Strength</h2>
              <div className="strength-circle">
                <div 
                  className="strength-fill"
                  style={{
                    background: `conic-gradient(${validation.strength.color} ${(validation.strength.score / 8) * 360}deg, #e1e5e9 0deg)`
                  }}
                >
                  <div className="strength-inner">
                    <div className="strength-score">{validation.strength.score}/8</div>
                    <div 
                      className="strength-level"
                      style={{ color: validation.strength.color }}
                    >
                      {validation.strength.level}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="validation-message">
              <div className={`alert ${validation.isValid ? 'alert-success' : 'alert-error'}`}>
                {validation.message}
              </div>
            </div>

            {validation.requirements && (
              <div className="requirements-checker">
                <h3>Security Requirements</h3>
                <div className="requirements-grid">
                  <div className={`requirement-check ${validation.requirements.length ? 'met' : 'unmet'}`}>
                    <div className="check-icon">
                      {validation.requirements.length ? '✅' : '❌'}
                    </div>
                    <div className="check-content">
                      <h4>Length (8+ characters)</h4>
                      <p>Password has {formData.password.length} characters</p>
                    </div>
                  </div>

                  <div className={`requirement-check ${validation.requirements.uppercase ? 'met' : 'unmet'}`}>
                    <div className="check-icon">
                      {validation.requirements.uppercase ? '✅' : '❌'}
                    </div>
                    <div className="check-content">
                      <h4>Uppercase Letters</h4>
                      <p>Contains A-Z characters</p>
                    </div>
                  </div>

                  <div className={`requirement-check ${validation.requirements.lowercase ? 'met' : 'unmet'}`}>
                    <div className="check-icon">
                      {validation.requirements.lowercase ? '✅' : '❌'}
                    </div>
                    <div className="check-content">
                      <h4>Lowercase Letters</h4>
                      <p>Contains a-z characters</p>
                    </div>
                  </div>

                  <div className={`requirement-check ${validation.requirements.numbers ? 'met' : 'unmet'}`}>
                    <div className="check-icon">
                      {validation.requirements.numbers ? '✅' : '❌'}
                    </div>
                    <div className="check-content">
                      <h4>Numbers</h4>
                      <p>Contains 0-9 digits</p>
                    </div>
                  </div>

                  <div className={`requirement-check ${validation.requirements.special ? 'met' : 'unmet'}`}>
                    <div className="check-icon">
                      {validation.requirements.special ? '✅' : '❌'}
                    </div>
                    <div className="check-content">
                      <h4>Special Characters</h4>
                      <p>Contains symbols like @ # $ % & *</p>
                    </div>
                  </div>

                  <div className={`requirement-check ${validation.requirements.noPersonalInfo ? 'met' : 'unmet'}`}>
                    <div className="check-icon">
                      {validation.requirements.noPersonalInfo ? '✅' : '❌'}
                    </div>
                    <div className="check-content">
                      <h4>No Personal Info</h4>
                      <p>Doesn't contain name or email parts</p>
                    </div>
                  </div>

                  <div className={`requirement-check ${validation.requirements.noCommonPatterns ? 'met' : 'unmet'}`}>
                    <div className="check-icon">
                      {validation.requirements.noCommonPatterns ? '✅' : '❌'}
                    </div>
                    <div className="check-content">
                      <h4>No Common Patterns</h4>
                      <p>Avoids 123456, qwerty, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {validation.errors && validation.errors.length > 0 && (
              <div className="error-details">
                <h3>Issues to Fix</h3>
                <ul className="error-list">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!validation && (
          <div className="validator-guide">
            <h2>Password Guidelines</h2>
            <div className="guidelines-grid">
              <div className="guideline-item">
                <div className="guideline-icon">📏</div>
                <h3>Length Matters</h3>
                <p>Use at least 8 characters. Longer passwords are stronger.</p>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">🔤</div>
                <h3>Mix Cases</h3>
                <p>Include both uppercase (A-Z) and lowercase (a-z) letters.</p>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">🔢</div>
                <h3>Add Numbers</h3>
                <p>Include at least one number (0-9) in your password.</p>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">🎯</div>
                <h3>Special Characters</h3>
                <p>Use symbols like @ # $ % & * to increase strength.</p>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">🚫</div>
                <h3>Avoid Personal Info</h3>
                <p>Don't use your name, email, or other personal details.</p>
              </div>
              
              <div className="guideline-item">
                <div className="guideline-icon">⚠️</div>
                <h3>Skip Common Patterns</h3>
                <p>Avoid sequences like 123456, qwerty, or password.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordValidator;
