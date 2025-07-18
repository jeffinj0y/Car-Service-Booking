 import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './History.css'
export default function BookingDetails() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
const nav=useNavigate();
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5002/api/bookings/userbook/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooking(res.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBooking();
  }, [bookingId]);
console.log('Booking ID from params:', bookingId);

 const handlePayment = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`http://localhost:5002/api/bookings/create-order/${booking._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { id, amount, currency, key } = res.data;

    const options = {
      key,
      amount,
      currency,
      name: "Auto Service Booking",
      description: "Service Payment",
      order_id: id,
      handler: async function (response) {
        // Call backend to update payment status
        await axios.patch(`http://localhost:5002/api/bookings/${booking._id}/payment`, {
          paymentStatus: 'paid',
        //   paymentId: response.razorpay_payment_id,
        //   paymentMethod: 'Razorpay',
        //   amountPaid: amount / 100
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert("Payment successful!");
        window.location.reload(); // or navigate
      },
      prefill: {
        name: booking.userName,
        email: booking.userEmail,
        contact: booking.userPhone,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment error:", err);
    alert("Payment failed. Try again.");
  }
};


  if (!booking) return <p>Loading booking details...</p>;

  return (
    <div className="booking-details">
      <h2>Booking Details</h2>
      <p><strong>Status:</strong> {booking.status}</p>
      <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
      <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>

      <h3>Service Details:</h3>
      <ul>
        {booking.services.map((service, idx) => (
          <li key={idx}>
            {service.subcategory.name} - ₹{service.price} ({service.duration} hrs)
          </li>
        ))}
      </ul>

      {booking.paymentStatus === 'requested' && (
        <button className="payment-btn" onClick={handlePayment}>
          Proceed to Payment
        </button>
      )}
       <button className="continue-btn" onClick={()=>nav('/')}>
          Continue Booking
        </button>
    </div>
  );
}