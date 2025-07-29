import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceCenterHome.css';
// import UpdateServicesTab from './UpdateServicesTab';

export default function ServiceCenterHome() {
  const [activeTab, setActiveTab] = useState('pending');
  const [serviceCenter, setServiceCenter] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch service center details from localStorage or API
    const centerData = JSON.parse(localStorage.getItem('serviceCenter'));
    if (!centerData) {
      navigate('/service-center/login');
      return;
    }
    setServiceCenter(centerData);

    // Fetch bookings based on active tab
    fetchBookings(centerData.id, activeTab);
  }, [activeTab, navigate]);

  const fetchBookings = async (bookingId, status) => {
    try {
      // Replace with actual API call
      const response = await fetch(`http://localhost:5002/api/service-centers/${bookingId}/bookings?status=${status}`);
      const data = await response.json();
      setBookings(data.bookings || []);

    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('serviceCenter');
    localStorage.removeItem('token');
    navigate('/loginserviceCentre');
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await fetch(`http://localhost:5002/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('centertoken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchBookings(serviceCenter.id, activeTab);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };
  return (
    <div className="service-center-container">
      {/* Header */}
      <header className="sc-header">
        <div className="sc-header-info">
          <h2>{serviceCenter?.name || 'Service Center'}</h2>
          <p>{serviceCenter?.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="sc-main-content">
        {/* Sidebar */}
        <aside className="sc-sidebar">
          <nav>
            <ul>
              <li
                className={activeTab === 'pending' ? 'active' : ''}
                onClick={() => setActiveTab('pending')}
              >
                Pending Orders
              </li>
              <li
                className={activeTab === 'confirmed' ? 'active' : ''}
                onClick={() => setActiveTab('confirmed')}
              >
                Confirmed Orders
              </li>
              <li
                className={activeTab === 'in-progress' ? 'active' : ''}
                onClick={() => setActiveTab('in-progress')}
              >
                In Progress
              </li>
              <li
                className={activeTab === 'completed' ? 'active' : ''}
                onClick={() => setActiveTab('completed')}
              >
                Completed Orders
              </li>
              {/* <li
                className={activeTab === 'update-services' ? 'active' : ''}
                onClick={() => setActiveTab('update-services')}
              >
                Our Services Update
              </li> */}

            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="sc-content">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h2>
        
          <div className="bookings-list">
            {bookings.length === 0 ? (
              <p>No {activeTab} bookings found</p>
            ) : (
              bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-info">
                    <h3>Booking #{booking._id.slice(-6)}</h3>
                    <p>Customer: {booking.user?.name}</p>
                    <p>Vehicle: {booking.vehicle.company} {booking.vehicle.model}</p>
                    <div className="service-details">
                      {booking.services.map((service, index) => (
                        <div key={index} className="service-item">
                          <p><strong>Service selected:</strong> {service.subcategory?.name}</p>
                        </div>
                      ))}
                    </div>
                    <p>License: {booking.vehicle.licensePlate}</p>
                    <p>Date: {new Date(booking.scheduledDate).toLocaleString()}</p>
                    <p>Total Amount: ₹{booking.totalAmount}</p>
                    <p>Status: {booking.status}</p>
                    <p>PaymentStatus: {booking.paymentStatus}</p>
                    <p>Delivery Option: {booking.deliveryOption}</p>
                    {booking.deliveryOption === 'pickup' && booking.pickupAddress && (
                      <div className="pickup-address">
                        <p><strong>Pickup Address:</strong></p>
                        <p>
                          {booking.pickupAddress.street}, {booking.pickupAddress.city}, {booking.pickupAddress.postalCode}
                        </p>
                        {booking.vehicleImage && (
                          <div className="vehicle-image-preview">
                            <p><strong>Vehicle Image:</strong></p>
                            <img
                              src={`http://localhost:5002/api/service-centers/vehicle-image/${booking.vehicleImage.split('/').pop()}`}
                              alt="Vehicle"
                              style={{ maxWidth: '200px', borderRadius: '8px' }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {activeTab === 'pending' && (
                    <div className="booking-actions">
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        className="confirm-btn"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'rejected')}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {activeTab === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'in-progress')}
                      className="start-btn"
                    >
                      Start Service
                    </button>
                  )}

                  {activeTab === 'in-progress' && (
                    <button
                      onClick={() => updateBookingStatus(booking._id, 'completed')}
                      className="complete-btn"
                    >
                      Mark as Completed
                    </button>
                  )}
                  {activeTab === 'completed' && booking.paymentStatus === 'pending' && (
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`http://localhost:5002/api/bookings/${booking._id}/request-payment`, {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${localStorage.getItem('centertoken')}`,
                            }
                          });
                          fetchBookings(serviceCenter.id, activeTab);
                        } catch (err) {
                          console.error('Error requesting payment:', err);
                        }
                      }}
                      className="request-payment-btn"
                    >
                      Request Payment
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

;