const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";
const ROLE_KEY = "user_role";

export const authService = {
  // Save auth data
  setAuthData(token, user, role) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROLE_KEY, role);
  },

  // Get token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get user data
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Get user role
  getRole() {
    return localStorage.getItem(ROLE_KEY);
  },

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Check if student
  isStudent() {
    return this.getRole() === "student";
  },

  // Check if admin
  isAdmin() {
    return this.getRole() === "admin";
  },

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
  },

  // Logout
  logout() {
    this.clearAuthData();
    window.location.href = "/login";
  },
};

export default authService;
