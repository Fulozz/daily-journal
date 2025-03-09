import { getCookie } from "cookies-next"
import axios from "axios"

export async function validateToken(token) {
  if (!token) return false

  try {
    const response = await axios.get("https://portfolio-backend-zpig.onrender.com/api/v1/validate-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.status === 200
  } catch (error) {
    console.error("Token validation error:", error)
    return false
  }
}

export function getAuthToken() {
  return getCookie("token")
}

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

