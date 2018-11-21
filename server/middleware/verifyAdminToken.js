import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Verify Admin token
 * @static
 * @param {object} req -The request object
 * @param {object} res - The response object
 * @param {function} next
 * @returns {object}
 */
const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (process.env.ADMIN_TYPE !== decoded.usertype) {
      return res.status(401).json({
        message: 'access denied! you are not authorized to visit this page'
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'auth error',
      message: error
    });
  }
};

export default verifyAdminToken;
