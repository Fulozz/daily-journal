/**
 * Configuração base para a API
 * Este arquivo contém configurações compartilhadas por todos os módulos da API
 */

// URL base da API
export const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
/**
 * Cria os headers padrão para requisições autenticadas
 * @param {string} token - Token JWT de autenticação
 * @param {boolean} isJson - Se true, adiciona Content-Type: application/json
 * @returns {Object} Headers para requisição
 */
export function createHeaders(token, isJson = false) {
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  if (isJson) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

/**
 * Manipulador de erros padrão para requisições da API
 * @param {Error} error - Erro capturado
 * @param {string} context - Contexto onde o erro ocorreu
 * @throws {Error} Relança o erro após o log
 */
export function handleApiError(error, context) {
  console.error(`Error in ${context}:`, error)
  throw error
}

