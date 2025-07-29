const jwt = require('jsonwebtoken');
const User = require('../Models/users');

const authMiddleware = async (req, res, next) => {
  try {
    const authtoken = req.header('Authorization')?.replace('Bearer ', '');
    if (!authtoken) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const decoded = jwt.verify(authtoken, process.env.JWT_SECRETK);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.authtoken = authtoken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate', error: error.message });
  }
};

module.exports = authMiddleware;