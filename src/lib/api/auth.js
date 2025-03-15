/**
 * API de Autenticação
 * Funções para login, registro, validação de token e gerenciamento de sessão
 */

import axios from "axios"
import { API_BASE_URL, createHeaders, handleApiError } from "./config"

/**
 * Realiza login do usuário
 * @param {Object} credentials - Credenciais do usuário
 * @param {string} credentials.email - Email do usuário
 * @param {string} credentials.password - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário e token
 * @example
 * const { token, user } = await login({ email: "user@example.com", password: "password123" })
 */
export async function login(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials)
    return response.data
  } catch (error) {
    handleApiError(error, "login")
  }
}

/**
 * Registra um novo usuário
 * @param {Object} userData - Dados do novo usuário
 * @param {string} userData.name - Nome do usuário
 * @param {string} userData.email - Email do usuário
 * @param {string} userData.password - Senha do usuário
 * @returns {Promise<Object>} Dados do usuário registrado
 * @example
 * const user = await register({ name: "John Doe", email: "john@example.com", password: "password123" })
 */
export async function register(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData)
    return response.data
  } catch (error) {
    handleApiError(error, "register")
  }
}

/**
 * Valida um token JWT
 * @param {string} token - Token JWT a ser validado
 * @returns {Promise<boolean>} True se o token for válido
 * @example
 * const isValid = await validateToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
 */
export async function validateToken(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/validate-token`, {
      headers: createHeaders(token),
    })
    return response.status === 200
  } catch (error) {
    handleApiError(error, "validateToken")
    return false
  }
}

/**
 * Atualiza a senha do usuário
 * @param {string} token - Token JWT do usuário
 * @param {Object} passwordData - Dados da senha
 * @param {string} passwordData.currentPassword - Senha atual
 * @param {string} passwordData.newPassword - Nova senha
 * @returns {Promise<Object>} Resultado da operação
 * @example
 * const result = await updatePassword(token, { currentPassword: "old123", newPassword: "new456" })
 */
export async function updatePassword(token, passwordData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/password`, passwordData, {
      headers: createHeaders(token, true),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "updatePassword")
  }
}

