"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCookie } from "cookies-next"
import { Book, CheckSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

export default function MainNav() {
  const { t } = useLanguage()
  const pathname = usePathname()
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

  const navItems = [
    {
      title: t("dashboard"),
      href: "/dashboard",
      icon: <Book className="h-5 w-5" />,
    },
    {
      title: t("tasks"),
      href: "/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
    },
    {
      title: t("profile"),
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}

