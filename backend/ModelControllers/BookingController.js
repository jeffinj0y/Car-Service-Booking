const Booking = require('../Models/Booking');
const ServiceSubCategory = require('../Models/ServiceSubCategory');
const ServiceCenter = require('../Models/serviceCenter');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Debug log to see what is received
    console.log('req.body:', req.body);
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No form data received. Check that multer middleware is used and fields are sent correctly.' });
    }

    // Destructure directly from req.body
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      vehicleNumber,
      vehicleCompany,
      vehicleModel,
      vehicleType,
      serviceCenterId,
      serviceId,
      bookingDate,
      deliveryOption,
      pickupAddress = '',
      specialRequests = '',
      services // may be a JSON string if sent as such
    } = req.body;

    // If services is a JSON string, parse it
    let servicesArr = [];
    if (services) {
      try {
        servicesArr = typeof services === 'string' ? JSON.parse(services) : services;
      } catch (e) {
        return res.status(400).json({ message: 'Invalid services format' });
      }
    }

    // Validate required fields
    if (!userId || !serviceCenterId || (!serviceId && servicesArr.length === 0) || !bookingDate ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // If multiple services, handle accordingly (example: just use the first for now)
    let service, serviceToUseId;
    if (servicesArr.length > 0) {
      serviceToUseId = servicesArr[0].subcategoryId || servicesArr[0]._id;
    } else {
      serviceToUseId = serviceId;
    }
    service = await ServiceSubCategory.findById(serviceToUseId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Validate service center exists
    const serviceCenter = await ServiceCenter.findById(serviceCenterId);
    if (!serviceCenter || serviceCenter.status !== 'approved') {
      return res.status(404).json({ message: 'Service center not available' });
    }

    // Prepare booking data
    const bookingData = {
      user: userId,
      userName,
      userEmail,
      userPhone,
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleCompany,
      vehicleModel,
      vehicleType,
      serviceCenter: serviceCenterId,
      serviceCenterName: serviceCenter.name,
      service: serviceToUseId,
      serviceName: service.name,
      servicePrice: service.price,
      bookingDate: new Date(bookingDate),
      deliveryOption,
      pickupAddress,
      specialRequests,
      status: 'pending',
      paymentStatus: 'pending',
      services: servicesArr // store all services if needed
    };

    // Add vehicle image path if uploaded
    if (req.file) {
      bookingData.vehicleImage = `/uploads/vehicles/${req.file.filename}`;
    }

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId })
      .sort({ bookingDate: -1 })
      .populate('serviceCenter', 'name address')
      .populate('service', 'name price');

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Get all bookings for a service center
const getServiceCenterBookings = async (req, res) => {
  try {
    const { serviceCenterId } = req.params;
    const { status } = req.query;

    const filter = { serviceCenter: serviceCenterId };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .sort({ bookingDate: 1 })
      .populate('user', 'name email phone')
      .populate('service', 'name price');

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching service center bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const allowedStatuses = ['confirmed', 'in-progress', 'completed', 'cancelled', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'cancelled' || status === 'rejected') {
      updateData.cancellationReason = cancellationReason || 'No reason provided';
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking status updated',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, amountPaid, paymentMethod, paymentId } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        paymentStatus,
        amountPaid,
        paymentMethod,
        paymentId
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Payment status updated',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};



module.exports = {
  createBooking,
  getUserBookings,
  getServiceCenterBookings,
  updateBookingStatus,
  updatePaymentStatus
};