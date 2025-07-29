import  { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceAdd.css'; 
const AdminAddService = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [price, setPrice] = useState('');
  const [subDuration, setSubDuration] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDesc, setEditCategoryDesc] = useState('');
  const [editSubId, setEditSubId] = useState(null);
  const [editSubName, setEditSubName] = useState('');
  const [editSubDesc, setEditSubDesc] = useState('');
  const [editSubPrice, setEditSubPrice] = useState('');
  const [editSubDuration, setEditSubDuration] = useState('');

  // Fetch categories & subcategories
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchSubcategories();
    }
  }, [categories]);

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5002/api/services/categories');
    setCategories(res.data);
  };

  const fetchSubcategories = async () => {
    const res = await Promise.all(
      categories.map(cat =>
        axios.get(`http://localhost:5002/api/services/subcategories/${cat._id}`)
      )
    );

    const all = res.map((r, i) => ({
      categoryId: categories[i]._id,
      categoryName: categories[i].name,
      services: r.data
    }));

    setSubcategories(all);
  };

  const handleAddCategory = async () => {
    try {
      const admintoken = localStorage.getItem('admintoken');
      const res = await axios.post(
        'http://localhost:5002/api/services/categories',
        { name: newCategory, description: newCatDesc },
        { headers: { Authorization: `Bearer ${admintoken}` } }
      );
      setMessage('Category added!');
      setNewCategory('');
      setNewCatDesc('');
      setCategories([...categories, res.data.category]);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleAddSubcategory = async () => {
    try {
      const admintoken = localStorage.getItem('admintoken');
      await axios.post(
        'http://localhost:5002/api/services/subcategories',
        {
          categoryId: selectedCategory,
          name: subName,
          description: subDesc,
          price,
          duration: subDuration
        },
        { headers: { Authorization: `Bearer ${admintoken}` } }
      );
      setMessage('Subcategory added!');
      setSubName('');
      setSubDesc('');
      setPrice('');
      setSubDuration('');
      fetchSubcategories(); // 🔄 Refresh list after add
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add subcategory');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (categoryId) => {
    try {
      const admintoken = localStorage.getItem('admintoken');
      await axios.delete(`http://localhost:5002/api/services/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${admintoken}` }
      });
      setCategories(categories.filter(cat => cat._id !== categoryId));
      setMessage('Category deleted!');
      fetchSubcategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete category');
    }
  };

  // Delete Subcategory
  const handleDeleteSubcategory = async (subId, categoryId) => {
    try {
      const admintoken = localStorage.getItem('admintoken');
      await axios.delete(`http://localhost:5002/api/services/subcategories/${subId}`, {
        headers: { Authorization: `Bearer ${admintoken}` }
      });
      setMessage('Subcategory deleted!');
      fetchSubcategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete subcategory');
    }
  };

  // Edit Category (placeholder logic)
  const handleEditCategory = (cat) => {
    setEditCategoryId(cat._id);
    setEditCategoryName(cat.name);
    setEditCategoryDesc(cat.description);
  };
  const handleUpdateCategory = async () => {
    try {
      const admintoken = localStorage.getItem('admintoken');
      await axios.patch(`http://localhost:5002/api/services/categories/${editCategoryId}`, {
        name: editCategoryName,
        description: editCategoryDesc
      }, {
        headers: { Authorization: `Bearer ${admintoken}` }
      });
      setMessage('Category updated!');
      setEditCategoryId(null);
      fetchCategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update category');
    }
  };

  // Edit Subcategory (placeholder logic)
  const handleEditSubcategory = (sub, categoryId) => {
    setEditSubId(sub._id);
    setEditSubName(sub.name);
    setEditSubDesc(sub.description);
    setEditSubPrice(sub.price);
    setEditSubDuration(sub.duration || '');
    setSelectedCategory(categoryId); // Store the categoryId for update
  };
  const handleUpdateSubcategory = async () => {
    try {
      const admintoken = localStorage.getItem('admintoken');
      await axios.patch(`http://localhost:5002/api/services/subcategories/${editSubId}`, {
        name: editSubName,
        description: editSubDesc,
        price: editSubPrice,
        duration: editSubDuration,
        categoryId: selectedCategory // Send categoryId as well
      }, {
        headers: { Authorization: `Bearer ${admintoken}` }
      });
      setMessage('Subcategory updated!');
      setEditSubId(null);
      fetchSubcategories();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update subcategory');
    }
  };

  return (
    <div className="admin-add-service p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">➕ Add Service Category</h2>
      <input
        placeholder="Category Name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <input
        placeholder="Description"
        value={newCatDesc}
        onChange={(e) => setNewCatDesc(e.target.value)}
      />
      <button onClick={handleAddCategory}>Add Category</button>

      <h2 className="text-2xl font-semibold mt-6 mb-2">➕ Add Subcategory</h2>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>
      <input
        placeholder="Subcategory Name"
        value={subName}
        onChange={(e) => setSubName(e.target.value)}
      />
      <input
        placeholder="Description"
        value={subDesc}
        onChange={(e) => setSubDesc(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
      />
      <input
        placeholder="Duration (min)"
        value={subDuration}
        onChange={e => setSubDuration(e.target.value)}
        type="number"
        min="1"
      />
      <button onClick={handleAddSubcategory}>Add Subcategory</button>

      {message && <p className="text-green-600 mt-4">{message}</p>}

      {/* 🔽 Display Added Services */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-4">📋 Existing Services</h3>
        {subcategories.length > 0 ? (
          subcategories.map((group) => (
            <div key={group.categoryId} className="mb-6">
              <h4 className="text-lg font-semibold text-purple-700 flex items-center">
                {editCategoryId === group.categoryId ? (
                  <>
                    <input value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                    <input value={editCategoryDesc} onChange={e => setEditCategoryDesc(e.target.value)} />
                    <button onClick={handleUpdateCategory} className="ml-2 text-green-600">Save</button>
                    <button onClick={() => setEditCategoryId(null)} className="ml-1 text-gray-500">Cancel</button>
                  </>
                ) : (
                  <>
                    {group.categoryName}
                    <button onClick={() => handleEditCategory({ _id: group.categoryId, name: group.categoryName, description: '' })} className="ml-2 text-blue-600">Edit</button>
                    <button onClick={() => handleDeleteCategory(group.categoryId)} className="ml-1 text-red-600">Delete</button>
                  </>
                )}
              </h4>
              <ul className="ml-4 mt-2 list-disc text-sm text-gray-800">
                {group.services.map((service) => (
                  <li key={service._id} className="flex items-center">
                    {editSubId === service._id ? (
                      <>
                        <input value={editSubName} onChange={e => setEditSubName(e.target.value)} />
                        <input value={editSubDesc} onChange={e => setEditSubDesc(e.target.value)} />
                        <input value={editSubPrice} onChange={e => setEditSubPrice(e.target.value)} type="number" />
                        <input value={editSubDuration} onChange={e => setEditSubDuration(e.target.value)} type="number" min="1" placeholder="Duration (min)" />
                        <button onClick={handleUpdateSubcategory} className="ml-2 text-green-600">Save</button>
                        <button onClick={() => setEditSubId(null)} className="ml-1 text-gray-500">Cancel</button>
                      </>
                    ) : (
                      <>
                        <strong>{service.name}</strong> – ₹{service.price} <br />
                        <span className="text-gray-600">{service.description}</span><br />
                        <span className="text-gray-600">Duration: {service.duration} mins</span>
                        <button onClick={() => handleEditSubcategory(service, group.categoryId)} className="ml-2 text-blue-600">Edit</button>
                        <button onClick={() => handleDeleteSubcategory(service._id, group.categoryId)} className="ml-1 text-red-600">Delete</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No services found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAddService;
