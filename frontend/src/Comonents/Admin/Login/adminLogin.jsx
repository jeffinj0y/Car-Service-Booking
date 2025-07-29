import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

export default function Adminin() {
  const [adminemail, setEmail] = useState("");
  const [adminpass, setPass] = useState("");
  // const [adminList, setAdminList] = useState([]);
  const [error,setError]=useState("")
  const nav = useNavigate();

  async function adminhandleLogin(e) {
  e.preventDefault();
  try {
    if (!adminemail || !adminpass) {
      setError("Email and password are required");
      return;
    }

    const response = await axios.post(
      "http://localhost:5002/api/admin/adminLogin",
      { adminemail, adminpassword: adminpass } 
    );
    
    if (response.data.success) {
      localStorage.setItem("admintoken", response.data.admintoken);
      localStorage.setItem("email", adminemail);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));
      nav("/adminhome");
    } else {
      setError(response.data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("Login failed. Please try again.");
    }
  }
}
            

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Login</h1>
        <input
          type="text"
          placeholder="Enter Email"
          value={adminemail}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={adminpass}
          onChange={(e) => setPass(e.target.value)}
        />
        {error && <p className="us-error-message">{error}</p>}

        <button onClick={adminhandleLogin}>Login</button>
      </div>
    </div>
  );
}
