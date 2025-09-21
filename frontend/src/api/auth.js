const BASE_URL = "http://localhost:5000/auth";

// Signup API
export const signup = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (error) {
    console.error("Signup Error:", error);
  }
};

// Login API
export const login = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token); // store JWT
    }
    return data;
  } catch (error) {
    console.error("Login Error:", error);
  }
};

// Optional helper functions for token handling
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const logout = () => localStorage.removeItem("token");
