const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, _id: user._id, email: user.email, role: user.role }, process.env.JWT_REFRESH_SECRET || 'refreshSecret', { expiresIn: '7d' });
};

module.exports = { generateAccessToken, generateRefreshToken };