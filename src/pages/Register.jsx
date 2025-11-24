import React, { useState } from "react";
import API from "../api/axios.js";
import { useNavigate } from "react-router-dom"; // 👈 ADD THIS

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // 👈 ADD THIS

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/register", form);
      setMessage(res.data.message || "Registered successfully!");

      alert("🎉 Registration successful! Please login now.");

      setForm({ name: "", email: "", password: "" });
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>
      </form>
      {message && <p className="mt-3 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
