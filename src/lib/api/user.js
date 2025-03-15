/**
 * API de Usuários
 * Funções para gerenciamento de usuários, perfis e busca
 */

import axios from "axios"
import { API_BASE_URL, createHeaders, handleApiError } from "./config"

/**
 * Obtém os dados do usuário atual
 * @param {string} token - Token JWT do usuário
 * @returns {Promise<Object>} Dados do usuário
 * @example
 * const user = await getUser(token)
 * console.log(user.name) // "John Doe"
 */
export async function getUser(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: createHeaders(token),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "getUser")
  }
}

/**
 * Atualiza os dados do usuário
 * @param {string} token - Token JWT do usuário
 * @param {Object} userData - Novos dados do usuário
 * @param {string} [userData.name] - Nome do usuário
 * @param {string} [userData.email] - Email do usuário
 * @param {string} [userData.avatar] - URL do avatar
 * @returns {Promise<Object>} Dados atualizados do usuário
 * @example
 * const updatedUser = await updateUser(token, { name: "John Smith" })
 */
export async function updateUser(token, userData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/user`, userData, { headers: createHeaders(token, true) })
    return response.data
  } catch (error) {
    handleApiError(error, "updateUser")
  }
}

/**
 * Busca usuários por nome ou email
 * @param {string} token - Token JWT do usuário
 * @param {string} query - Termo de busca (nome ou email)
 * @returns {Promise<Array>} Lista de usuários encontrados
 * @example
 * const users = await searchUsers(token, "john")
 * // Retorna todos os usuários com "john" no nome ou email
 */
export async function searchUsers(token, query) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/search`, {
      params: { query },
      headers: createHeaders(token),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "searchUsers")
    // Mock data para desenvolvimento
    return [
      { _id: "1", name: "John Doe", email: "john@example.com" },
      { _id: "2", name: "Jane Smith", email: "jane@example.com" },
      { _id: "3", name: "Bob Johnson", email: "bob@example.com" },
      { _id: "4", name: "Alice Williams", email: "alice@example.com" },
      { _id: "5", name: "Carlos Rodriguez", email: "carlos@example.com" },
    ].filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase()),
    )
  }
}

