import React, { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup({ name, email, password, role });
      if (res.message === "User registered successfully!") {
        navigate("/login", { replace: true });
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2> 
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="submit-btn">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
