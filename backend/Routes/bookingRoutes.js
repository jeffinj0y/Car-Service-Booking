const express = require('express');
const router = express.Router();
const bookingController = require('../ModelControllers/bookingController');
const authMiddleware = require('../Middleware/adminMiddleware');
const upload = require('../dbconnection/multerConfig'); 
const serviceCenterMiddleware = require('../Middleware/serviceCenterMiddleware');

// User routes
router.post('/', authMiddleware, upload.single('vehicleImage'), bookingController.createBooking);
router.get('/user/:userId', authMiddleware, bookingController.getUserBookings);

// Service center routes
router.get('/service-center/:serviceCenterId', serviceCenterMiddleware, bookingController.getServiceCenterBookings);
router.patch('/:id/status', serviceCenterMiddleware, bookingController.updateBookingStatus);
router.patch('/:id/payment', authMiddleware, bookingController.updatePaymentStatus);
module.exports = router;