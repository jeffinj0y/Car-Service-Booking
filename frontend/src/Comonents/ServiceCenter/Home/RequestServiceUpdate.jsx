import { useState } from 'react';

export default function RequestServiceUpdate({ bookings, onRequestSuccess }) {
  const [selectedBooking, setSelectedBooking] = useState('');
  const [requestedServices, setRequestedServices] = useState([
    { subcategory: '', price: '', duration: '' },
  ]);

  const handleAdd = () => {
    setRequestedServices([...requestedServices, { subcategory: '', price: '', duration: '' }]);
  };

  const handleChange = (i, field, value) => {
    const updated = [...requestedServices];
    updated[i][field] = value;
    setRequestedServices(updated);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5002/api/bookings/${selectedBooking}/request-additional-services`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: requestedServices }),
      });

      const data = await res.json();
      alert(data.message);
      onRequestSuccess();
    } catch (err) {
      console.error(err);
      alert('Failed to request services');
    }
  };

  return (
    <div className="request-service-update">
      <h2>Request Additional Services</h2>

      <label>Select Booking:</label>
      <select value={selectedBooking} onChange={(e) => setSelectedBooking(e.target.value)}>
        <option value="">-- Select Booking --</option>
        {bookings.map((b) => (
          <option key={b._id} value={b._id}>
            #{b._id.slice(-6)} - {b.user?.name}
          </option>
        ))}
      </select>

      <h3>Requested Services</h3>
      {requestedServices.map((service, i) => (
        <div key={i} className="service-input">
          <input
            type="text"
            placeholder="Subcategory ID"
            value={service.subcategory}
            onChange={(e) => handleChange(i, 'subcategory', e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={service.price}
            onChange={(e) => handleChange(i, 'price', e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration"
            value={service.duration}
            onChange={(e) => handleChange(i, 'duration', e.target.value)}
          />
        </div>
      ))}

      <button onClick={handleAdd}>+ Add Another</button>
      <button onClick={handleSubmit}>Send Request</button>
    </div>
  );
}
