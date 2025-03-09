"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { setCookie, getCookie } from "cookies-next"

// Translation dictionaries
const translations = {
  "en-US": {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    name: "Name",
    submit: "Submit",
    dashboard: "Dashboard",
    profile: "Profile",
    logout: "Logout",
    addEntry: "Add Entry",
    title: "Title",
    content: "Content",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    theme: "Theme",
    language: "Language",
    dark: "Dark",
    light: "Light",
    system: "System",
    updatePassword: "Update Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    entries: "Entries",
    tasks: "Tasks",
    addTask: "Add Task",
    completed: "Completed",
    incomplete: "Incomplete",
    search: "Search",
    noEntries: "No entries found",
    noTasks: "No tasks found",
    welcomeBack: "Welcome back",
    loading: "Loading...",
    saving: "Saving...",
    updating: "Updating...",
    cancel: "Cancel",
    account: "Account",
    preferences: "Preferences",
    accountSettings: "Account Settings",
    updateAccountInfo: "Update your account information",
    passwordSettings: "Password Settings",
    updatePasswordDescription: "Change your password",
    preferencesDescription: "Manage your app preferences",
    selectTheme: "Select theme",
    selectLanguage: "Select language",
    task: "Task",
    enterTask: "Enter task title",
    description: "Description",
    enterDescription: "Enter task description",
    all: "All",
    taskDetails: "Task Details",
    editTask: "Edit Task",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
  },
  "pt-BR": {
    login: "Entrar",
    register: "Registrar",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    name: "Nome",
    submit: "Enviar",
    dashboard: "Painel",
    profile: "Perfil",
    logout: "Sair",
    addEntry: "Adicionar Entrada",
    title: "Título",
    content: "Conteúdo",
    save: "Salvar",
    delete: "Excluir",
    edit: "Editar",
    theme: "Tema",
    language: "Idioma",
    dark: "Escuro",
    light: "Claro",
    system: "Sistema",
    updatePassword: "Atualizar Senha",
    currentPassword: "Senha Atual",
    newPassword: "Nova Senha",
    entries: "Entradas",
    tasks: "Tarefas",
    addTask: "Adicionar Tarefa",
    completed: "Concluído",
    incomplete: "Incompleto",
    search: "Buscar",
    noEntries: "Nenhuma entrada encontrada",
    noTasks: "Nenhuma tarefa encontrada",
    welcomeBack: "Bem-vindo de volta",
    loading: "Carregando...",
    saving: "Salvando...",
    updating: "Atualizando...",
    cancel: "Cancelar",
    account: "Conta",
    preferences: "Preferências",
    accountSettings: "Configurações da Conta",
    updateAccountInfo: "Atualize suas informações de conta",
    passwordSettings: "Configurações de Senha",
    updatePasswordDescription: "Altere sua senha",
    preferencesDescription: "Gerencie suas preferências do aplicativo",
    selectTheme: "Selecione o tema",
    selectLanguage: "Selecione o idioma",
    task: "Tarefa",
    enterTask: "Digite o título da tarefa",
    description: "Descrição",
    enterDescription: "Digite a descrição da tarefa",
    all: "Todas",
    taskDetails: "Detalhes da Tarefa",
    editTask: "Editar Tarefa",
    dontHaveAccount: "Não tem uma conta?",
    alreadyHaveAccount: "Já tem uma conta?",
  },
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en-US")

  useEffect(() => {
    const savedLanguage = getCookie("language") || "en-US"
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    setCookie("language", newLanguage, { maxAge: 60 * 60 * 24 * 30 })
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, changeLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)

