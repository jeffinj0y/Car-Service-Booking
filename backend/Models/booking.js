const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCenter', required: true },
  services: [{
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceSubCategory', required: true },
    duration: {type:Number,require:true},
    price: { type: Number, required: true }
  }],
  vehicle: {
    licensePlate: { type: String, required: true },
    company: { type: String, required: true },
    model: { type: String, required: true },
    vehicleType: { type: String, enum: ['car', 'bike', 'truck', 'other'], required: true }
  },
  vehicleImage: { type: String },
  pickupAddress: {
    street: String,
    city: String,
    postalCode: String
  },
  deliveryOption: {
  type: String,
  enum: ['pickup', 'workshop'], 
  required: true,
},
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  totalDuration: { type: Number, required: true }, 
  paymentStatus: {
  type: String,
  enum: ['pending', 'requested', 'paid'],
  default: 'pending'
},
paymentRequestDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

bookingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
