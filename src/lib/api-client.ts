// Base URL for the API
const API_BASE_URL = "http://localhost:8080";

// Helper for making authenticated requests
const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Not authenticated");
    }

    const headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // If we get a 401, clear the token (it's probably expired)
        if (response.status === 401) {
            localStorage.removeItem("token");
        }

        const errorData = await response.json().catch(() => ({message: "An error occurred"}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
};

// API client for todo lists and items
export const todoApi = {
    // Get all lists
    async getLists() {
        return authenticatedRequest(`${API_BASE_URL}/api/lists`);
    },

    // Get a specific list
    async getList(listId: number) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}`);
    },

    // Create a new list
    async createList(listData: { name: string; description?: string }) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists`, {
            method: "POST",
            body: JSON.stringify(listData),
        });
    },

    // Update a list
    async updateList(listId: number, listData: { name: string; description?: string }) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}`, {
            method: "PUT",
            body: JSON.stringify(listData),
        });
    },

    // Delete a list
    async deleteList(listId: number) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}`, {
            method: "DELETE",
        });
    },

    // Get items from a list
    async getItems(listId: number) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}/items`);
    },

    // Get a specific item
    async getItem(listId: number, itemId: number) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}/items/${itemId}`);
    },

    // Create a new item in a list
    async createItem(listId: number, itemData: {
        title: string;
        description?: string;
        completed?: boolean;
        dueDate?: string;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    }) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}/items`, {
            method: "POST",
            body: JSON.stringify(itemData),
        });
    },

    // Update an item
    async updateItem(listId: number, itemId: number, itemData: {
        title?: string;
        description?: string;
        completed?: boolean;
        dueDate?: string;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    }) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}/items/${itemId}`, {
            method: "PUT",
            body: JSON.stringify(itemData),
        });
    },

    // Delete an item
    async deleteItem(listId: number, itemId: number) {
        return authenticatedRequest(`${API_BASE_URL}/api/lists/${listId}/items/${itemId}`, {
            method: "DELETE",
        });
    },
};

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
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }
            const data = await response.json();
            // Store the token in localStorage
            if (data.accessToken) {
                localStorage.setItem("token", data.accessToken);
            } else {
                throw new Error("No authentication token received");
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
