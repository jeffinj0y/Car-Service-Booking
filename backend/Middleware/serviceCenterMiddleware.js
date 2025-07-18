const ServiceCenter = require('../Models/serviceCenter');

const serviceCenterMiddleware = async (req, res, next) => {
  try {
    const serviceCenterId = req.params.serviceCenterId || req.body.serviceCenterId || req.headers['x-service-center-id'];
    
    if (!serviceCenterId) {
      return res.status(401).json({ message: 'Service center identification required' });
    }

    const serviceCenter = await ServiceCenter.findById(serviceCenterId);
    
    if (!serviceCenter) {
      return res.status(404).json({ message: 'Service center not found' });
    }

    // Check if service center is approved
    if (serviceCenter.status !== 'approved') {
      return res.status(403).json({ message: 'Service center not approved' });
    }

    // Attach service center to request for use in controllers
    req.serviceCenter = serviceCenter;
    next();
  } catch (error) {
    console.error('Service center middleware error:', error);
    res.status(500).json({ message: 'Service center authentication failed' });
  }
};

module.exports = serviceCenterMiddleware;