"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { setCookie, getCookie } from "cookies-next"

// Translation dictionaries
const translations = {
  "en-US": {
    // Existing translations
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
    preferencesSaved: "Preferences saved successfully",
    savePreferences: "Save Preferences",
    dueDate: "Due Date",
    selectDueDate: "Select due date",
    clearDate: "Clear date",
    completedOn: "Completed on",

    // Landing page translations
    personalJournal: "Your Personal Journal & Task Manager",
    organizeThoughts: "Organize your thoughts, track your tasks, and document your journey all in one place.",
    startForFree: "Start for Free",
    signIn: "Sign In",
    todaysJournal: "Today's Journal",
    completedProject: "Completed project proposal",
    finishedAhead: "Finished ahead of schedule!",
    scheduleTeam: "Schedule team meeting",
    forNextSprint: "For next sprint planning",
    addNewEntry: "Add new entry...",
    features: "Features",
    everythingYouNeed: "Everything You Need",
    appCombines: "Our app combines the best features of a journal, to-do list, and personal organizer.",
    dailyJournal: "Daily Journal",
    recordThoughts: "Record your thoughts, experiences, and important moments in your personal diary.",
    taskManagement: "Task Management",
    createOrganize: "Create, organize, and track your tasks with our intuitive to-do list functionality.",
    darkMode: "Dark Mode",
    customizeExperience: "Customize your experience with dark theme for comfortable use any time of day.",
    multilingual: "Multilingual",
    useAppIn: "Use the app in your preferred language with support for English and Portuguese.",
    securePrivate: "Secure & Private",
    yourDataProtected: "Your data is protected with secure authentication and private storage.",
    freeToUse: "Free to Use",
    getStartedFree: "Get started with our free plan and access all essential features without any cost.",
    testimonials: "Testimonials",
    whatUsersSay: "What Our Users Say",
    dontJustTake: "Don't just take our word for it. Here's what people are saying about Daily Journal.",
    testimonial1:
      "This app has completely transformed how I organize my thoughts and tasks. The interface is intuitive and the dark mode is perfect for late-night journaling.",
    testimonial2:
      "I've tried many journal and task apps, but this one stands out. The multilingual support is a game-changer for me as I switch between English and Portuguese.",
    testimonial3:
      "The combination of journal and task management is perfect. I can reflect on my day and plan for tomorrow all in one place. Highly recommended!",
    sarahJohnson: "Sarah Johnson",
    productDesigner: "Product Designer",
    carlosMendes: "Carlos Mendes",
    softwareEngineer: "Software Engineer",
    emilyChen: "Emily Chen",
    contentCreator: "Content Creator",
    readyToGetStarted: "Ready to Get Started?",
    joinThousands: "Join thousands of users who are already organizing their lives with Daily Journal.",
    createFreeAccount: "Create Free Account",
    allRightsReserved: "© 2025 Thiago Silva Andrade. All rights reserved.",
    terms: "Terms",
    privacy: "Privacy",
    backToHome: "Back to Home",
  },
  "pt-BR": {
    // Existing translations
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
    preferencesSaved: "Preferências salvas com sucesso",
    savePreferences: "Salvar Preferências",
    dueDate: "Data de Vencimento",
    selectDueDate: "Selecione a data de vencimento",
    clearDate: "Limpar data",
    completedOn: "Foi concluído em",

    // Landing page translations
    personalJournal: "Seu Diário Pessoal & Gerenciador de Tarefas",
    organizeThoughts: "Organize seus pensamentos, acompanhe suas tarefas e documente sua jornada em um só lugar.",
    startForFree: "Comece Gratuitamente",
    signIn: "Entrar",
    todaysJournal: "Diário de Hoje",
    completedProject: "Proposta de projeto concluída",
    finishedAhead: "Finalizado antes do prazo!",
    scheduleTeam: "Agendar reunião de equipe",
    forNextSprint: "Para o planejamento do próximo sprint",
    addNewEntry: "Adicionar nova entrada...",
    features: "Funcionalidades",
    everythingYouNeed: "Tudo o que Você Precisa",
    appCombines:
      "Nosso aplicativo combina as melhores funcionalidades de um diário, lista de tarefas e organizador pessoal.",
    dailyJournal: "Diário Pessoal",
    recordThoughts: "Registre seus pensamentos, experiências e momentos importantes em seu diário pessoal.",
    taskManagement: "Gerenciamento de Tarefas",
    createOrganize: "Crie, organize e acompanhe suas tarefas com nossa funcionalidade intuitiva de lista de afazeres.",
    darkMode: "Modo Escuro",
    customizeExperience: "Personalize sua experiência com o tema escuro para uso confortável a qualquer hora do dia.",
    multilingual: "Multilíngue",
    useAppIn: "Use o aplicativo no seu idioma preferido com suporte para inglês e português.",
    securePrivate: "Seguro & Privado",
    yourDataProtected: "Seus dados são protegidos com autenticação segura e armazenamento privado.",
    freeToUse: "Gratuito para Usar",
    getStartedFree: "Comece com nosso plano gratuito e acesse todas as funcionalidades essenciais sem nenhum custo.",
    testimonials: "Depoimentos",
    whatUsersSay: "O que Nossos Usuários Dizem",
    dontJustTake: "Não apenas acredite em nossa palavra. Veja o que as pessoas estão dizendo sobre o Daily Journal.",
    testimonial1:
      "Este aplicativo transformou completamente como eu organizo meus pensamentos e tarefas. A interface é intuitiva e o modo escuro é perfeito para escrever à noite.",
    testimonial2:
      "Já experimentei muitos aplicativos de diário e tarefas, mas este se destaca. O suporte multilíngue é um diferencial para mim, pois alterno entre inglês e português.",
    testimonial3:
      "A combinação de diário e gerenciamento de tarefas é perfeita. Posso refletir sobre meu dia e planejar o amanhã em um só lugar. Altamente recomendado!",
    sarahJohnson: "Sarah Johnson",
    productDesigner: "Designer de Produto",
    carlosMendes: "Carlos Mendes",
    softwareEngineer: "Engenheiro de Software",
    emilyChen: "Emily Chen",
    contentCreator: "Criadora de Conteúdo",
    readyToGetStarted: "Pronto para Começar?",
    joinThousands: "Junte-se a milhares de usuários que já estão organizando suas vidas com o Daily Journal.",
    createFreeAccount: "Criar Conta Gratuita",
    allRightsReserved: "© 2025 Thiago Silva Andrade. Todos os direitos reservados.",
    terms: "Termos",
    privacy: "Privacidade",
    backToHome: "Voltar para a Página Inicial",
  },
}
// Create context with default values to prevent undefined errors
const LanguageContext = createContext({
  language: "en-US",
  changeLanguage: () => {},
  t: (key) => key,
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en-US")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = getCookie("language") || "en-US"
    setLanguage(savedLanguage)
  }, [])

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    setCookie("language", newLanguage, { maxAge: 60 * 60 * 24 * 30 })
  }

  const t = (key) => {
    return (translations[language] && translations[language][key]) || key
  }

  // Provide default values even before mounting to prevent undefined errors
  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

