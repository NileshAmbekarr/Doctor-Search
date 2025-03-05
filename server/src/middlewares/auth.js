// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }
    // Remove "Bearer " if present
    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // decoded typically contains { id, role, ... }
        next();
    } catch (err) {
        console.error('JWT error:', err);
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
