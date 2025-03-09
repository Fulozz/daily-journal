"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie, deleteCookie } from "cookies-next"
import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"

export default function UserNav() {
  const { t, language, changeLanguage } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userCookie = getCookie("user")
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie))
      } catch (e) {
        console.error("Error parsing user cookie:", e)
      }
    }
  }, [])

  const handleLogout = () => {
    deleteCookie("token")
    deleteCookie("user")
    router.push("/login")
    router.refresh()
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user?.name || "User"} />
            <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>{t("profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => changeLanguage(language === "en-US" ? "pt-BR" : "en-US")}>
          <span className="mr-2">🌐</span>
          <span>{language === "en-US" ? "Português" : "English"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

