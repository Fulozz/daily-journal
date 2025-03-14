/**
 * Authentication API Service (Client-side)
 * This module handles all client-side authentication-related API requests
 */
import axios from "axios"
import { getCookie } from "cookies-next"
import { deleteCookie } from "cookies-next"

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`

/**
 * Register a new user
 *
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 *
 * @returns {Promise<Object>} - Response with registration confirmation
 * @throws {Error} - If registration fails
 *
 * @example
 * // Register a new user
 * const userData = {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "securepassword"
 * };
 * const response = await registerUser(userData);
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData)
    return response.data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

/**
 * Login a user
 *
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 *
 * @returns {Promise<Object>} - Response with token and user data
 * @throws {Error} - If login fails
 *
 * @example
 * // Login a user
 * const credentials = {
 *   email: "john@example.com",
 *   password: "securepassword"
 * };
 * const { token, user } = await loginUser(credentials);
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials)
    return response.data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

/**
 * Validate a user's authentication token
 *
 * @param {string} token - JWT authentication token
 *
 * @returns {Promise<boolean>} - True if token is valid
 * @throws {Error} - If validation fails
 *
 * @example
 * // Validate a token
 * const isValid = await validateToken("jwt_token_here");
 */
export const validateToken = async (token) => {
  if (!token) return false

  try {
    const response = await axios.post(
      `${API_BASE_URL}/validate-token`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.status === 200
  } catch (error) {
    console.error("Token validation error:", error)
    return false
  }
}
/**
 * Get auth token from cookies (client-side)
 *
 * @returns {string|null} - The authentication token or null if not found
 *
 * @example
 * // Get auth token client-side
 * const token = getAuthToken();
 */
export function getAuthToken() {
  return getCookie("token")
}

/**
 * Remove a cookie by name (client-side)
 *
 * @param {string} cookieName - The name of the cookie to remove
 *
 * @example
 * // Remove a cookie
 * removeCookie("token");
 */
export function removeCookie(cookieName) {
  deleteCookie(cookieName)
}

/**
 * Get user data from cookies (client-side)
 *
 * @returns {Object|null} - The user data or null if not found
 *
 * @example
 * // Get user data client-side
 * const user = getUserFromCookie();
 */
export function getUserFromCookie() {
  const userCookie = getCookie("user")
  if (!userCookie) return null

  try {
    return JSON.parse(userCookie)
  } catch (e) {
    console.error("Error parsing user cookie:", e)
    return null
  }
}

