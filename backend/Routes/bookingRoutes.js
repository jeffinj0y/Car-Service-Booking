const express = require('express');
const router = express.Router();
const bookingController = require('../ModelControllers/BookingController');
const authMiddleware = require('../Middleware/authMiddleware');
const upload = require('../dbconnection/multerConfig');
const serviceCenterMiddleware = require('../Middleware/serviceCenterMiddleware');

// User routes
router.post('/', authMiddleware, upload.single('vehicleImage'), bookingController.createBooking);
router.get('/user/:userId', authMiddleware, bookingController.getUserBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.post('/pay/:bookingId', (req, res, next) => {
    console.log("Create Razorpay Order Hit with ID:", req.params.bookingId);
    next();
}, bookingController.createRazorpayOrder);
router.patch('/:bookingId/payment', authMiddleware, bookingController.userConfirmPayment);

// Service center routes
router.get('/service-center/:serviceCenterId', serviceCenterMiddleware, bookingController.getServiceCenterBookings);
router.patch('/:bookingId/status', serviceCenterMiddleware, bookingController.updateBookingStatus);
router.patch('/:bookingId/request-payment', serviceCenterMiddleware, bookingController.requestPayment);
module.exports = router;