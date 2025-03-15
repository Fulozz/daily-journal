/**
 * API de Entradas de Diário
 * Funções para gerenciamento de entradas de diário
 */

import axios from "axios"
import { API_BASE_URL, createHeaders, handleApiError } from "./config"

/**
 * Obtém todas as entradas de diário
 * @param {string} token - Token JWT do usuário
 * @returns {Promise<Array>} Lista de entradas
 * @example
 * const entries = await getEntries(token)
 */
export async function getEntries(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/entries`, {
      headers: createHeaders(token),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "getEntries")
  }
}

/**
 * Obtém uma entrada específica
 * @param {string} token - Token JWT do usuário
 * @param {string} entryId - ID da entrada
 * @returns {Promise<Object>} Entrada de diário
 * @example
 * const entry = await getEntry(token, "entry123")
 */
export async function getEntry(token, entryId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/entries/${entryId}`, {
      headers: createHeaders(token),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "getEntry")
  }
}

/**
 * Cria uma nova entrada de diário
 * @param {string} token - Token JWT do usuário
 * @param {Object} entryData - Dados da entrada
 * @param {string} entryData.title - Título da entrada
 * @param {string} entryData.content - Conteúdo da entrada
 * @returns {Promise<Object>} Entrada criada
 * @example
 * const newEntry = await createEntry(token, {
 *   title: "Meu dia",
 *   content: "Hoje foi um dia produtivo..."
 * })
 */
export async function createEntry(token, entryData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/entries`, entryData, { headers: createHeaders(token, true) })
    return response.data
  } catch (error) {
    handleApiError(error, "createEntry")
  }
}

/**
 * Atualiza uma entrada existente
 * @param {string} token - Token JWT do usuário
 * @param {string} entryId - ID da entrada
 * @param {Object} entryData - Novos dados da entrada
 * @returns {Promise<Object>} Entrada atualizada
 * @example
 * const updatedEntry = await updateEntry(token, "entry123", {
 *   title: "Novo título",
 *   content: "Conteúdo atualizado..."
 * })
 */
export async function updateEntry(token, entryId, entryData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/entries/${entryId}`, entryData, {
      headers: createHeaders(token, true),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "updateEntry")
  }
}

/**
 * Exclui uma entrada
 * @param {string} token - Token JWT do usuário
 * @param {string} entryId - ID da entrada
 * @returns {Promise<void>}
 * @example
 * await deleteEntry(token, "entry123")
 */
export async function deleteEntry(token, entryId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/entries/${entryId}`, { headers: createHeaders(token) })
    return response.data
  } catch (error) {
    handleApiError(error, "deleteEntry")
  }
}

