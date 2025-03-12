"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"

export default function EntryForm({ initialData, onSubmit, onCancel }) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  })
  const onFormSubmit = async (data) => {
    // Previne múltiplos envios
    if (isSubmitting) return

    // Define o estado de submissão
    setIsSubmitting(true)

    try {
      await onSubmit(data)
    } finally {
      // Restaura o estado de submissão após um tempo para garantir que a UI seja atualizada
      setTimeout(() => {
        setIsSubmitting(false)
      }, 500)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="title">{t("title")}</Label>
      <Input
        id="title"
        {...register("title", {
          required: "Title is required",
        })}
        placeholder={t("title")}
        disabled={isSubmitting}
      />
      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
    </div>

    <div className="space-y-2">
      <Label htmlFor="content">{t("content")}</Label>
      <Textarea
        id="content"
        {...register("content", {
          required: "Content is required",
        })}
        placeholder={t("content")}
        className="min-h-[150px]"
        disabled={isSubmitting}
      />
      {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
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

