const mongoose = require('mongoose');

const serviceSubCategorySchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceCategory',
    required: true
  },
  name: { type: String, required: true }, // e.g., "Body Wash"
  description: String,
  price: Number,
  duration: Number 
});

module.exports = mongoose.model('ServiceSubCategory', serviceSubCategorySchema);
