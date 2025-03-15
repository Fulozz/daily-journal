/**
 * API de Notificações
 * Funções para gerenciamento de notificações
 */

import axios from "axios"
import { API_BASE_URL, createHeaders, handleApiError } from "./config"

/**
 * Obtém todas as notificações do usuário
 * @param {string} token - Token JWT do usuário
 * @returns {Promise<Array>} Lista de notificações
 * @example
 * const notifications = await getNotifications(token)
 */
export async function getNotifications(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: createHeaders(token),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "getNotifications")
  }
}

/**
 * Marca uma notificação como lida
 * @param {string} token - Token JWT do usuário
 * @param {string} notificationId - ID da notificação
 * @returns {Promise<Object>} Notificação atualizada
 * @example
 * const notification = await markNotificationAsRead(token, "notif123")
 */
export async function markNotificationAsRead(token, notificationId) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {},
      { headers: createHeaders(token, true) },
    )
    return response.data
  } catch (error) {
    handleApiError(error, "markNotificationAsRead")
  }
}

/**
 * Marca todas as notificações como lidas
 * @param {string} token - Token JWT do usuário
 * @returns {Promise<void>}
 * @example
 * await markAllNotificationsAsRead(token)
 */
export async function markAllNotificationsAsRead(token) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/notifications/read-all`,
      {},
      { headers: createHeaders(token, true) },
    )
    return response.data
  } catch (error) {
    handleApiError(error, "markAllNotificationsAsRead")
  }
}

