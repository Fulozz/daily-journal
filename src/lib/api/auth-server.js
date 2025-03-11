/**
 * Authentication API Service (Server-side)
 * This module handles all server-side authentication-related API requests
 */
import axios from "axios"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const API_BASE_URL = "https://daily-journal-backend-fsza.onrender.com/api/v1"

/**
 * Get auth token from cookies (server-side)
 *
 * @returns {Promise<string|null>} - The authentication token or null if not found
 *
 * @example
 * // Get auth token server-side
 * const token = await getAuthTokenServer();
 */
export async function getAuthTokenServer() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  return token?.value || null
}

/**
 * Get user data from cookies (server-side)
 *
 * @returns {Promise<Object|null>} - The user data or null if not found
 *
 * @example
 * // Get user data server-side
 * const user = await getUserServer();
 */
export async function getUserServer() {
  const cookieStore = cookies()
  const userCookie = cookieStore.get("user")

  if (!userCookie?.value) return null

  try {
    return JSON.parse(userCookie.value)
  } catch (e) {
    console.error("Error parsing user cookie:", e)
    return null
  }
}

/**
 * Check if user is authenticated (server-side)
 *
 * @returns {Promise<boolean>} - True if user is authenticated
 *
 * @example
 * // Check if user is authenticated server-side
 * const isAuthenticated = await isAuthenticatedServer();
 */
export async function isAuthenticatedServer() {
  const token = await getAuthTokenServer()
  return token
}

/**
 * Validate a user's authentication token (server-side)
 *
 * @param {string} token - JWT authentication token
 *
 * @returns {Promise<boolean>} - True if token is valid
 *
 * @example
 * // Validate a token server-side
 * const isValid = await validateTokenServer("jwt_token_here");
 */
export async function validateTokenServer(token) {
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
    if(response.status === 404 || response.status === 401) {
      const cookieStore = cookies()
      cookieStore.delete("token")
      return redirect("/login")
      
    }

    return response.status === 200
  } catch (error) {
    console.error("Token validation error:", error)
    return false
  }
}

