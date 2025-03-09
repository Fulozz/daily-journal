"use client"

import { Trash, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDistanceToNow } from "date-fns"
import { useLanguage } from "@/components/language-provider"

export default function TaskItem({ task, onToggle, onDelete, onEdit, onClick }) {
  const { t } = useLanguage()

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return "some time ago"
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
                htmlFor={`task-${task.id}`}
                className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.title}
              </label>
              <p className="text-xs text-muted-foreground">{formatDate(task.createdAt)}</p>
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

