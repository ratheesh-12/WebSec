const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  changePassword, 
  validatePassword,
  validatePasswordRealtime 
} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/validate-password", validatePassword);
router.post("/validate-password-realtime", validatePasswordRealtime);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

module.exports = router;
