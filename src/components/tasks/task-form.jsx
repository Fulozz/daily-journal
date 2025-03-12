"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const { t, language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    },
  })

  const dueDate = watch("dueDate")

  const onFormSubmit = async (data) => {
    // Previne múltiplos envios
    if (isSubmitting) return

    // Define o estado de submissão
    setIsSubmitting(true)

    try {
      // Convert date to ISO string if it exists
      if (data.dueDate) {
        data.dueDate = data.dueDate.toISOString()
      }
      await onSubmit(data)
    } finally {
      // Restaura o estado de submissão após um tempo para garantir que a UI seja atualizada
      setTimeout(() => {
        setIsSubmitting(false)
      }, 500)
    }
  }

  const formatDate = (date) => {
    if (!date) return ""

    return format(date, "PPP", {
      locale: language === "pt-BR" ? ptBR : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("title")}</Label>
        <Input
          id="title"
          {...register("title", {
            required: "Task title is required",
          })}
          placeholder={t("enterTask")}
          disabled={isSubmitting}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder={t("enterDescription")}
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">{t("dueDate")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn("w-full justify-start text-left font-normal cursor-pointer", !dueDate && "text-muted-foreground")}
              disabled={isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? formatDate(dueDate) : t("selectDueDate")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => setValue("dueDate", date)}
              initialFocus
              locale={language === "pt-BR" ? ptBR : undefined}
              disabled={isSubmitting}
            />
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-1"
          onClick={() => setValue("dueDate", undefined)}
          disabled={isSubmitting}
        >
          {t("clearDate")}
        </Button>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting} className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}>
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("saving")}
            </span>
          ) : (
            t("save")
          )}
        </Button>
      </div>
    </form>
  )
}

