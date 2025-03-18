const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);

// Protected route to get current user's information
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
