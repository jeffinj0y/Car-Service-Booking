import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Clock, Wrench } from 'lucide-react';
import './Center.css';

const AdminServiceCenters = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingCenters, setPendingCenters] = useState([]);
  const [approvedCenters, setApprovedCenters] = useState([]);
  const [rejectedCenters, setRejectedCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        setLoading(true);

        // Fetch all centers and filter by status
        const response = await axios.get('http://localhost:5002/api/service-centers/Sget');
        const allCenters = response.data;

        setPendingCenters(allCenters.filter(center => center.status === 'pending'));
        setApprovedCenters(allCenters.filter(center => center.status === 'approved'));
        setRejectedCenters(allCenters.filter(center => center.status === 'rejected'));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServiceCenters();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Or 'adminToken' if that's the key you used

      await axios.patch(
        `http://localhost:5002/api/admin/service-centers/approve/${id}`,
        {}, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const centerToApprove = pendingCenters.find(center => center._id === id);
      setPendingCenters(pendingCenters.filter(center => center._id !== id));
      setApprovedCenters([...approvedCenters, { ...centerToApprove, status: 'approved' }]);
    } catch (err) {
      console.error("Approve error:", err.response?.data || err.message);
      setError('Failed to approve service center');
    }
  };


  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5002/api/admin/service-centers/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const centerToReject = pendingCenters.find(center => center._id === id);
      setPendingCenters(pendingCenters.filter(center => center._id !== id));
      setRejectedCenters([...rejectedCenters, { ...centerToReject, status: 'rejected' }]);
    } catch (err) {
      setError('Failed to reject service center');
    }
  };

  const renderTabContent = () => {
    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const centersToDisplay =
      activeTab === 'pending' ? pendingCenters :
        activeTab === 'approved' ? approvedCenters :
          rejectedCenters;

    return (
      <div className="table-responsive">
        <table className="service-center-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Services</th>
              <th>Status</th>
              {activeTab === 'pending' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {centersToDisplay.map((center) => (
              <tr key={center._id}>
                <td>{center.name}</td>
                <td>{center.email}</td>
                <td>{center.phone}</td>
                <td> {typeof center.address === 'string'
                  ? center.address
                  : `${center.address?.street || ''}, ${center.address?.city || ''},  ${center.address?.district || ''}, ${center.address?.state || ''} ${center.address?.zipCode || ''}`
                }</td>
                {center.services.map(service =>
                  typeof service === 'string' ? service : service.subcategoryName
                ).join(', ')}
                <td>
                  <span className={`status-badge ${activeTab}`}>
                    {activeTab === 'pending' && <Clock size={16} />}
                    {activeTab === 'approved' && <CheckCircle size={16} />}
                    {activeTab === 'rejected' && <XCircle size={16} />}
                    {activeTab}
                  </span>
                </td>
                {activeTab === 'pending' && (
                  <td className="actions-cell">
                    <button
                      onClick={() => handleApprove(center._id)}
                      className="approve-btn"
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(center._id)}
                      className="reject-btn"
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="service-center-management">
      <h2 className="page-title">
        <Wrench size={24} className="icon" />
        Service Center Management
      </h2>

      <div className="tab-header">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={18} className="icon" />
          Pending ({pendingCenters.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          <CheckCircle size={18} className="icon" />
          Approved ({approvedCenters.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          <XCircle size={18} className="icon" />
          Rejected ({rejectedCenters.length})
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default AdminServiceCenters;