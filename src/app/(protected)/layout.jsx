import { redirect } from "next/navigation"
import axios from "axios"
import Header from "@/components/layout/header"
import MobileNav from "@/components/layout/mobile-nav"
import { postAuthTokenServer } from "@/lib/api/auth-server"

export default async function ProtectedLayout({ children }) {
  // Check if user is authenticated
  const token = await postAuthTokenServer()

  if (!token) {
    redirect("/login")
  }

  // Validate token
  try {
    await axios.post("https://portfolio-backend-zpig.onrender.com/api/v1/validate-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    // If token is invalid, redirect to login
    console.error("Token validation error:", error)
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}

