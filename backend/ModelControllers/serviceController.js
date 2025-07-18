const ServiceCategory = require('../Models/ServiceCategory');
const ServiceSubCategory = require('../Models/ServiceSubCategory');

//add category 
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await ServiceCategory.findOne({ name });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    const category = new ServiceCategory({ name, description });
    await category.save();
    res.status(201).json({ message: 'Category added', category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add category', error: err.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// Add a subcategory
const addSubCategory = async (req, res) => {
  try {
    const { categoryId, name, description, price, duration } = req.body;

    const sub = new ServiceSubCategory({
      category: categoryId,
      name,
      description,
      duration,
      price
    });

    await sub.save();
    res.status(201).json({ message: 'Subcategory added', sub });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add subcategory', error: err.message });
  }
};

// Get all subcategories for a category
const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subs = await ServiceSubCategory.find({ category: categoryId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subcategories' });
  }
};
// Delete
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ServiceSubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ message: 'Failed to delete subcategory' });
  }
};
// Update
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, categoryId } = req.body;

    const updatedSub = await ServiceSubCategory.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(duration && { duration }),
        ...(price && { price }),
        ...(categoryId && { category: categoryId })
      },
      { new: true }
    );

    if (!updatedSub) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json({
      message: 'Subcategory updated successfully',
      subcategory: updatedSub
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ message: 'Failed to update subcategory' });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete all subcategories linked to this category
    await ServiceSubCategory.deleteMany({ category: id });

    // Delete the category itself
    const result = await ServiceCategory.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category and its subcategories deleted' });
  } catch (err) {
    console.error("Error deleting category", err);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};
// Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await ServiceCategory.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description })
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

module.exports = {
  addCategory,
  getCategories,
  addSubCategory,
  getSubCategories,
  deleteSubCategory,
  updateSubCategory,
  deleteCategory,
  updateCategory,
};
