"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/components/language-provider"

export default function EntryForm({ initialData, onSubmit, onCancel }) {
  const { t } = useLanguage()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("title")}</Label>
        <Input
          id="title"
          {...register("title", {
            required: "Title is required",
          })}
          placeholder={t("title")}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea
          id="description"
          {...register("description", {
            required: "description is required",
          })}
          placeholder={t("description")}
          className="min-h-[150px]"
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  )
}

