import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserBooking.css';

export default function UserBooking() {
  const location = useLocation();
  const nav = useNavigate();
  const [serviceCenters, setServiceCenters] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({
    licensePlate: '',
    company: '',
    model: '',
    type: 'car'
  });
  const [scheduledDate, setScheduledDate] = useState('');
  const [pickupAddress, setPickupAddress] = useState({ 
    street: '', 
    city: '',
    postalCode: ''
  });
  const [deliveryOption, setDeliveryOption] = useState('workshop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Fetch approved service centers
  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/service-centers/Sget');
        const approvedCenters = response.data.filter(center => center.status === 'approved');
        setServiceCenters(approvedCenters);

        if (location.state?.selectedCenterId) {
          const center = approvedCenters.find(c => c._id === location.state.selectedCenterId);
          if (center) {
            setSelectedCenter(center);
            setServices(center.services || []);
          }
        }
      } catch (err) {
        setError('Failed to load service centers');
      }
    };
    fetchServiceCenters();
  }, [location.state]);

  const toggleServiceSelection = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.subcategoryId === service.subcategoryId);
      if (isSelected) {
        return prev.filter(s => s.subcategoryId !== service.subcategoryId);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVehicleImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
console.log('Sending deliveryOption:', deliveryOption);
    // Validate required fields
    if (
      !selectedServices.length ||
      !scheduledDate ||
      !vehicleDetails.licensePlate ||
      !vehicleDetails.company ||
      !vehicleDetails.model ||
      !vehicleDetails.type ||
      (deliveryOption === 'pickup' &&
        (!pickupAddress.street || !pickupAddress.city || !pickupAddress.postalCode))
    ) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const formattedServices = selectedServices.map(s => ({
        category: s.categoryId,
        subcategory: s.subcategoryId,
        duration: s.duration,
        price: s.price
      }));

      const formData = new FormData();

      // Add all required fields
      formData.append('userId', user._id);
      formData.append('userName', user.name);
      formData.append('userEmail', user.email);
      formData.append('userPhone', user.phone);
      formData.append('vehicleNumber', vehicleDetails.licensePlate);
      formData.append('vehicleCompany', vehicleDetails.company);
      formData.append('vehicleModel', vehicleDetails.model);
      formData.append('vehicleType', vehicleDetails.type);
      formData.append('serviceCenterId', selectedCenter._id);

      // Add all selected services
      formData.append('services', JSON.stringify(formattedServices));
      formData.append('bookingDate', scheduledDate);
     formData.append('deliveryOption', deliveryOption);
      formData.append('totalAmount', calculateTotal());
      formData.append('totalDuration', calculateTotalDuration());
      if (deliveryOption === 'pickup') {
        formData.append('pickupstreet', pickupAddress.street);
        formData.append('pickupcity', pickupAddress.city);
        formData.append('pickupPostalcode', pickupAddress.postalCode);
      }

      if (vehicleImage) {
        formData.append('vehicleImage', vehicleImage);
      }
      const response = await axios.post(
        'http://localhost:5002/api/bookings',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        nav('/bookinghistory', {
          state: { booking: response.data.booking }
        });
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };
  const calculateTotal = () => {
    return selectedServices.reduce((total, service) =>
      total + parseFloat(service.price || 0), 0).toFixed(2);
  };
  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  };
  console.log("Selected services:", selectedServices);
  return (
    <div className="booking-container">
      <h1>Book a Service</h1>

      <form onSubmit={handleSubmit} className="booking-form">
        {selectedCenter && (
          <div className="service-center-display">
            <div className="service-center-info">
              <p className="service-center-label">Service Center:</p>
              <div className="service-center-name-box">
                {selectedCenter.name}
              </div>
            </div>
            <div className="service-center-address">
              {selectedCenter.address?.street && `${selectedCenter.address.street}, `}
              {selectedCenter.address?.city && `${selectedCenter.address.city}, `}
              {selectedCenter.address?.state && `${selectedCenter.address.state} `}
              {selectedCenter.address?.zipCode && selectedCenter.address.zipCode}
            </div>
          </div>
        )}

        {selectedCenter && (
          <div className="services-section">
            <h3>Available Services</h3>
            <div className="services-table-container">
              <table className="book-services-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Duration (mins)</th>
                    <th>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedServices.some(s => s.subcategoryId === service.subcategoryId)}
                          onChange={() => toggleServiceSelection(service)}
                        />
                      </td>
                      <td>{service.subcategoryName}</td>
                      <td>{service.categoryName}</td>
                      <td className="duration-cell">{service.duration || 'N/A'}</td>
                      <td className="price-cell">₹{service.price || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="totals-row">
                    <td colSpan="3" className="total-label">Total:</td>
                    <td className="total-duration">{calculateTotalDuration()} mins</td>
                    <td className="total-amount">₹{calculateTotal()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="form-section">
          <h3>Vehicle Details</h3>
          <div className="book-form-group

">
            <label>Vehicle Registration Number</label>
            <input
              type="text"
              placeholder='KL01AB1234'
              value={vehicleDetails.licensePlate}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, licensePlate: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="book-form-group

">
              <label>Company</label>
              <input
                type="text"
                value={vehicleDetails.company}
                onChange={(e) => setVehicleDetails({ ...vehicleDetails, company: e.target.value })}
                required
              />
            </div>
            <div className="book-form-group

">
              <label>Name</label>
              <input
                type="text"
                value={vehicleDetails.model}
                onChange={(e) => setVehicleDetails({ ...vehicleDetails, model: e.target.value })}
                required
              />
            </div>
            <div className="book-form-group">
              <label>Type</label>
              <select
                value={vehicleDetails.type}
                onChange={e => setVehicleDetails({ ...vehicleDetails, type: e.target.value })}
                required
              >
                <option value="car">Car</option>
                <option value="suv">SUV</option>
                <option value="van">Van</option>
              </select>
            </div>
          </div>
          <div className="book-form-group

">
           
          </div>
        </div>

        <div className="form-section">
          <h3>Appointment Details</h3>
          <div className="form-row">
            <div className="book-form-group

">
              <label>Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

          </div>

          <div className="book-form-group">
            <label>Delivery Option</label>
            <div className="book-delivery-options">
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="workshop"
                  checked={deliveryOption === 'workshop'}
                  onChange={() => setDeliveryOption('workshop')}
                />
                I will bring my vehicle to the workshop
              </label>
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="pickup"
                  checked={deliveryOption === 'pickup'}
                  onChange={() => setDeliveryOption('pickup')}
                />
                Pick up my vehicle from home
              </label>
            </div>
          </div>

        {deliveryOption === 'pickup' && (
  <div className="book-form-group

">
    <label>Pickup Address</label>
    
    <input
      type="text"
      placeholder="Street"
      value={pickupAddress.street}
      onChange={(e) => setPickupAddress({ ...pickupAddress, street: e.target.value })}
      required
    />
    <input
      type="text"
      placeholder="City"
      value={pickupAddress.city}
      onChange={(e) => setPickupAddress({ ...pickupAddress, city: e.target.value })}
      required
    />
    <input
      type="text"
      placeholder="Postal Code"
      value={pickupAddress.postalCode}
      onChange={(e) => setPickupAddress({ ...pickupAddress, postalCode: e.target.value })}
      required
    /><br></br>
     <label>Upload Vehicle Image </label>
            <div className="image-upload-container">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current.click()}
              >
                Choose Image
              </button>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Vehicle preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview('');
                      setVehicleImage(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
  </div>
)}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading || selectedServices.length === 0} className="submit-btn">
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

