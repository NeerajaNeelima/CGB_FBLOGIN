const express = require('express');
const { login, signup,logout,changePassword,sendOtp,verify, forgotPassword,resetPassword,fetch_user_Details } = require('../Controllers/Auth/auth.controllers');
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

//forgot 
router.post('/forgot-password',forgotPassword);

router.post('/reset-password/:token',resetPassword);

router.get('/user_details/:id',fetch_user_Details)

module.exports = router;
