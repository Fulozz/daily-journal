"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDistanceToNow } from "date-fns"
import { Edit } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import TaskForm from "@/components/tasks/task-form"

export default function TaskDetailModal({ task, isOpen, onClose, onToggle, onUpdate }) {
  const { t } = useLanguage()
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
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return "some time ago"
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
                  onCheckedChange={() => onToggle(task.id)}
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

