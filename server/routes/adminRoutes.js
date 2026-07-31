const express = require('express');
const { protect } = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const router = express.Router();

router.get('/dashboard', protect, authorizeRoles('ADMIN'), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome to the Admin Dashboard' });
});

module.exports = router;
