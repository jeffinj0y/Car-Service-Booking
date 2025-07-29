import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ServiceCenterLogin.css';

const ServiceCenterLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5002/api/service-centers/login',
        formData
      );

      // Store center data and redirect
      localStorage.setItem('centertoken', response.data.centertoken);
      localStorage.setItem('serviceCenter', JSON.stringify(response.data.serviceCenter));
      navigate('/serviceCentreHome');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-login-container">
      <div className="sc-login-box">
        <h2>Service Center Login</h2>
        {error && <div className="sc-error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="sc-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sc-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="sc-login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="sc-login-footer">
          <p>Don't have an account? <a href="/regserviceCentre">Register here</a></p>
          <p><a href="/forgot-password">Forgot password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterLogin;