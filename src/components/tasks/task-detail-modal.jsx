"use client"

import { useState } from "react"
import { format, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Edit, Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import TaskForm from "@/components/tasks/task-form"

export default function TaskDetailModal({ task, isOpen, onClose, onToggle, onUpdate }) {
  const { t, language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)

  if (!task) return null

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP", {
        locale: language === "pt-BR" ? ptBR : undefined,
      })
    } catch (e) {
      return dateString
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

  const handleUpdateTask = async (data) => {
    await onUpdate(task._id || task.id, data)
    setIsEditing(false)
  }

  const handleToggleTask = () => {
    onToggle(task._id || task.id)
  }

  const getInitials = (name) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "financeiro":
        return "💰"
      case "cadastro":
        return "📝"
      case "comprovante":
        return "📄"
      case "desenvolvimento":
        return "💻"
      case "marketing":
        return "📊"
      case "suporte":
        return "🔧"
      case "outro":
        return "📌"
      default:
        return ""
    }
  }

  const getCategoryLabel = (category) => {
    if (!category) return null

    const labels = {
      financeiro: language === "pt-BR" ? "Financeiro" : "Financial",
      cadastro: language === "pt-BR" ? "Cadastro" : "Registration",
      comprovante: language === "pt-BR" ? "Comprovante" : "Receipt",
      desenvolvimento: language === "pt-BR" ? "Desenvolvimento" : "Development",
      marketing: "Marketing",
      suporte: language === "pt-BR" ? "Suporte" : "Support",
      outro: language === "pt-BR" ? "Outro" : "Other",
    }

    return labels[category] || category
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("editTask")}</DialogTitle>
            </DialogHeader>
            <TaskForm initialData={task} onSubmit={handleUpdateTask} onCancel={() => setIsEditing(false)} />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{t("taskDetails")}</span>
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="task-complete"
                  checked={task.completed}
                  onCheckedChange={handleToggleTask}
                  className="mt-1"
                />
                <div>
                  <label
                    htmlFor="task-complete"
                    className={`text-lg font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </label>
                  {task.description && (
                    <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{task.description}</p>
                  )}
                </div>
              </div>

              {task.category && (
                <div className="flex items-center gap-2">
                  <Badge className="px-2 py-1">
                    <span className="mr-1">{getCategoryIcon(task.category)}</span>
                    {getCategoryLabel(task.category)}
                  </Badge>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Created: {formatDate(task.createdAt)}</div>

                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={isOverdue(task.dueDate) ? "text-destructive" : ""}>
                      Due: {formatDate(task.dueDate)}
                    </span>
                  </div>
                )}

                {task.completed && task.completionDate && (
                  <div className="flex items-center gap-2 text-green-500">
                    <Check className="h-4 w-4" />
                    <span>
                      {t("completedOn")}: {formatDate(task.completionDate)}
                    </span>
                  </div>
                )}

                {task.assignedToDetails && (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignedToDetails.avatar} alt={task.assignedToDetails.name} />
                      <AvatarFallback>{getInitials(task.assignedToDetails.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm">{task.assignedToDetails.name}</span>
                      <span className="text-xs text-muted-foreground">{task.assignedToDetails.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="button" variant="outline" size="sm" onClick={handleToggleTask} className="gap-1">
                {task.completed ? (
                  <>
                    <X className="h-4 w-4" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Mark as Complete
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

