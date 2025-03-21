/**
 * API Service
 * This module exports all API functions from the different service modules
 */

// Authentication API
export {
    registerUser,
    loginUser,
    validateToken,
    getAuthToken,
    getUserFromCookie,
    removeCookie,
  } from "./auth"
  
  // User API
  export {
    updateUser,
    updatePassword,
    getUser,
  } from "./user"
  
  // Entries API
  export {
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry,
  } from "./entries"
  
  // Tasks API
  export {
    getTasks,
    createTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
  } from "./tasks"
  
  