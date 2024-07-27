const jwt = require('jsonwebtoken');
const secretKey = "ketan";

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).send({ message: "No token provided" });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: "Failed to authenticate token" });
        }

        req.userId = decoded.userEmail; 
        next();
    });
};

module.exports = auth;
