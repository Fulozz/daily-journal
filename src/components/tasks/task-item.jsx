"use client"

import { Trash, Edit, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { format, formatDistanceToNow, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useLanguage } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"

export default function TaskItem({ task, onToggle, onDelete, onEdit, onClick }) {
  const { t, language } = useLanguage()
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

  const isOverdue = (dateString) => {
    if (!dateString) return false
    try {
      return isAfter(new Date(), new Date(dateString)) && !task.completed
    } catch (e) {
      return false
    }
  }

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onClick(task)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-0.5"
            />
            <div>
              <label
                htmlFor={`task-${task._id}`}
                className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-muted-foreground">{formatDate(task.createdAt)}</p>
                {task.dueDate && !task.completed && (
                  <Badge variant={isOverdue(task.dueDate) ? "destructive" : "secondary"} className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(task.dueDate), "dd/MM/yyyy", {
                      locale: language === "pt-BR" ? ptBR : undefined,
                    })}
                  </Badge>
                )}
                {task.completed && task.completionDate && (
                  <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                    {language === "pt-BR" ? "Concluído em " : "Completed on "}
                    {format(new Date(task.completionDate), "dd/MM/yyyy", {
                      locale: language === "pt-BR" ? ptBR : undefined,
                    })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(task)
              }}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">{t("edit")}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(task.id)
              }}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">{t("delete")}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

