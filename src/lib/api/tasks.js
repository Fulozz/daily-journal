/**
 * Tasks API Service
 * This module handles all task-related API requests
 */
import axios from "axios"


const API_BASE_URL = "https://daily-journal-backend-fsza.onrender.com/api/v1"


/**
 * Get all tasks for the authenticated user
 *
 * @param {string} token - JWT authentication token
 *
 * @returns {Promise<Array>} - Array of tasks
 * @throws {Error} - If fetching tasks fails
 *
 * @example
 * // Get all tasks
 * const tasks = await getTasks("jwt_token_here");
 */
export const getTasks = async (token, ) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching tasks:", error)

    // If API endpoint not found, return mock data
    if (error.response?.status === 404) {
      return [
        {
          id: "1",
          title: "Complete project documentation",
          description: "Write detailed documentation for the new feature including API endpoints and usage examples.",
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Buy groceries",
          description: "Milk, eggs, bread, fruits, and vegetables for the week.",
          completed: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "3",
          title: "Schedule dentist appointment",
          description: "Call Dr. Smith's office to schedule a check-up.",
          completed: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]
    }

    throw error
  }
}

/**
 * Create a new task
 *
 * @param {string} token - JWT authentication token
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title
 * @param {string} [taskData.description] - Task description (optional)
 *
 * @returns {Promise<Object>} - Created task data
 * @throws {Error} - If creating task fails
 *
 * @example
 * // Create a new task
 * const taskData = {
 *   title: "New Task",
 *   description: "Description of the new task."
 * };
 * const newTask = await createTask("jwt_token_here", taskData);
 */
export const createTask = async (token, taskData,) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating task:", error)

    // If API endpoint not found, return mock data
    if (error.response?.status === 404) {
      return {
        id: Date.now().toString(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      }
    }

    throw error
  }
}

/**
 * Update an existing task
 *
 * @param {string} token - JWT authentication token
 * @param {string} taskId - ID of the task to update
 * @param {Object} taskData - Updated task data
 * @param {string} [taskData.title] - Updated task title
 * @param {string} [taskData.description] - Updated task description
 *
 * @returns {Promise<Object>} - Updated task data
 * @throws {Error} - If updating task fails
 *
 * @example
 * // Update a task
 * const taskData = {
 *   title: "Updated Task Title",
 *   description: "Updated task description."
 * };
 * const updatedTask = await updateTask("jwt_token_here", "task_id", taskData);
 */
export const updateTask = async (token, taskData) => {
 
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/update`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    return response.data
  } catch (error) {
    console.error("Error updating task:", error)

    // If API endpoint not found, return mock data
    if (error.response?.status === 404) {
      return {
        id: taskId,
        ...taskData,
        completed: taskData.completed !== undefined ? taskData.completed : false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    throw error
  }
}

/**
 * Toggle the completion status of a task
 *
 * @param {string} token - JWT authentication token
 * @param {string} taskId - ID of the task to toggle
 * @param {boolean} completed - New completion status
 *
 * @returns {Promise<Object>} - Updated task data
 * @throws {Error} - If toggling task fails
 *
 * @example
 * // Toggle task completion
 * const updatedTask = await toggleTaskCompletion("jwt_token_here", "task_id", true);
 */
export const toggleTaskCompletion = async (token, taskId, completed) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/tasks/${taskId}`,
      { completed },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error("Error toggling task completion:", error)

    // If API endpoint not found, return mock data
    if (error.response?.status === 404) {
      return {
        id: taskId,
        completed,
        updatedAt: new Date().toISOString(),
      }
    }

    throw error
  }
}

/**
 * Delete a task
 *
 * @param {string} token - JWT authentication token
 * @param {string} taskId - ID of the task to delete
 *
 * @returns {Promise<Object>} - Response with confirmation message
 * @throws {Error} - If deleting task fails
 *
 * @example
 * // Delete a task
 * const response = await deleteTask("jwt_token_here", "task_id");
 */
export const deleteTask = async (token, taskId) => {
  console.log(token)
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error("Error deleting task:", error)

    // If API endpoint not found, return mock response
    if (error.response?.status === 404) {
      return { message: "Task deleted successfully" }
    }

    throw error
  }
}

