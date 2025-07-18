import  { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [showProfile, setShowProfile] = useState(false);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const isLoggedIn = !!localStorage.getItem('token');
  const [login, setLogin]= useState(false);
  const nav=useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    window.location.href = '/';
  }
const services = [
    { name: "Oil Change", description: "Keep your engine running smoothly.", category: "Mechanical Services" },
    { name: "Engine Check", description: "Complete diagnostics for better performance.", category: "Mechanical Services" },
    { name: "Wheel Alignment", description: "Ensure safe and smooth driving.", category: "Mechanical Services" },
    { name: "Car Washing", description: "Keep Your Car Clean.", category: "Cleaning Services" },
    { name: "AC Services", description: "For Better Cooling.", category: "Electrical Services" },
    { name: "Interior Deep Cleaning", description: "Beautiful Interior.", category: "Cleaning Services" },
    { name: "Brake Check", description: "Ensure safe and smooth driving.", category: "Mechanical Services" },
    { name: "Axle Services", description: "Ensure safe and smooth driving.", category: "Mechanical Services" },
    { name: "Body Wash Services", description: "Keep Your Car Clean.", category: "Cleaning Services" }
  ];
   const handleServiceClick = (category) => {
    if (!isLoggedIn) {
      setLogin(true);
      return;
    }
    nav('/selectcenter', { 
      state: { 
        filterByService: category 
      } 
    });
  };
    const closeLoginPrompt = () => {
    setLogin(false);
  };

  const goToLogin = () => {
    nav('/in');
  };
  const handleBookClick = () => {
    if (!isLoggedIn) {
      setLogin(true);
      return;
    }
    nav('/selectcenter');
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>FixMyRide</h1>
        <nav>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            {!isLoggedIn ? (
              <li><a href="/in">Login</a></li>
            ) : (
              <li className="user-profile-menu" style={{ position: 'relative' }}>
                <span
                  className="user-profile-name"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowProfile((v) => !v)}
                >
                  {user?.name || 'User'} &#x25BC;
                </span>
                {showProfile && (
                  <div className="profile-dropdown" style={{ position: 'absolute', right: 0, background: '#3498db', border: '1px solid #ccc', zIndex: 10, minWidth: 160 }}>
                    <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                      <strong>{user?.name || 'User'}</strong>
                    </div>
                    <div style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => window.location.href = '/bookinghistory'}>
                      Booking History
                    </div>
                    <div style={{ padding: '10px', cursor: 'pointer', color: 'red' }} onClick={handleLogout}>
                      Logout
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h2>Your Car's Best Friend</h2>
        <p>Book trusted car service centers at your fingertips.</p>
  <a 
        className="book-btn" 
        onClick={handleBookClick}
        style={{ cursor: 'pointer' }}
      >
        Book a Service
      </a>

      {login && (
        <div className="login-modal">
          <div className="login-prompt">
            <h4>Please Login</h4>
            <p>You need to login to book our services.</p>
            <div className="prompt-buttons">
              <button onClick={goToLogin} className="login-btn">Login Now</button>
              <button onClick={closeLoginPrompt} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}      </section>

      <section id="services" className="services">
      <h3>Our Services</h3>
       {login && (
        <div className="login-modal">
          <div className="login-prompt">
            <h4>Please Login</h4>
            <p>You need to login to view and purchase our services.</p>
            <div className="prompt-buttons">
              <button onClick={goToLogin} className="login-btn">Login Now</button>
              <button onClick={closeLoginPrompt} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="service-grid">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="service-card"
            onClick={() => handleServiceClick(service.category)}
          >
            <h4>{service.name}</h4>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>

      <section id="about" className="about">
        <h3>Why Choose Us?</h3>
        <p>We connect you to certified service centers with reliable and fast service.</p>
      </section>


      <section id="contact" className="contact">
        <h3>Get In Touch</h3>
        <p>Email: support@fixmyride.com | Phone: +91 9744788726</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 FixMyRide. All rights reserved.</p>
      </footer>
    </div>
  );
}
