const express = require("express");
const router = express.Router();
const serviceCenterController = require("../ModelControllers/serviceCenterController");
const adminMiddleware=require("../Middleware/adminMiddleware")
const Subcategory = require("../Models/ServiceSubCategory");

//admin side
router.get("/count", serviceCenterController.getCenterCount);
router.patch("/approve/:id", adminMiddleware, serviceCenterController.approveServiceCenter);
router.patch('/reject/:id', adminMiddleware, serviceCenterController.rejectServiceCenter);
//Registration and Login Routes
router.post("/register", serviceCenterController.registerServiceCenter);
router.post("/login", serviceCenterController.loginServiceCenter);
router.get("/pending", adminMiddleware, serviceCenterController.getPendingServiceCenters);
router.get("/Sget", serviceCenterController.getCentre);
router.get('/:id', serviceCenterController.getServiceCenterById);
router.get('/services/all-subcategories', async (req, res) => {
  try {
    const services = await Subcategory.find()
      .populate('category', 'name') // if category is required
      .select('name price _id category');
    
    res.json({ subcategories: services });
  } catch (err) {
    console.error("Error in /services/all-subcategories:", err);
    res.status(500).json({ message: 'Error fetching services' });
  }
});

//user bookings
router.get('/:id/bookings', serviceCenterController.getBookingsForServiceCenter);
router.patch('/booking/:bookingId/status', serviceCenterController.updateBookingStatus);
router.get('/vehicle-image/:filename', serviceCenterController.getVehicleImage);
router.patch('/:id/update-services', serviceCenterController.updateServiceList);

module.exports = router;