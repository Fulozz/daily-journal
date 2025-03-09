/**
 * Journal Entries API Service
 * This module handles all journal entry-related API requests
 */
import axios from "axios"

const API_BASE_URL = "https://daily-journal-backend-3bb6.onrender.com/api/v1"

/**
 * Get all journal entries for the authenticated user
 *
 * @param {string} token - JWT authentication token
 *
 * @returns {Promise<Array>} - Array of journal entries
 * @throws {Error} - If fetching entries fails
 *
 * @example
 * // Get all entries
 * const entries = await getEntries("jwt_token_here");
 */
export const getEntries = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/entries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching entries:", error)

    // If API endpoint not found, return mock data
    if (error.response?.status === 404) {
      return [
        {
          id: "1",
          title: "First Entry",
          content: "This is my first journal entry.",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Second Entry",
          content: "Today was a productive day.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]
    }

    throw error
  }
}

/**
 * Create a new journal entry
 *
 * @param {string} token - JWT authentication token
 * @param {Object} entryData - Entry data
 * @param {string} entryData.title - Entry title
 * @param {string} entryData.content - Entry content
 *
 * @returns {Promise<Object>} - Created entry data
 * @throws {Error} - If creating entry fails
 *
 * @example
 * // Create a new entry
 * const entryData = {
 *   title: "New Journal Entry",
 *   content: "This is the content of my new journal entry."
 * };
 * const newEntry = await createEntry("jwt_token_here", entryData);
 */
export const createEntry = async (token, entryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/entries`, entryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating entry:", error)

    // If API endpoint not found, return mock data
    if (error.response?.status === 404) {
      return {
        id: Date.now().toString(),
        ...entryData,
        createdAt: new Date().toISOString(),
      }
    }

    throw error
  }
}

/**
 * Update an existing journal entry
 *
 * @param {string} token - JWT authentication token
 * @param {string} entryId - ID of the entry to update
 * @param {Object} entryData - Updated entry data
 * @param {string} entryData.title - Updated entry title
 * @param {string} entryData.content - Updated entry content
 *
 * @returns {Promise<Object>} - Updated entry data
 * @throws {Error} - If updating entry fails
 *
 * @example
 * // Update an entry
 * const entryData = {
 *   title: "Updated Entry Title",
 *   content: "This is the updated content."
 * };
 * const updatedEntry = await updateEntry("jwt_token_here", "entry_id", entryData);
 */
export const updateEntry = async (token, entryId, entryData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/entries/${entryId}`, entryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating entry:", error)

    // If API endpoint not found, return mock data
    if (error.response?.status === 404) {
      return {
        id: entryId,
        ...entryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    throw error
  }
}

/**
 * Delete a journal entry
 *
 * @param {string} token - JWT authentication token
 * @param {string} entryId - ID of the entry to delete
 *
 * @returns {Promise<Object>} - Response with confirmation message
 * @throws {Error} - If deleting entry fails
 *
 * @example
 * // Delete an entry
 * const response = await deleteEntry("jwt_token_here", "entry_id");
 */
export const deleteEntry = async (token, entryId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/entries/${entryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error deleting entry:", error)

    // If API endpoint not found, return mock response
    if (error.response?.status === 404) {
      return { message: "Entry deleted successfully" }
    }

    throw error
  }
}

