import { useEffect, useState } from 'react';
import RequestServiceUpdate from './RequestServiceUpdate';

export default function RequestServiceUpdate({ bookings, onRequestSuccess }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [requestedServices, setRequestedServices] = useState([{ subcategory: '', price: 0, duration: 0 }]);

  const handleAddService = () => {
    setRequestedServices([...requestedServices, { subcategory: '', price: 0, duration: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...requestedServices];
    updated[index][field] = value;
    setRequestedServices(updated);
  };

  const handleSubmit = async () => {
    if (!selectedBooking || requestedServices.length === 0) return alert('Fill all fields');

    try {
      await fetch(`http://localhost:5002/api/bookings/${selectedBooking}/request-additional-services`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services: requestedServices }),
      });
      alert('Request sent!');
      setRequestedServices([{ subcategory: '', price: 0, duration: 0 }]);
      onRequestSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to send request');
    }
  };

  return (
    <div className="request-service-update">
      <h2>Request Additional Services</h2>

      <label>Select Booking:</label>
      <select onChange={(e) => setSelectedBooking(e.target.value)} value={selectedBooking || ''}>
        <option value="">-- Select Booking --</option>
        {bookings.map((b) => (
          <option key={b._id} value={b._id}>
            #{b._id.slice(-6)} - {b.user?.name}
          </option>
        ))}
      </select>

      <h3>Requested Services</h3>
      {requestedServices.map((service, idx) => (
        <div key={idx} className="requested-service-entry">
          <input
            type="text"
            placeholder="Subcategory ID"
            value={service.subcategory}
            onChange={(e) => handleChange(idx, 'subcategory', e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={service.price}
            onChange={(e) => handleChange(idx, 'price', parseFloat(e.target.value))}
          />
          <input
            type="number"
            placeholder="Duration (min)"
            value={service.duration}
            onChange={(e) => handleChange(idx, 'duration', parseFloat(e.target.value))}
          />
          
        </div>
      ))}
{activeTab === 'update-services' && (
  <RequestServiceUpdate
    bookings={bookings}
    onRequestSuccess={() => fetchBookings(serviceCenter.id, activeTab)}
  />
)}

      <button onClick={handleAddService}>+ Add Another Service</button>
      <button onClick={handleSubmit} className="submit-request-btn">Send Request</button>
    </div>
  );
}
