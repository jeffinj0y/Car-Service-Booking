import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrderList.css'; // Assuming you have some styles for the component
const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token'); // Update token key if needed
      const response = await axios.get('http://localhost:5002/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data.bookings || []);
      setFilteredBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleFilter = () => {
    if (!fromDate || !toDate) return;

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999); // Include entire "to" day

    const filtered = bookings.filter((booking) => {
      const bookingDate = new Date(booking.scheduledDate);
      return bookingDate >= from && bookingDate <= to;
    });

    setFilteredBookings(filtered);
  };

  return (
    <div className="admin-bookings p-4">
      <h2 className="text-xl font-semibold mb-4">All Bookings</h2>

      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-1">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-5"
        >
          Filter
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">Service Center</th>
              <th className="border px-4 py-2">Services</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="border px-4 py-2">{booking.user?.name || 'N/A'}</td>
                  <td className="border px-4 py-2">{booking.serviceCenter?.name || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    <ul>
                      {booking.services.map((s, idx) => (
                        <li key={idx}>
                          {s.category?.name} - {s.subcategory?.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-2 capitalize">{booking.status}</td>
                  <td className="border px-4 py-2">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
