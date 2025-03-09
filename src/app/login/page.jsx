import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import LoginForm from "@/components/auth/login-form"
import { isAuthenticatedServer } from "@/lib/api/auth-server"

export default async function LoginPage() {
  // If user is already logged in, redirect to dashboard
  const isAuthenticated = await isAuthenticatedServer()
  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header for login page */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">Daily Journal</span>
          </Link>
        </div>
      </header>

      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Login to access your personal diary and to-do list</p>
          </div>
          <LoginForm />
          <div className="text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

