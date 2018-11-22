import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      Message: 'No valid token provided'
    });
  }
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

export default verifyToken;
