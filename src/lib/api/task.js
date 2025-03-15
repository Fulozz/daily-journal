/**
 * API de Tarefas
 * Funções para gerenciamento de tarefas, atribuições e status
 */

import axios from "axios"
import { API_BASE_URL, createHeaders, handleApiError } from "./config"

/**
 * Obtém todas as tarefas do usuário
 * @param {string} token - Token JWT do usuário
 * @returns {Promise<Array>} Lista de tarefas
 * @example
 * const tasks = await getTasks(token)
 */
export async function getTasks(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`, {
      headers: createHeaders(token),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "getTasks")
  }
}

/**
 * Obtém tarefas atribuídas ao usuário
 * @param {string} token - Token JWT do usuário
 * @returns {Promise<Array>} Lista de tarefas atribuídas
 * @example
 * const assignedTasks = await getAssignedTasks(token)
 */
export async function getAssignedTasks(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/assigned`, {
      headers: createHeaders(token),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "getAssignedTasks")
  }
}

/**
 * Cria uma nova tarefa
 * @param {string} token - Token JWT do usuário
 * @param {Object} taskData - Dados da tarefa
 * @param {string} taskData.title - Título da tarefa
 * @param {string} [taskData.description] - Descrição da tarefa
 * @param {string} [taskData.dueDate] - Data de vencimento (ISO string)
 * @param {string} [taskData.category] - Categoria da tarefa
 * @param {string} [taskData.assignedTo] - ID do usuário atribuído
 * @param {Object} [taskData.assignedToDetails] - Detalhes do usuário atribuído
 * @returns {Promise<Object>} Tarefa criada
 * @example
 * const newTask = await createTask(token, {
 *   title: "Completar relatório",
 *   description: "Finalizar relatório mensal",
 *   dueDate: "2023-05-30T23:59:59.999Z",
 *   category: "financeiro"
 * })
 */
export async function createTask(token, taskData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, { headers: createHeaders(token, true) })
    return response
  } catch (error) {
    handleApiError(error, "createTask")
  }
}

/**
 * Atualiza uma tarefa existente
 * @param {string} token - Token JWT do usuário
 * @param {string} taskId - ID da tarefa
 * @param {Object} taskData - Novos dados da tarefa
 * @returns {Promise<Object>} Tarefa atualizada
 * @example
 * const updatedTask = await updateTask(token, "task123", {
 *   title: "Novo título",
 *   description: "Nova descrição"
 * })
 */
export async function updateTask(token, taskId, taskData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData, {
      headers: createHeaders(token, true),
    })
    return response.data
  } catch (error) {
    handleApiError(error, "updateTask")
  }
}

/**
 * Alterna o status de conclusão de uma tarefa
 * @param {string} token - Token JWT do usuário
 * @param {string} taskId - ID da tarefa
 * @returns {Promise<Object>} Resultado com a tarefa atualizada
 * @example
 * const result = await toggleTaskCompletion(token, "task123")
 * console.log(result.task.completed) // true ou false
 */
export async function toggleTaskCompletion(token, taskId) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/tasks/${taskId}/toggle`,
      {},
      { headers: createHeaders(token, true) },
    )
    return response.data
  } catch (error) {
    handleApiError(error, "toggleTaskCompletion")
  }
}

/**
 * Atribui uma tarefa a um usuário
 * @param {string} token - Token JWT do usuário
 * @param {string} taskId - ID da tarefa
 * @param {string} assigneeId - ID do usuário a ser atribuído
 * @param {Object} assigneeDetails - Detalhes do usuário atribuído
 * @returns {Promise<Object>} Tarefa atualizada
 * @example
 * const task = await assignTask(token, "task123", "user456", {
 *   name: "John Doe",
 *   email: "john@example.com"
 * })
 */
export async function assignTask(token, taskId, assigneeId, assigneeDetails) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tasks/${taskId}/assign`,
      { assigneeId, assigneeDetails },
      { headers: createHeaders(token, true) },
    )
    return response.data
  } catch (error) {
    handleApiError(error, "assignTask")
  }
}

/**
 * Atualiza o status de uma tarefa atribuída
 * @param {string} token - Token JWT do usuário
 * @param {string} taskId - ID da tarefa
 * @param {string} status - Novo status (accepted, declined, in-progress, etc)
 * @returns {Promise<Object>} Tarefa atualizada
 * @example
 * const task = await updateTaskStatus(token, "task123", "in-progress")
 */
export async function updateTaskStatus(token, taskId, status) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/tasks/${taskId}/status`,
      { status },
      { headers: createHeaders(token, true) },
    )
    return response.data
  } catch (error) {
    handleApiError(error, "updateTaskStatus")
  }
}

/**
 * Exclui uma tarefa
 * @param {string} token - Token JWT do usuário
 * @param {string} taskId - ID da tarefa
 * @returns {Promise<void>}
 * @example
 * await deleteTask(token, "task123")
 */
export async function deleteTask(token, taskId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, { headers: createHeaders(token) })
    return response.data
  } catch (error) {
    handleApiError(error, "deleteTask")
  }
}

