import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

 async function handleLogin(e){
        e.preventDefault()
        console.log("handleLogin");
        try {
            const res=await axios.post("http://localhost:5002/api/users/login",{email,password})
            console.log(res.data);
               if (res.data.success) {
  localStorage.setItem("token", res.data.authtoken);
  localStorage.setItem("email", email);
  localStorage.setItem("user", JSON.stringify(res.data.user));
  nav("/");
}
        } catch (error) {
  console.log(error);
  if (error.response) {
    setError(error.response.data);
  } else {
    setError("Login failed. Try again.");
  }
}
 }
  return (
    <div className="us-login-page">
      <div className="us-login-container">
        <div className="us-login-card">
          <h1 className="us-login-title">FixMyRide</h1>
          <h2 className="us-login-subtitle">Login</h2>
          
          <form className="us-login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {error && <p className="us-error-message">{error}</p>}
            
            <button type="submit" className="us-login-btn">
              Login
            </button>
          </form>
          
          <p className="us-login-footer">
            Don't have an account?{" "}
            <span className="us-login-link" onClick={() => nav("/up")}>
              Register here
            </span>
          </p>
           <p className="us-login-footer">
            forgot password{" "}
            <span className="us-login-link" onClick={() => nav("/forgotpass")}>
              Click here
            </span>
            </p>
        </div>
      </div>
    </div>
  );
}