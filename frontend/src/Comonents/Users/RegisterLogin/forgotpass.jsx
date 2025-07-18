import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5002/api/users/forgot-password', { email })
            .then(res => {
                if (res.data.success) {
                    navigate('/in');
                } else {
                    console.error(res.data.error);
                }
                console.log("Forgot Password", res.data);
            })
            .catch(err => console.error(err));
            
    };

    return (
       <div className="forgot-password-container">
                <div className="forgot-password-form">
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="email" style={{ fontWeight: 'bold' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                autoComplete="off"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit">
                            Submit
                        </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;