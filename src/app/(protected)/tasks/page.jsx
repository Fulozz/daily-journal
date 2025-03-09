"use client"

import { useState, useEffect } from "react"
import { getCookie } from "cookies-next"
import axios from "axios"
import toast from "react-hot-toast"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import TaskItem from "@/components/tasks/task-item"
import TaskForm from "@/components/tasks/task-form"
import TaskDetailModal from "@/components/tasks/task-detail-modal"
import { deleteTask, updateTask } from "@/lib/api"

export default function TasksPage() {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    const token = getCookie("token")

    try {
      const response = await axios.get("https://daily-journal-backend-3bb6.onrender.com/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        setTasks(response.data)
      }
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
            dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Buy groceries",
            description: "Milk, eggs, bread, fruits, and vegetables for the week.",
            completed: true,
            completionDate: new Date(Date.now() - 86400000).toISOString(),
            dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: "3",
            title: "Schedule dentist appointment",
            description: "Call Dr. Smith's office to schedule a check-up.",
            completed: false,
            dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ])
      } else {
        toast.error("Failed to fetch tasks")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (taskData) => {
    const token = getCookie("token")

    try {
      const response = await axios.post("https://daily-journal-backend-3bb6.onrender.com/api/v1/tasks", taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data) {
        toast.success("Task added successfully")
        setTasks([response.data, ...tasks])
        setShowTaskForm(false)
      }
    } catch (error) {
      console.error("Error adding task:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, add to mock data
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
    const token = getCookie("token")
    const taskToUpdate = tasks.find((task) => task.id === taskId)

    if (!taskToUpdate) return

    // Determine if we're completing or uncompleting the task
    const isCompleting = !taskToUpdate.completed

    // Set or clear the completion date based on the new status
    const completionDate = isCompleting ? new Date().toISOString() : null

    try {
      await axios.patch(
        `https://daily-journal-backend-3bb6.onrender.com/api/v1/tasks/${taskId}`,
        {
          completed: isCompleting,
          completionDate: completionDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: isCompleting,
                completionDate: completionDate,
              }
            : task,
        ),
      )

      // Update selected task if it's the one being toggled
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({
          ...selectedTask,
          completed: isCompleting,
          completionDate: completionDate,
        })
      }
    } catch (error) {
      console.error("Error updating task:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, update mock data
        setTasks(
          tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed: isCompleting,
                  completionDate: completionDate,
                }
              : task,
          ),
        )

        // Update selected task if it's the one being toggled
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({
            ...selectedTask,
            completed: isCompleting,
            completionDate: completionDate,
          })
        }
      } else {
        toast.error("Failed to update task")
      }
    }
  }

  const handleUpdateTask = async (taskId, data) => {
    const token = getCookie("token")

    try {
      updateTask
      put
      toast.success("Task updated successfully")

      const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...data } : task))

      setTasks(updatedTasks)
      setSelectedTask({ ...selectedTask, ...data })
    } catch (error) {
      console.error("Error updating task:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, update mock data
        const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, ...data } : task))

        setTasks(updatedTasks)
        setSelectedTask({ ...selectedTask, ...data })
        toast.success("Task updated successfully")
      } else {
        toast.error("Failed to update task")
      }
    }
  }

  const handleDeleteTask = async (taskId) => {
    const token = getCookie("token")

    
    try {
      await deleteTask(token, taskId)

      toast.success("Task deleted successfully")
      setTasks(tasks.filter((task) => task.id !== taskId))

      // Close modal if the deleted task is the selected one
      if (selectedTask && selectedTask.id === taskId) {
        setIsModalOpen(false)
        setSelectedTask(null)
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      if (error.response?.status === 404) {
        // API endpoint not found, remove from mock data
        setTasks(tasks.filter((task) => task.id !== taskId))

        // Close modal if the deleted task is the selected one
        if (selectedTask && selectedTask.id === taskId) {
          setIsModalOpen(false)
          setSelectedTask(null)
        }

        toast.success("Task deleted successfully")
      } else {
        toast.error("Failed to delete task")
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "completed") return matchesSearch && task.completed
    if (activeTab === "incomplete") return matchesSearch && !task.completed

    return matchesSearch
  })

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("tasks")}</h1>
        <Button onClick={() => setShowTaskForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("addTask")}
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("search")}
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {showTaskForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <TaskForm onSubmit={handleAddTask} onCancel={() => setShowTaskForm(false)} />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="incomplete">{t("incomplete")}</TabsTrigger>
          <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-muted mr-3"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
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
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">{t("noTasks")}</p>
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

