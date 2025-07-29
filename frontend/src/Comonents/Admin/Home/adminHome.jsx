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
      const res = await axios.get("http://localhost:5002/api/service-centers/count");
      setServiceCenterCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch service center count", err);
    }
  };

  const handleLogout = () => {
    console.log('Admin logged out');
    nav("/");
  };

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