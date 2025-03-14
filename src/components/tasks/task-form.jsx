"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import UserSelector from "@/components/tasks/user-selector"
import CategorySelector from "@/components/tasks/category-selector"
import { ptBR } from "date-fns/locale"

export default function TaskForm({ onSubmit, onCancel, initialData = null }) {
  const { t, language } = useLanguage()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignee, setAssignee] = useState(null)
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setDescription(initialData.description || "")
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate) : null)
      setAssignee(initialData.assignedToDetails || null)
      setCategory(initialData.category || "")
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const taskData = {
        title,
        description,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        assignedTo: assignee?._id,
        assignedToDetails: assignee
          ? {
              name: assignee.name,
              email: assignee.email,
              avatar: assignee.avatar,
            }
          : undefined,
        category: category || undefined,
      }
      await onSubmit(taskData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearDueDate = () => {
    setDueDate(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("task")}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("enterTask")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <CategorySelector value={category} onValueChange={setCategory} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("enterDescription")}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">{t("dueDate")}</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? (
                  format(dueDate, "PPP", { locale: language === "pt-BR" ? ptBR : undefined })
                ) : (
                  <span>{t("selectDueDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
            </PopoverContent>
          </Popover>
          {dueDate && (
            <Button type="button" variant="ghost" size="icon" onClick={clearDueDate} className="h-10 w-10">
              <X className="h-4 w-4" />
              <span className="sr-only">{t("clearDate")}</span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Atribuir para</Label>
        <UserSelector selectedUser={assignee} onUserSelect={setAssignee} onClear={() => setAssignee(null)} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : initialData ? t("save") : t("addTask")}
        </Button>
      </div>
    </form>
  )
}

