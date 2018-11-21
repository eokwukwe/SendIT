const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      Message: 'Not authenticated, please sign in'
    });
  }
  return next();
};

export default verifyToken;
