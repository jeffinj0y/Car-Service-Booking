const jwt = require('jsonwebtoken');
const ServiceCenter = require('../Models/serviceCenter');

const serviceCenterMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const centertoken = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(centertoken, process.env.JWT_SECRET);
    const serviceCenter = await ServiceCenter.findById(decoded.id);

    if (!serviceCenter) {
      return res.status(404).json({ message: 'Service center not found' });
    }

    if (serviceCenter.status !== 'approved') {
      return res.status(403).json({ message: 'Service center is not approved' });
    }

    req.serviceCenter = serviceCenter;
    next();
  } catch (error) {
    console.error('Service center JWT auth error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = serviceCenterMiddleware;
