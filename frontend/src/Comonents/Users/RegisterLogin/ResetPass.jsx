import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
import './Reset.css'

function ResetPassword() {
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const {id, token} = useParams()

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:5002/api/users/reset-password/${id}/${token}`, {password})
        .then(res => {
            if(res.data.Status === "Success") {
                navigate('/in')
               
            }
        }).catch(err => console.log(err))
    }
    return(
                <div className="reset-password-container">
            <div className="reset-password-form">
                <h2 className="reset-password-title">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="reset-password-input-group">
                        <label htmlFor="password" className="reset-password-label">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            autoComplete="off"
                            id="password"
                            name="password"
                            className="reset-password-input"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="reset-password-btn">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword;