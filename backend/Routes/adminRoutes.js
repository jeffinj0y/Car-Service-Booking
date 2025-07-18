const express=require("express")
const router=express.Router()
const adminControllers=require("../ModelControllers/adminController")
const serviceCenterController = require('../ModelControllers/serviceCenterController');
const adminMiddleware = require('../Middleware/adminMiddleware');

router.get("/getAdmin",adminControllers.getAdmin )
router.post("/adminLogin",adminControllers.adminLogin)
router.get('/service-centers/pending', adminMiddleware, serviceCenterController.getPendingServiceCenters);
router.patch('/service-centers/approve/:id', adminMiddleware, serviceCenterController.approveServiceCenter);
router.patch('/service-centers/reject/:id', adminMiddleware, serviceCenterController.rejectServiceCenter);
router.get('/bookings',    adminControllers.getAllBookings);
module.exports = router

 