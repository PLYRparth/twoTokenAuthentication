const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields', errors: [] });
        }
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists', errors: [] });
        }

        user = await User.create({ name, email, password, role: role || 'EMP' });
        
        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({ success: true, message: 'User registered', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password', errors: [] });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials', errors: [] });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, message: 'Logged in successfully', data: { accessToken } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'No refresh token', errors: [] });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret');
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token', errors: [] });
        }

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token', errors: [] });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, message: 'Token refreshed', data: { accessToken: newAccessToken } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save({ validateBeforeSave: false });
            }
        }
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ success: true, message: 'Logged out successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -refreshToken');
        res.status(200).json({ success: true, message: 'User profile retrieved', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -refreshToken');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../utils/otp');
const { sendPasswordResetOTP } = require('../services/email.service');

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide an email', errors: [] });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with this email address.', errors: [] });
        }

        const otp = generateOTP();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);

        user.resetPasswordOTP = hashedOTP;
        user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.otpAttempts = 0;
        user.lastOTPRequestAt = Date.now();
        await user.save({ validateBeforeSave: false });

        await sendPasswordResetOTP(user.email, otp);

        if (!res.headersSent) {
            res.status(200).json({ 
                success: true, 
                message: 'OTP has been sent successfully to your email.' 
            });
        }
    } catch (error) {
        console.error('Forgot Password Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Server error', errors: [] });
        }
    }
};

// @desc    Verify Reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Please provide email and otp', errors: [] });
        }

        const user = await User.findOne({ email });
        if (!user || !user.resetPasswordOTP) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.', errors: [] });
        }

        if (user.resetPasswordOTPExpires < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP has expired.', errors: [] });
        }

        if (user.otpAttempts >= 5) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpires = undefined;
            user.otpAttempts = 0;
            await user.save({ validateBeforeSave: false });
            return res.status(400).json({ success: false, message: 'Maximum OTP attempts exceeded.\nPlease request a new OTP.', errors: [] });
        }

        const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
        if (!isMatch) {
            user.otpAttempts += 1;
            if (user.otpAttempts >= 5) {
                user.resetPasswordOTP = undefined;
                user.resetPasswordOTPExpires = undefined;
            }
            await user.save({ validateBeforeSave: false });
            return res.status(400).json({ success: false, message: 'Invalid OTP.', errors: [] });
        }

        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        user.otpAttempts = 0;
        await user.save({ validateBeforeSave: false });

        const resetToken = jwt.sign(
            { userId: user._id, purpose: 'PASSWORD_RESET' },
            process.env.JWT_PASSWORD_RESET_SECRET || 'resetSecret',
            { expiresIn: '5m' }
        );

        res.status(200).json({ success: true, resetToken });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Private (uses reset token)
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized, no reset token', errors: [] });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_PASSWORD_RESET_SECRET || 'resetSecret');
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Reset session expired.\nPlease request a new OTP.', errors: [] });
        }

        if (decoded.purpose !== 'PASSWORD_RESET') {
            return res.status(400).json({ success: false, message: 'Invalid token purpose', errors: [] });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', errors: [] });
        }

        user.password = password;
        // Invalidate existing refresh tokens by setting it to null
        user.refreshToken = null;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, errors: [] });
    }
};

module.exports = { register, login, refresh, logout, getProfile, getMe, forgotPassword, verifyResetOtp, resetPassword };