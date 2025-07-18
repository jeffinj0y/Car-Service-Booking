import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import {
  Users,
  Wrench,
  Plus,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  // CheckCircle,
  // XCircle
} from "lucide-react";
import "./adhome.css";
import UserTable from '../Userlist/userlist';
import AdminServiceCenters from '../ServieCenterList/CenterList';
import AdminAddService from '../AddServices/AdminAddService';
import AdminBookings from '../BookingList/OrderList';

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState('dashboard');
  // const [recentBookings, setRecentBookings] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [serviceCenterCount, setServiceCenterCount] = useState(0);
  const nav = useNavigate()
  useEffect(() => {
    fetchUserCount();
    fetchCenterCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/users/Ucount");
      setUserCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch user count", err);
    }
  };
  

  const fetchCenterCount = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/service-centers/Scount");
      setServiceCenterCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch service center count", err);
    }
  };

  const handleLogout = () => {
    console.log('Admin logged out');
    nav("/");
  };

  // const handleStatusChange = (id, newStatus) => {
  //   setRecentBookings(bookings => 
  //     bookings.map(booking => 
  //       booking.id === id ? { ...booking, status: newStatus } : booking
  //     )
  //   );
  // };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>CarService Admin</h2>
        <NavItem
          label="Dashboard"
          icon={<LayoutDashboard size={18} />}
          active={activeTab === '/adminhome'}
          onClick={() => setActiveTab('dashboard')}
        />
        <NavItem
          label="users"
          icon={<Users size={18} />}
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        />
        <NavItem
          label="Service Centers"
          icon={<Wrench size={18} />}
          active={activeTab === 'Service Centers'}
          onClick={() => setActiveTab('Service Centers')}
        />
        <NavItem
          label="Bookings"
          icon={<CalendarCheck size={18} />}
          active={activeTab === 'bookings'}
          onClick={() => setActiveTab('bookings')}
        />
        <NavItem
          label="Add Services"
          icon={<Plus size={18} />}
          active={activeTab === 'Add Services'}
          onClick={() => setActiveTab('Add Services')}
        />
        <div className="mt-auto pt-12">
          <NavItem
            label="Logout"
            icon={<LogOut size={18} />}
            onClick={handleLogout}
          />
        </div>
      </div>

      <div className="admin-main">
        {activeTab === 'users' ? (
          <div className="user-list-view">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
          < UserTable />
          </div>
        // showUserList ? (
          // <div className="user-list-view">
            // 
            // <UserTable />
          // </div>
        ) : activeTab === 'Service Centers' ? (
          < AdminServiceCenters />
        ) : activeTab === 'Add Services' ? (
          <AdminAddService />
        ) :activeTab === 'bookings' ? (
          <AdminBookings />
        ) :(
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="admin-card-grid">
              <StatCard label="Total Users" value={userCount} icon={<Users />} />
              <StatCard label="Service Centers" value={serviceCenterCount} icon={<Wrench />} />
              <StatCard label="Active Bookings" icon={<CalendarCheck />} />
            </div>

            {/* <div className="admin-data-table">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
            <button className="text-sm text-purple-600 hover:underline">View All</button>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Service Center</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.customer}</td>
                  <td>{booking.service}</td>
                  <td>{booking.center}</td>
                  <td>{booking.date}</td>
                  <td>
                    <span className={`status-${booking.status}`}>
                      {booking.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      {booking.status !== 'completed' && (
                        <button 
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          className="text-green-500 hover:text-green-700"
                          title="Mark as completed"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="text-red-500 hover:text-red-700"
                          title="Cancel booking"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {

  return (
    <div className="admin-stat-card">
      <h3>{value}</h3>
      <p>{label}</p>
      <div className="mt-2">{icon}</div>
    </div>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button
      className={`admin-nav-item ${active ? 'bg-purple-100 text-purple-700' : ''}`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}