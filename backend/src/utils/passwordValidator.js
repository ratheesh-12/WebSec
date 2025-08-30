const bcrypt = require('bcryptjs');

class PasswordValidator {
  static validatePassword(password, email = '', name = '') {
    const errors = [];

    // Check length (minimum 8 characters as requested)
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must include at least 1 uppercase letter (A-Z)');
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must include at least 1 lowercase letter (a-z)');
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      errors.push('Password must include at least 1 number (0-9)');
    }

    // Check for special character
    if (!/[@#$%&*!?^()_+=\-{}[\]:";'<>,.\/\\|`~]/.test(password)) {
      errors.push('Password must include at least 1 special character (e.g., @ # $ % & *)');
    }

    // Check if password contains email or username
    const lowerPassword = password.toLowerCase();
    if (email) {
      const emailUsername = email.toLowerCase().split('@')[0];
      if (emailUsername.length >= 3 && lowerPassword.includes(emailUsername)) {
        errors.push('Password cannot contain your username or email');
      }
    }
    
    // Check if password contains name
    if (name && name.length >= 3) {
      const nameParts = name.toLowerCase().split(' ');
      for (const part of nameParts) {
        if (part.length >= 3 && lowerPassword.includes(part)) {
          errors.push('Password cannot contain your name or personal details');
        }
      }
    }

    // Enhanced common weak passwords list
    const weakPasswords = [
      '123456', 'password', 'qwerty', '123456789', '12345678', '12345',
      'abc123', 'password123', '123123', 'admin', 'letmein', 'welcome',
      'monkey', '1234567890', 'password1', 'qwerty123', 'dragon',
      'master', 'login', 'passw0rd', 'welcome123', 'admin123',
      'root', 'user', 'guest', 'test', 'demo', 'sample', 'example',
      'default', 'changeme', 'newpassword', 'iloveyou', 'princess',
      'football', 'baseball', 'sunshine', 'trustno1', 'superman',
      'batman', 'shadow', 'michael', 'jennifer', 'jordan', 'hunter',
      'computer', 'michelle', 'charlie', 'andrew', 'ashley', 'daniel',
      'jessica', 'amanda', 'joshua', 'anthony', 'william', 'matthew',
      'myname123', '111111', '000000', 'aaaaaa', 'qwertyui'
    ];
    
    // Check for exact match or containing weak patterns
    if (weakPasswords.some(weak => 
      lowerPassword === weak || 
      lowerPassword.includes(weak) ||
      password === weak
    )) {
      errors.push('Password cannot be a common or weak password (e.g., 123456, password, qwerty)');
    }

    // Check for sequential characters
    if (/123456|abcdef|qwerty|asdfgh|zxcvbn/i.test(password)) {
      errors.push('Password cannot contain sequential characters or keyboard patterns');
    }

    // Check for repeated characters (more than 3 in a row)
    if (/(.)\1{3,}/.test(password)) {
      errors.push('Password cannot contain more than 3 repeated characters in a row');
    }

    return {
      isValid: errors.length === 0,
      errors,
      mustFixAll: true // All conditions must pass for account creation
    };
  }

  static async checkPasswordHistory(newPassword, passwordHistory) {
    for (const oldPassword of passwordHistory.slice(-5)) {
      const isMatch = await bcrypt.compare(newPassword, oldPassword.password);
      if (isMatch) {
        return false;
      }
    }
    return true;
  }

  static getPasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[@#$%&*!?^()_+=\-{}[\]:";'<>,.\/\\|`~]/.test(password),
      longLength: password.length >= 12, // Bonus for longer passwords
      variety: new Set(password).size >= 6, // Character variety
      noCommon: !this.containsCommonPatterns(password)
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    if (score <= 3) return { level: 'Very Weak', color: '#dc2626', score };
    if (score <= 5) return { level: 'Weak', color: '#ef4444', score };
    if (score <= 6) return { level: 'Medium', color: '#f59e0b', score };
    if (score <= 7) return { level: 'Strong', color: '#10b981', score };
    return { level: 'Very Strong', color: '#059669', score };
  }

  static containsCommonPatterns(password) {
    const lowerPassword = password.toLowerCase();
    const commonPatterns = [
      '123456', 'password', 'qwerty', 'abc123', 'letmein',
      'admin', 'welcome', 'monkey', 'dragon', 'master'
    ];
    
    return commonPatterns.some(pattern => 
      lowerPassword.includes(pattern) || 
      /123456|abcdef|qwerty|asdfgh/i.test(password)
    );
  }
}

module.exports = PasswordValidator;
