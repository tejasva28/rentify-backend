// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

    if (!token) {
        if (req.session && req.session.passport && req.session.passport.user) {
            // If using session-based authentication (e.g., with Passport)
            req.user = { id: req.session.passport.user };
            return next();
        } else {
            return res.status(401).send('Access Token Required'); // Send 401 if no token is present
        }
    }

    // Verify JWT from Authorization header
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(403).send('Invalid token'); // Send 403 for invalid token
        }
        req.user = { id: decoded.id }; // Attach the user ID to the request
        next();
    });
}

module.exports = authenticateToken;
