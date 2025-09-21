// src/pages/NocFormPage.js
import React, { useEffect, useState } from "react";
import { getToken } from "../api/auth";
import "../styles.css";

const NocFormPage = () => {
  const [nocList, setNocList] = useState([]);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editPurpose, setEditPurpose] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const token = getToken();

  // Fetch NOCs
  const fetchNOCs = async () => {
    try {
      const res = await fetch("http://localhost:5000/noc", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setNocList(data);
      else setNocList([]);
    } catch (err) {
      console.error(err);
      setNocList([]);
    }
  };

  useEffect(() => {
    fetchNOCs();
  }, []);

  // Create NOC
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !department || !purpose) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/noc/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, department, purpose, description, status }),
      });
      const data = await res.json();
      if (data._id) {
        setSuccess("NOC Request created successfully!");
        setTitle("");
        setDepartment("");
        setPurpose("");
        setDescription("");
        setStatus("Pending");
        setNocList([data, ...nocList]);
      } else {
        setError(data.message || "Failed to create NOC");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  // Update & Delete logic (same as before)...

  return (
    <div className="container">
      <h2>Create New NOC Request</h2>
      {error && <p className="error">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="NOC Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        <input type="text" placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit" className="submit-btn">Create NOC</button>
      </form>

      <h2>Your NOC Requests</h2>
      {nocList.length === 0 ? (
        <p>No NOC requests found.</p>
      ) : (
        nocList.map((noc) => (
          <div className="noc-card" key={noc._id}>
            <h3>{noc.title}</h3>
            <p><strong>Department:</strong> {noc.department}</p>
            <p><strong>Purpose:</strong> {noc.purpose}</p>
            <p><strong>Status:</strong> {noc.status}</p>
            <p><strong>Description:</strong> {noc.description || "N/A"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default NocFormPage;
