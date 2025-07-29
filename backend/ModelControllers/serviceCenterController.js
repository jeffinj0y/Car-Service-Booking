const ServiceCenter = require("../Models/serviceCenter");
const bcrypt = require("bcrypt");
const Booking = require('../Models/booking');
const User = require('../Models/users');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
//register service center
const registerServiceCenter = async (req, res) => {
  try {
    const { name, email, password, phone, address, services } = req.body;
    const existingCenter = await ServiceCenter.findOne({ email });
    if (existingCenter) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newServiceCenter = new ServiceCenter({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      services: Array.isArray(services) ? services : [], // Ensure services is an array
      status: 'pending'
    });

    await newServiceCenter.save();
    res.status(201).json({
      message: "Registration successful! Awaiting admin approval.",
      center: newServiceCenter
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};


// login
const loginServiceCenter = async (req, res) => {
  const { email, password } = req.body;
  const center = await ServiceCenter.findOne({ email });

  if (!center || !(await bcrypt.compare(password, center.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (center.status !== 'approved') {
    return res.status(403).json({
      message: `Access denied. Your account is currently '${center.status}'. Please wait for admin approval.`
    });
  }
  const centertoken = jwt.sign({ id: center._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({
    centertoken,
    serviceCenter: {
      id: center._id,
      name: center.name,
      email: center.email,
      status: center.status
    }
  });
};

//get centre
const getCentre = async (req, res) => {
  try {
    const serviceCenter = await ServiceCenter.find()
    res.send(serviceCenter)
  } catch (error) {
    console.log(error);
  }
}


// get count
const getCenterCount = async (req, res) => {
  try {
    const count = await ServiceCenter.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get service centers count" });
  }
};


// get pending service centers
const getPendingServiceCenters = async (req, res) => {
  try {
    const centers = await ServiceCenter.find({ status: 'pending' });
    res.status(200).json(centers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending centers" });
  }
};


// approve cervice centre
const approveServiceCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCenter = await ServiceCenter.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );
    if (!updatedCenter) {
      return res.status(404).json({ message: "Service center not found" });
    }

    res.status(200).json({
      message: "Service center approved",
      center: updatedCenter
    });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};


// reject service center
const rejectServiceCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const rejectedCenter = await ServiceCenter.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );
    res.status(200).json({ message: "Service center rejected", center: rejectedCenter });

    res.status(200).json({ message: "Service center rejected and removed" });
  } catch (error) {
    res.status(500).json({ message: "Rejection failed" });
  }
};

//get booking for service centre
const getBookingsForServiceCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const filter = { serviceCenter: id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phoneno')
      .populate('services.category', 'name')
      .populate('services.subcategory', 'name')
      .select('+vehicleImage');
    const bookingsWithImageUrls = bookings.map(booking => ({
      ...booking.toObject(),
      vehicleImageUrl: booking.vehicleImage
        ? `${req.protocol}://${req.get('host')}${booking.vehicleImage}`
        : null
    }));
    res.status(200).json({
      success: true,
      bookings: bookingsWithImageUrls
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, updatedAt: Date.now() },
      { new: true }
    )
      .populate('user', 'name email phoneno')
      .populate('services.category', 'name')
      .populate('services.subcategory', 'name');

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('❌ Error updating booking status:', error.message);
    res.status(500).json({ message: 'Failed to update booking status', error: error.message });
  }
};
// get vehicle image
const getVehicleImage = (req, res) => {
  const { filename } = req.params;

  const imagePath = path.join(__dirname, '../public/uploads/vehicles', filename);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ message: 'Image not found' });
  }

  res.sendFile(imagePath);
};
//update service list
const updateServiceList = async (req, res) => {
  try {
    const { id } = req.params;
    const { services } = req.body;

    const updated = await ServiceCenter.findByIdAndUpdate(
      id,
      { services },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Service center not found" });
    }
    console.log('Updating service center:', id);
    console.log('New services:', services);

    res.status(200).json({ success: true, center: updated });
  } catch (error) {
    console.error('Error updating services:', error);
    res.status(500).json({ message: 'Failed to update services' });
  }
};

const getServiceCenterById = async (req, res) => {
  try {
    const center = await ServiceCenter.findById(req.params.id)
      .populate('services', 'name price duration');

    if (!center) {
      return res.status(404).json({ message: "Service center not found" });
    }

    res.status(200).json(center);
  } catch (error) {
    console.error('Error fetching service center:', error);
    res.status(500).json({ message: 'Failed to fetch service center' });
  }
};


module.exports = {
  registerServiceCenter,
  loginServiceCenter,
  getCenterCount,
  getCentre,
  getPendingServiceCenters,
  approveServiceCenter,
  rejectServiceCenter,
  getBookingsForServiceCenter,
  updateBookingStatus,
  getVehicleImage,
  updateServiceList,
  getServiceCenterById
};