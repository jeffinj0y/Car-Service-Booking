const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Car Washing"
  description: { type: String },
});

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
