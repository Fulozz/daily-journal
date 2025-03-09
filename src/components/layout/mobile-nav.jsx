"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, CheckSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import { useMobile } from "@/hooks/use-mobile"

export default function MobileNav() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isMobile = useMobile()

  if (!isMobile) return null

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
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background">
      <div className="grid h-full grid-cols-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

