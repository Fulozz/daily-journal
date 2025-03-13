"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"

export default function EntryCard({ entry, onDelete, onEdit }) {
  const { language } = useLanguage()
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP", {
        locale: language === "pt-BR" ? ptBR : undefined,
      })
    } catch (e) {
      return dateString
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(entry._id || entry.id)
    } finally {
      setIsDeleting(false)
    }
  }

  // Problema: A função handleEdit não está chamando a função onEdit corretamente
  const handleEdit = () => {
    // Não está passando o entry para a função onEdit
    onEdit(entry)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{entry.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{formatDate(entry.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="whitespace-pre-wrap">{entry.content}</div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting} className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  )
}

