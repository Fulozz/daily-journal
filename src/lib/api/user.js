/**
 * User API Service
 * This module handles all user-related API requests
 */
import axios from "axios"

const API_BASE_URL = "https://portfolio-backend-zpig.onrender.com/api/v1"

/**
 * Update user profile information
 *
 * @param {string} token - JWT authentication token
 * @param {Object} userData - User data to update
 * @param {string} userData.name - User's updated name
 * @param {string} userData.email - User's updated email
 *
 * @returns {Promise<Object>} - Updated user data
 * @throws {Error} - If update fails
 *
 * @example
 * // Update user profile
 * const userData = {
 *   name: "John Updated",
 *   email: "john.updated@example.com"
 * };
 * const updatedUser = await updateUser("jwt_token_here", userData);
 */
export const updateUser = async (token, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Update user error:", error)
    throw error
  }
}

/**
 * Update user password
 *
 * @param {string} token - JWT authentication token
 * @param {Object} passwordData - Password data
 * @param {string} passwordData.currentPassword - User's current password
 * @param {string} passwordData.newPassword - User's new password
 *
 * @returns {Promise<Object>} - Response with confirmation message
 * @throws {Error} - If password update fails
 *
 * @example
 * // Update user password
 * const passwordData = {
 *   currentPassword: "oldpassword",
 *   newPassword: "newpassword"
 * };
 * const response = await updatePassword("jwt_token_here", passwordData);
 */
export const updatePassword = async (token, passwordData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/password`, passwordData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Update password error:", error)
    throw error
  }
}

