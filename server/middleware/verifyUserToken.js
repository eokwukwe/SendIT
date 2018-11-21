import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Verify User token
 * @static
 * @param {object} req -The request object
 * @param {object} res - The response object
 * @param {function} next
 * @returns {object}
 */
const verifyUserToken = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (process.env.USER_TYPE !== decoded.usertype) {
      return res.status(401).json({
        message: 'access denied!'
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

export default verifyUserToken;
