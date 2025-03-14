"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

const categories = [
  { value: "financeiro", label: "Financeiro", icon: "💰" },
  { value: "cadastro", label: "Cadastro", icon: "📝" },
  { value: "comprovante", label: "Comprovante", icon: "📄" },
  { value: "desenvolvimento", label: "Desenvolvimento", icon: "💻" },
  { value: "marketing", label: "Marketing", icon: "📊" },
  { value: "suporte", label: "Suporte", icon: "🔧" },
  { value: "outro", label: "Outro", icon: "📌" },
]

export default function CategorySelector({ value, onValueChange }) {
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()

  // Traduções para português
  const ptLabels = {
    financeiro: "Financeiro",
    cadastro: "Cadastro",
    comprovante: "Comprovante",
    desenvolvimento: "Desenvolvimento",
    marketing: "Marketing",
    suporte: "Suporte",
    outro: "Outro",
  }

  const getLabel = (value) => {
    const category = categories.find((category) => category.value === value)
    if (!category) return "Select category..."

    return language === "pt-BR" ? ptLabels[category.value] : category.label
  }

  const getIcon = (value) => {
    const category = categories.find((category) => category.value === value)
    return category?.icon || ""
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-2">
            {value && <span>{getIcon(value)}</span>}
            <span>{value ? getLabel(value) : "Select category..."}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{language === "pt-BR" ? ptLabels[category.value] : category.label}</span>
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === category.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

