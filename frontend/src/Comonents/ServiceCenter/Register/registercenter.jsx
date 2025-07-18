import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import './ServiceCenterRegistration.css';

const ServiceCenterRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      zipCode: ''
    },
    services: []
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const nav = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/services/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        try {
          const response = await axios.get(`http://localhost:5002/api/services/subcategories/${selectedCategory}`);
          setSubcategories(response.data);
        } catch (err) {
          console.error('Failed to fetch subcategories', err);
        }
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
  const { value, checked } = e.target;
  const subcategory = subcategories.find(sub => sub._id === value);

  if (checked) {
    setFormData({
      ...formData,
      services: [...formData.services, {
        categoryId: selectedCategory,
        categoryName: categories.find(cat => cat._id === selectedCategory)?.name,
        subcategoryId: value,
        subcategoryName: subcategory?.name,
        price: subcategory?.price,
        duration: subcategory?.duration
      }]
    });
  } else {
    setFormData({
      ...formData,
      services: formData.services.filter(service => service.subcategoryId !== value)
    });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Ensure services is properly formatted
    const submissionData = {
      ...formData,
      services: formData.services.map(service => ({
        categoryId: service.categoryId,
        categoryName: service.categoryName,
        subcategoryId: service.subcategoryId,
        subcategoryName: service.subcategoryName,
        price: service.price,
        duration: service.duration
      }))
    };

    const response = await axios.post(
      'http://localhost:5002/api/service-centers/register',
      submissionData
    );
    setSuccess(true);
    setError('');
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed');
    setSuccess(false);
  }
};

  return (
    <div className="registration-container">
      <h2>Service Center Registration</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Center Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="address-section">
          <h3>Address</h3>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={formData.address.district}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
<div className="services-section">
          <h3>Services Offered</h3>
          
          <div className="form-group">
            <label>Select Category</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">-- Select a Category --</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCategory && (
            <div className="subcategories-section">
              <h4>Available Subcategories</h4>
              <div className="subcategories-checkbox">
                {subcategories.map(subcategory => (
                  <label key={subcategory._id}>
                    <input
                      type="checkbox"
                      value={subcategory._id}
                      checked={formData.services.some(s => s.subcategoryId === subcategory._id)}
                      onChange={handleSubcategoryChange}
                    />
                    {subcategory.name} - ₹{subcategory.price}- {subcategory.duration} mins
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="selected-services">
            <h4>Selected Services</h4>
            {formData.services.length > 0 ? (
              <ul>
                {formData.services.map((service, index) => (
                  <li key={index}>
                    {service.categoryName} &gt; {service.subcategoryName}(₹{service.price}, {service.duration} mins)
                  </li>
                ))}
              </ul>
            ) : (
              <p>No services selected</p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Register
        </button>
        <p style={{ color: "black" }}>
          Already have an account?{" "}
          <span className="link" onClick={() => nav("/loginserviceCentre")}>
            Login here
          </span>
        </p>
        {success && (
          <div className="success-message">
            Registration successful! Awaiting admin approval.
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default ServiceCenterRegistration;