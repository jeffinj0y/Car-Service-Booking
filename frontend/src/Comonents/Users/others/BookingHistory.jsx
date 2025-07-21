import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingHistory.css';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5002/api/bookings/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleViewBooking = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };
     console.log(bookings);
     
  return (
    <div className="booking-history-container">
      <h2>My Booking History</h2>
      <p>Total Bookings: <strong>{bookings.length}</strong></p>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="booking-history-list">
          {bookings.map((booking) => (
            <div className="booking-history-card" key={booking._id}>
              <div className="history-info">
                <p><strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                <p><strong>Vehicle:</strong> {booking.vehicle.company} {booking.vehicle.model}</p>
                <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                <p><strong>Delivery Option:</strong>{booking.deliveryOption}</p>
              </div>

              <div className="history-actions">
                <button onClick={() => handleViewBooking(booking._id)} className="view-btn">
                  View
                </button>
                {booking.paymentStatus === 'requested' && (
        <button className="h-payment-btn" onClick={() => handleViewBooking(booking._id)}>
          Proceed to Payment
        </button>
      )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
