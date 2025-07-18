const express = require('express');
const router = express.Router();
const serviceController = require('../ModelControllers/serviceController');
const adminMiddleware = require('../Middleware/adminMiddleware');

// Category Routes
router.post('/categories', adminMiddleware, serviceController.addCategory);
router.get('/categories', serviceController.getCategories);
router.patch('/categories/:id', adminMiddleware, serviceController.updateCategory);
router.delete('/categories/:id', adminMiddleware, serviceController.deleteCategory);

// Subcategory Routes
router.post('/subcategories', adminMiddleware, serviceController.addSubCategory);
router.get('/subcategories/:categoryId', serviceController.getSubCategories);
router.delete('/subcategories/:id', adminMiddleware, serviceController.deleteSubCategory);
router.patch('/subcategories/:id', adminMiddleware, serviceController.updateSubCategory);

module.exports = router;
