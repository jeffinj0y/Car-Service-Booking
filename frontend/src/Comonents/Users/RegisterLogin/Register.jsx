import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Register.css"; 

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmpass] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [Phno, setPhno] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");

  function validatePassword() {
        if (pass.length >= 6) {
            return true
        }else {
      return false;
    }
    }

    function validateEmail() {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regex.test(email)) {
            return true
        } else {
            return false
        }
    }
    function validatePasswordMatch() {
    if (pass !== confirmPass) {
      setConfirmPassError("Passwords do not match");
      return false;
    }
    setConfirmPassError("");
    return true;
  }
    async function handleReg() {
        if (!validateEmail()) {
            return setEmailError("⚠️ Enter a valid Email Id!")
        }

        if (!validatePassword()) {
            return setPasswordError("⚠️ Password should have atleast 6 characters")
        }
        if (!validatePasswordMatch()){
           return setConfirmPassError("⚠️ Password doesnt match")
        }

        try {
            const response = await axios.post(
                "http://localhost:5002/api/users/addUser",
                {
                    name: name,
                    email: email,
                    password: pass,
                    phoneno: Phno
                }
            );
            setMessage('✅ Registration successful! You can now log in.');
            console.log(response.data);

            setTimeout(() => {
      nav("/in");
    }, 1000);

        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Email already exists!")
            }
            console.log(error);
        }
    }

  return (
   <div className="register-container">
    <div className="container">
      <div className="card">
        <h1>FixMyRide</h1>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="error">{emailError}</p>}
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {passwordError && <p className="error">{passwordError}</p>}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPass}
          onChange={(e) => setConfirmpass(e.target.value)}
        />
        {confirmPassError && <p className="error">{confirmPassError}</p>}
        <input
          type="text"
          placeholder="Phone Number"
          value={Phno}
          onChange={(e) => setPhno(e.target.value)}
        />
        <button className="btn-primary" onClick={handleReg}>
          Register
        </button>
        {message && <p className="success">{message}</p>}
        <p style={{color: "black"}}>
          Already have an account?{" "}
          <span className="link" onClick={() => nav("/in")}>
            Login here
          </span>
        </p>
      </div>
    </div>
    </div>
  );
}