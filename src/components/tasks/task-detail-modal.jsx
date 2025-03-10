"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { format, formatDistanceToNow, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Calendar } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import TaskForm from "@/components/tasks/task-form"
import { Badge } from "@/components/ui/badge"

export default function TaskDetailModal({ task, isOpen, onClose, onToggle, onUpdate }) {
  const { t, language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!task) return null

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === "pt-BR" ? ptBR : undefined,
      })
    } catch (e) {
      return "some time ago"
    }
  }

  const formatFullDate = (dateString) => {
    if (!dateString) return ""
    try {
      return format(new Date(dateString), "PPP", {
        locale: language === "pt-BR" ? ptBR : undefined,
      })
    } catch (e) {
      return ""
    }
  }

  const isOverdue = (dateString) => {
    if (!dateString) return false
    try {
      return isAfter(new Date(), new Date(dateString)) && !task.completed
    } catch (e) {
      return false
    }
  }

  const handleUpdate = (data) => {
    onUpdate(task.id, data)
    setIsEditing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("editTask")}</DialogTitle>
            </DialogHeader>
            <TaskForm initialData={task} onSubmit={handleUpdate} onCancel={() => setIsEditing(false)} />
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{t("taskDetails")}</DialogTitle>
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t("edit")}</span>
                </Button>
              </div>
              <DialogDescription>{formatDate(task.createdAt)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="task-modal-checkbox"
                  checked={task.completed}
                  onCheckedChange={() => onToggle(task._id)}
                  className="mt-1"
                />
                <div>
                  <label
                    htmlFor="task-modal-checkbox"
                    className={`text-lg font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                </div>
              </div>

              {task.dueDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t("dueDate")}</p>
                    <p className={`text-sm ${isOverdue(task.dueDate) ? "text-destructive" : "text-muted-foreground"}`}>
                      {formatFullDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              )}

              {task.completed && task.completionDate && (
                <div className="pt-2">
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    {language === "pt-BR" ? "Foi concluído em " : "Completed on "}
                    {format(new Date(task.completionDate), "dd/MM/yyyy", {
                      locale: language === "pt-BR" ? ptBR : undefined,
                    })}
                  </Badge>
                </div>
              )}

              {task.description && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("description")}</h4>
                  <p className="whitespace-pre-line">{task.description}</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

