const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/token");
const PasswordValidator = require("../utils/passwordValidator");

// Constants for account locking
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

// @desc Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Strict password validation - ALL conditions must pass
    const passwordValidation = PasswordValidator.validatePassword(password, email, name);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: "Account cannot be created. Password does not meet ALL security requirements",
        errors: passwordValidation.errors,
        strict: true, // Indicates all conditions must be met
        requirements: [
          "Must be at least 8 characters long",
          "Must include at least 1 uppercase letter (A-Z)",
          "Must include at least 1 lowercase letter (a-z)", 
          "Must include at least 1 number (0-9)",
          "Must include at least 1 special character (@ # $ % & *)",
          "Cannot contain your username, email, or personal details",
          "Cannot be a common or weak password",
          "Cannot contain sequential characters or patterns"
        ]
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        message: "Account already exists with this email address",
        type: "email_exists"
      });
    }

    // Create secure password hash
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with security tracking
    user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      passwordHistory: [{ 
        password: hashedPassword,
        createdAt: new Date()
      }],
      failedLoginAttempts: 0,
      accountLocked: false
    });

    // Generate token and respond
    res.status(201).json({
      success: true,
      message: "Account created successfully with strong password security",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token: generateToken(user._id),
      security: {
        passwordStrength: PasswordValidator.getPasswordStrength(password),
        accountLockingEnabled: true,
        maxLoginAttempts: MAX_LOGIN_ATTEMPTS
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: "Account creation failed due to server error",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// @desc Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: "Account is temporarily locked due to too many failed login attempts. Please try again later.",
        lockedUntil: user.lockUntil
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Increment failed attempts
      user.failedLoginAttempts += 1;
      
      // Lock account if max attempts reached
      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.accountLocked = true;
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();
        return res.status(423).json({ 
          message: "Account locked due to too many failed login attempts. Please try again in 2 hours.",
          lockedUntil: user.lockUntil
        });
      }
      
      await user.save();
      return res.status(400).json({ 
        message: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts} attempts remaining.`
      });
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.accountLocked = false;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      lastLogin: user.lastLogin
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    // Validate new password
    const passwordValidation = PasswordValidator.validatePassword(newPassword, user.email, user.name);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: "New password does not meet security requirements",
        errors: passwordValidation.errors
      });
    }

    // Check password history
    const isInHistory = await PasswordValidator.checkPasswordHistory(newPassword, user.passwordHistory);
    if (!isInHistory) {
      return res.status(400).json({ 
        message: "You cannot reuse your last 5 passwords" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and history
    user.password = hashedPassword;
    user.passwordHistory.push({ password: hashedPassword });
    
    // Keep only last 5 passwords
    if (user.passwordHistory.length > 5) {
      user.passwordHistory = user.passwordHistory.slice(-5);
    }

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Validate Password Strength
exports.validatePassword = async (req, res) => {
  try {
    const { password, email, name } = req.body;
    
    const validation = PasswordValidator.validatePassword(password, email, name);
    const strength = PasswordValidator.getPasswordStrength(password);
    
    res.json({
      isValid: validation.isValid,
      errors: validation.errors,
      strength: strength
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Validate password in real-time
exports.validatePasswordRealtime = async (req, res) => {
  try {
    const { password, email = '', name = '' } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        message: "Password is required for validation",
        isValid: false,
        errors: ["Password cannot be empty"]
      });
    }
    
    const validation = PasswordValidator.validatePassword(password, email, name);
    const strength = PasswordValidator.getPasswordStrength(password);
    
    res.json({
      isValid: validation.isValid,
      errors: validation.errors,
      strength: strength,
      strict: validation.mustFixAll,
      requirements: {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[@#$%&*!?^()_+=\-{}[\]:";'<>,.\/\\|`~]/.test(password),
        noPersonalInfo: !validation.errors.some(e => e.includes('contain')),
        noCommonPatterns: !PasswordValidator.containsCommonPatterns(password)
      },
      message: validation.isValid ? 
        "✅ Password meets all security requirements" : 
        `❌ ${validation.errors.length} requirement(s) not met`
    });
  } catch (err) {
    console.error('Password validation error:', err);
    res.status(500).json({ 
      message: "Password validation failed",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};
