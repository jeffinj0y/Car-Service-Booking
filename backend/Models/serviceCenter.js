const mongoose = require("mongoose");

const serviceCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    district: String,
    state: String,
    zipCode: String
  },
   services: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceSubCategory',
      required: true
    },
    subcategoryName: {
      type: String,
      required: true
    },
     duration: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
   

  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ServiceCenter", serviceCenterSchema);