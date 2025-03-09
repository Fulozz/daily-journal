"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import MainNav from "@/components/layout/main-nav"
import UserNav from "@/components/layout/user-nav"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center mr-6">
          <BookOpen className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">Daily Journal</span>
        </Link>
        {!isMobile && <MainNav />}
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

