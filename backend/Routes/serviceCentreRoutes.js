const express = require("express");
const router = express.Router();
const serviceCenterController = require("../ModelControllers/serviceCenterController");
const adminMiddleware=require("../Middleware/adminMiddleware")

router.post("/register", serviceCenterController.registerServiceCenter);
router.post("/login", serviceCenterController.serviceCenterLogin);
router.get("/Scount", serviceCenterController.getCenterCount);
router.get("/Sget", serviceCenterController.getCentre);
router.get("/pending", adminMiddleware, serviceCenterController.getPendingServiceCenters);
router.patch("/approve/:id", adminMiddleware, serviceCenterController.approveServiceCenter);
router.patch('/reject/:id', adminMiddleware, serviceCenterController.rejectServiceCenter);
router.get('/:id/bookings', serviceCenterController.getBookingsForServiceCenter);
router.patch('/booking/:bookingId/status', serviceCenterController.updateBookingStatus);
router.get('/vehicle-image/:filename', serviceCenterController.getVehicleImage);

module.exports = router;