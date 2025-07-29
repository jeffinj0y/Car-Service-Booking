const jwt = require('jsonwebtoken');
const Admin = require('../Models/admin');

const adminMiddleware = async (req, res, next) => {
  try {
    const admintoken = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!admintoken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(admintoken, process.env.JWT_SECRETKEY);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = adminMiddleware;