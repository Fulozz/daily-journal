import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  // If user is already logged in, redirect to dashboard
  const token = cookies().get("token")
  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple header for register page */}
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
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground">Register to start tracking your daily activities</p>
          </div>
          <RegisterForm />
          <div className="text-center text-sm">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

