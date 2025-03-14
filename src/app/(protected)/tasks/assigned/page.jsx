"use client"

import { useState, useEffect } from "react"
import { getCookie } from "cookies-next"
import toast from "react-hot-toast"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import TaskItem from "@/components/tasks/task-item"
import TaskDetailModal from "@/components/tasks/task-detail-modal"
import { getAssignedTasks, updateTaskStatus, toggleTaskCompletion } from "@/lib/api"

export default function AssignedTasksPage() {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    setMounted(true)
    fetchTasks()
  }, [refreshTrigger])

  const refreshTasks = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const fetchTasks = async () => {
    setIsLoading(true)
    const token = getCookie("token")
    try {
      const response = await getAssignedTasks(token)
      if (response) {
        setTasks(response)
      }
    } catch (error) {
      console.error("Error fetching assigned tasks:", error)
      // Mock data for development
      setTasks([
        {
          id: "1",
          title: "Review project proposal",
          description: "Please review the attached project proposal and provide feedback.",
          completed: false,
          status: "pending",
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          createdBy: "user123",
          assignedToDetails: {
            name: "Current User",
            email: "user@example.com",
          },
        },
        {
          id: "2",
          title: "Prepare presentation slides",
          description: "Create slides for the client meeting next week.",
          completed: false,
          status: "accepted",
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          createdBy: "user456",
          assignedToDetails: {
            name: "Current User",
            email: "user@example.com",
          },
        },
        {
          id: "3",
          title: "Schedule team meeting",
          description: "Coordinate with team members to schedule a planning meeting.",
          completed: true,
          status: "completed",
          completionDate: new Date(Date.now() - 86400000).toISOString(),
          dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
          createdBy: "user789",
          assignedToDetails: {
            name: "Current User",
            email: "user@example.com",
          },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleTask = async (taskId) => {
    try {
      const token = getCookie("token")
      const response = await toggleTaskCompletion(token, taskId)

      if (response && response.task) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId || task.id === taskId
              ? {
                  ...task,
                  completed: response.task.completed,
                  completionDate: response.task.completionDate,
                  status: response.task.completed ? "completed" : task.status,
                }
              : task,
          ),
        )

        if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
          setSelectedTask({
            ...selectedTask,
            completed: response.task.completed,
            completionDate: response.task.completionDate,
            status: response.task.completed ? "completed" : selectedTask.status,
          })
        }

        toast.success(response.task.completed ? "Task marked as completed" : "Task marked as incomplete")
        setTimeout(refreshTasks, 300)
      }
    } catch (error) {
      console.error("Error toggling task:", error)
      toast.error("Failed to update task status")
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      const token = getCookie("token")
      const response = await updateTaskStatus(token, taskId, status)

      if (response) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId || task.id === taskId
              ? {
                  ...task,
                  status: response.status,
                }
              : task,
          ),
        )

        if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
          setSelectedTask({
            ...selectedTask,
            status: response.status,
          })
        }

        toast.success(`Task ${status.replace("-", " ")}`)
        setTimeout(refreshTasks, 300)
      }
    } catch (error) {
      console.error("Error updating task status:", error)

      // Update UI optimistically for better UX
      setTasks(
        tasks.map((task) =>
          task._id === taskId || task.id === taskId
            ? {
                ...task,
                status,
              }
            : task,
        ),
      )

      if (selectedTask && (selectedTask._id === taskId || selectedTask.id === taskId)) {
        setSelectedTask({
          ...selectedTask,
          status,
        })
      }

      toast.success(`Task ${status.replace("-", " ")}`)
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Filter tasks based on search query and active tab
  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))

      if (activeTab === "all") {
        return matchesSearch
      } else if (activeTab === "completed") {
        return matchesSearch && task.completed
      } else if (activeTab === "pending") {
        return matchesSearch && task.status === "pending"
      } else if (activeTab === "accepted") {
        return matchesSearch && (task.status === "accepted" || task.status === "in-progress")
      } else if (activeTab === "declined") {
        return matchesSearch && task.status === "declined"
      }

      return matchesSearch
    })
  }

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  const filteredTasks = getFilteredTasks()

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Assigned Tasks</h1>
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

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
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
            <TaskItem key={task._id || task.id} task={task} onToggle={handleToggleTask} onClick={handleTaskClick} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              {activeTab === "pending"
                ? "No pending tasks assigned to you"
                : activeTab === "accepted"
                  ? "No accepted tasks"
                  : activeTab === "declined"
                    ? "No declined tasks"
                    : activeTab === "completed"
                      ? "No completed tasks"
                      : "No tasks assigned to you"}
            </p>
          </CardContent>
        </Card>
      )}

      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggle={handleToggleTask}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

