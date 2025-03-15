/**
 * API Central
 * Exporta todas as funções da API para uso em toda a aplicação
 */

// Autenticação
export {
  login,
  register,
  validateToken,
  updatePassword,
} from "./auth"

// Usuários
export {
  getUser,
  updateUser,
  searchUsers,
} from "./user"

// Tarefas
export {
  getTasks,
  getAssignedTasks,
  createTask,
  updateTask,
  toggleTaskCompletion,
  assignTask,
  updateTaskStatus,
  deleteTask,
} from "./task"

// Entradas de Diário
export {
  getEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} from "./entry"

// Notificações
export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notification"

