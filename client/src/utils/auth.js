// Import the jwt-decode library for decoding JWT tokens
import decode from 'jwt-decode';

// AuthService class responsible for handling user authentication and token management
class AuthService {
  // Method to decode the JWT token and return the user profile information
  getProfile() {
    return decode(this.getToken());
  }

  // Method to check if a user is logged in based on the presence and validity of the JWT token
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Method to check if a given JWT token is expired
  isTokenExpired(token) {
    try {
      // Decode the token to obtain expiration time and compare with the current time
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // If an error occurs during token decoding, consider the token as expired and return true
      return true;
    }
  }

  // Method to retrieve the JWT token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Method to save the JWT token to localStorage and redirect the user to the home page
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Method to remove the JWT token from localStorage and redirect the user to the home page
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

// Export an instance of the AuthService class
export default new AuthService();
