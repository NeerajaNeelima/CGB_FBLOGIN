const express = require('express');
const { login, signup,logout,changePassword,sendOtp,verify } = require('../Controllers/Auth/auth.controllers');
const router = express.Router();

// Sign Up Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Logout Route
router.post('/logout', logout);

//Send otp route
router.post('/send-otp', sendOtp);

//Send otp route
router.get('/verify', verify);

router.post('/change-password',changePassword);


module.exports = router;
