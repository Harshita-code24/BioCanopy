import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'biocanopy_jwt_secret_dev_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = decodedUser;
    next();
  });
}
