// Base URL for the API
const API_BASE_URL = "http://localhost:8080";

// API client for authentication
export const authApi = {
  // Login function
  async login(username: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Signup function
  async signup(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem("token");
  },

  // Get the authentication token
  getToken() {
    return localStorage.getItem("token");
  },

  // Logout function
  logout() {
    localStorage.removeItem("token");
  },
};
