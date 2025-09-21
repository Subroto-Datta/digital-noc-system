import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../api/auth";
import "../styles.css"; // keep your main styles

const Dashboard = () => {
  return (
    <>
      <nav className="navbar">
        <h2>NOC Portal</h2>
        <button
          className="logout-btn"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </nav>

      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Select an option:</p>

        <div className="card-grid">
          {/* NOC Form Card */}
          <div className="dashboard-card">
            <h3>NOC Form</h3>
            <p>Submit a new NOC request or view existing ones.</p>
            <Link to="/noc-form" className="card-btn">
              Go to NOC Form
            </Link>
          </div>

          {/* Placeholder for other features */}
          <div className="dashboard-card">
            <h3>Other Features</h3>
            <p>New modules will appear here soon.</p>
            <button className="card-btn disabled" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;







