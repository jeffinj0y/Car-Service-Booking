const Booking = require('../Models/booking');
const Razorpay = require('razorpay');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new booking
const createBooking = async (req, res) => {
  try {
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
      bookingDate,
      deliveryOption,
      totalAmount,
      totalDuration,
      pickupstreet,
      pickupcity,
      pickupPostalcode,
      paymentStatus
    } = req.body;

    const services = JSON.parse(req.body.services || '[]');

    const newBooking = new Booking({
      scheduledDate: bookingDate,
      user: userId,
      serviceCenter: serviceCenterId,
      vehicle: {
        licensePlate: vehicleNumber,
        company: vehicleCompany,
        model: vehicleModel,
        vehicleType
      },
      services,
      deliveryOption: req.body.deliveryOption || 'workshop',
      totalAmount,
      totalDuration,
      pickupAddress: deliveryOption === 'pickup' ? {
        street: pickupstreet,
        city: pickupcity,
        postalCode: pickupPostalcode
      } : undefined,
      paymentStatus,
    });

    if (req.file) {
      newBooking.vehicleImage = req.file.filename;
    }

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: req.user.id })
      .sort({ bookingDate: -1 })
      .populate('services.category services.subcategory')
      .populate('serviceCenter')
      .populate('user');

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
    const { bookingId } = req.params;

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
      bookingId,
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
const userConfirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentId, paymentMethod, amountPaid } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'paid',
        paymentId,
        paymentMethod,
        amountPaid,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Payment confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('User payment update error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};


// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('services.subcategory')
      .populate('user', 'name email phone')
      .populate('serviceCenter', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

// Request payment for a booking
const requestPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'requested',
        paymentRequestDate: new Date()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Payment request sent', booking });
  } catch (error) {
    console.error('Error requesting payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Razor pay
const createRazorpayOrder = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    console.log("Found booking:", booking._id);
    console.log("Booking totalAmount:", booking.totalAmount);

    if (!booking.totalAmount || typeof booking.totalAmount !== 'number') {
      return res.status(400).json({ message: 'Invalid booking amount' });
    }

    const options = {
      amount: Math.round(booking.totalAmount * 100), // ₹ to paise
      currency: "INR",
      receipt: `receipt_${booking._id}`,
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      bookingId: booking._id,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Razorpay order error:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message || error });
  }
};



module.exports = {
  createBooking,
  getUserBookings,
  getServiceCenterBookings,
  updateBookingStatus,
  userConfirmPayment,
  getBookingById,
  requestPayment,
  createRazorpayOrder
};