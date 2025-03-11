"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Edit, MoreVertical, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import EntryForm from "@/components/entries/entry-form"

export default function EntryCard({ entry, onDelete, onUpdate }) {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return "some time ago"
    }
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("edit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EntryForm
            initialData={entry}
            onSubmit={(data) => {
              onUpdate?.(entry._id, data)
              setIsEditing(false)
            }}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{entry.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>{t("edit")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(entry._id)} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                <span>{t("delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{formatDate(entry.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{entry.content}</p>
      </CardContent>
    </Card>
  )
}

