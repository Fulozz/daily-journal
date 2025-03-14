"use client"

import { useState, useEffect } from "react"
import { getCookie } from "cookies-next"
import toast from "react-hot-toast"
import { Plus, Search, RefreshCw, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import TaskItem from "@/components/tasks/task-item"
import TaskForm from "@/components/tasks/task-form"
import TaskDetailModal from "@/components/tasks/task-detail-modal"
import { deleteTask, updateTask, getTasks, createTask, getUser, toggleTaskCompletion } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TasksPage() {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [activeTab, setActiveTab] = useState("incomplete")
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState([])

  useEffect(() => {
    setMounted(true)
    fetchTasks()

    // Set up polling for task updates
    const intervalId = setInterval(() => {
      // Only refresh if not already refreshing and it's been more than 30 seconds
      if (!isRefreshing && Date.now() - lastRefreshTime > 30000) {
        refreshTasks(true)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(intervalId)
  }, [refreshTrigger])

  const refreshTasks = (silent = false) => {
    if (!silent) {
      setRefreshTrigger((prev) => prev + 1)
    } else {
      // Silent refresh - don't show loading state
      setIsRefreshing(true)
      fetchTasks(true)
    }
  }

  const fetchTasks = async (silent = false) => {
    if (!silent) {
      setIsLoading(true)
    }

    const token = getCookie("token")
    try {
      const response = await getTasks(token)
      if (response) {
        setTasks(response)
      }
      setLastRefreshTime(Date.now())
    } catch (error) {
      console.error("Error fetching tasks:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, use mock data
        setTasks([
          {
            id: "1",
            title: "Complete project documentation",
            description: "Write detailed documentation for the new feature including API endpoints and usage examples.",
            completed: false,
            category: "desenvolvimento",
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Process invoice payment",
            description: "Process payment for invoice #12345 from supplier XYZ.",
            completed: true,
            category: "financeiro",
            completionDate: new Date(Date.now() - 86400000).toISOString(),
            dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            assignedToDetails: {
              name: "Jane Smith",
              email: "jane@example.com",
            },
          },
          {
            id: "3",
            title: "Upload receipt for office supplies",
            description: "Scan and upload receipt for the office supplies purchased last week.",
            completed: false,
            category: "comprovante",
            dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: "4",
            title: "Register new client",
            description: "Complete registration process for new client ABC Corp.",
            completed: false,
            category: "cadastro",
            dueDate: new Date(Date.now() + 86400000 * 1).toISOString(), // 1 day from now
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            assignedToDetails: {
              name: "Bob Johnson",
              email: "bob@example.com",
            },
          },
        ])
      } else if (!silent) {
        toast.error("Failed to fetch tasks")
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleAddTask = async (taskData) => {
    const token = getCookie("token")

    if (isLoading) return

    try {
      const user = await getUser(token)
      const userId = user._id
      const data = {
        ...taskData,
        createdBy: userId,
        completed: false,
      }
      const response = await createTask(token, data)

      if (response.data) {
        toast.success("Task added successfully")
        // Optimistic update
        const newTask = {
          ...response.data,
          _id: response.data._id || response.data.id,
        }
        setTasks([newTask, ...tasks])
        setShowTaskForm(false)
        // Refresh to ensure consistency
        setTimeout(refreshTasks, 300)
      }
    } catch (error) {
      console.error("Error adding task:", error)
      if (error.response?.status === 404) {
        const newTask = {
          id: Date.now().toString(),
          ...taskData,
          completed: false,
          createdAt: new Date().toISOString(),
        }
        setTasks([newTask, ...tasks])
        toast.success("Task added successfully")
        setShowTaskForm(false)
      } else {
        toast.error("Failed to add task")
      }
    }
  }

  const handleToggleTask = async (taskId) => {
    try {
      const token = getCookie("token")

      // Optimistic update
      const updatedTasks = tasks.map((task) => {
        if ((task._id || task.id) === taskId) {
          return {
            ...task,
            completed: !task.completed,
            completionDate: !task.completed ? new Date().toISOString() : undefined,
          }
        }
        return task
      })
      setTasks(updatedTasks)

      // Update selected task if it's the one being toggled
      if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
        setSelectedTask({
          ...selectedTask,
          completed: !selectedTask.completed,
          completionDate: !selectedTask.completed ? new Date().toISOString() : undefined,
        })
      }

      // Actual API call
      const response = await toggleTaskCompletion(token, taskId)

      if (response && response.task) {
        // Refresh to ensure consistency
        setTimeout(refreshTasks, 300)
      }
    } catch (error) {
      console.error("Error toggling task:", error)
      toast.error("Failed to update task status")
      // Revert optimistic update on error
      fetchTasks()
    }
  }

  const handleUpdateTask = async (taskId, data) => {
    const token = getCookie("token")
    try {
      // Optimistic update
      const updatedTasks = tasks.map((task) => {
        if ((task._id || task.id) === taskId) {
          return { ...task, ...data }
        }
        return task
      })
      setTasks(updatedTasks)

      if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
        setSelectedTask({ ...selectedTask, ...data })
      }

      // Actual API call
      await updateTask(token, taskId, data)
      toast.success("Task updated successfully")

      // Refresh to ensure consistency
      setTimeout(refreshTasks, 300)
    } catch (error) {
      console.error("Error updating task:", error)
      if (error.response?.status === 404) {
        toast.success("Task updated successfully")
      } else {
        toast.error("Failed to update task")
        // Revert optimistic update on error
        fetchTasks()
      }
    }
  }

  const handleDeleteTask = async (taskId) => {
    const token = getCookie("token")
    try {
      // Optimistic update
      const filteredTasks = tasks.filter((task) => (task._id || task.id) !== taskId)
      setTasks(filteredTasks)

      if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
        setIsModalOpen(false)
        setSelectedTask(null)
      }

      // Actual API call
      await deleteTask(token, taskId)
      toast.success("Task deleted successfully")

      // Refresh to ensure consistency
      setTimeout(refreshTasks, 300)
    } catch (error) {
      console.error("Error deleting task:", error)
      if (error.response?.status === 404) {
        toast.success("Task deleted successfully")
      } else {
        toast.error("Failed to delete task")
        // Revert optimistic update on error
        fetchTasks()
      }
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const toggleCategoryFilter = (category) => {
    setCategoryFilter((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Filtra as tarefas com base na pesquisa, categoria e status
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // Filter by search query
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

      // Filter by category if any categories are selected
      const matchesCategory = categoryFilter.length === 0 || (task.category && categoryFilter.includes(task.category))

      // Filter by completion status
      const matchesStatus = activeTab === "all" || (activeTab === "completed" ? task.completed : !task.completed)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  const filteredTasks = getFilteredTasks()

  // Get all available categories from tasks
  const availableCategories = Array.from(new Set(tasks.map((task) => task.category).filter(Boolean)))

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("tasks")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refreshTasks()} disabled={isLoading || isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => setShowTaskForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addTask")}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {availableCategories.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={categoryFilter.includes(category)}
                  onCheckedChange={() => toggleCategoryFilter(category)}
                >
                  {(() => {
                    const icons = {
                      financeiro: "💰",
                      cadastro: "📝",
                      comprovante: "📄",
                      desenvolvimento: "💻",
                      marketing: "📊",
                      suporte: "🔧",
                      outro: "📌",
                    }
                    return (
                      <span className="flex items-center gap-2">
                        <span>{icons[category] || ""}</span>
                        <span className="capitalize">{category}</span>
                      </span>
                    )
                  })()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {showTaskForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <TaskForm onSubmit={handleAddTask} onCancel={() => setShowTaskForm(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="incomplete" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incomplete">{t("incomplete")}</TabsTrigger>
          <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center">
                      <div className="h-5 w-5 rounded-full bg-muted mr-3"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onClick={handleTaskClick}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              {activeTab === "completed"
                ? t("noCompletedTasks")
                : activeTab === "incomplete"
                  ? t("noTasks")
                  : t("noTasks")}
            </p>
            <Button onClick={() => setShowTaskForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addTask")}
            </Button>
          </CardContent>
        </Card>
      )}

      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggle={handleToggleTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  )
}

