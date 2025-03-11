"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle, Clock, Moon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export default function LandingPage() {
  const { t, language, changeLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col dark">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">Daily Journal</span>
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => changeLanguage(language === "en-US" ? "pt-BR" : "en-US")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {language === "en-US" ? "PT" : "EN"}
            </button>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {t("login")}
            </Link>
            <Link href="/register">
              <Button>{t("register")}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {t("personalJournal")}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  {t("organizeThoughts")}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-1.5">
                    {t("startForFree")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    {t("signIn")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-muted border shadow-xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-sm space-y-4 p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{t("todaysJournal")}</h3>
                      <p className="text-sm text-muted-foreground">Monday, March 8</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{t("completedProject")}</p>
                          <p className="text-sm text-muted-foreground">{t("finishedAhead")}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{t("scheduleTeam")}</p>
                          <p className="text-sm text-muted-foreground">{t("forNextSprint")}</p>
                        </div>
                      </div>
                      <div className="h-20 w-full rounded-md border border-dashed flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">{t("addNewEntry")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-accent/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm">{t("features")}</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t("everythingYouNeed")}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("appCombines")}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
              <div className="rounded-full bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("dailyJournal")}</h3>
              <p className="text-center text-muted-foreground">
                {t("recordThoughts")}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("taskManagement")}</h3>
              <p className="text-center text-muted-foreground">
                {t("createOrganize")}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
              <div className="flex rounded-full bg-primary/10 p-3">
                <Moon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{t("darkMode")}</h3>
              <p className="text-center text-muted-foreground">
                {t("customizeExperience")}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
              <div className="rounded-full bg-primary/10 p-3">
                <span className="text-primary text-xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold">{t("multilingual")}</h3>
              <p className="text-center text-muted-foreground">
                {t("useAppIn")}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">{t("securePrivate")}</h3>
              <p className="text-center text-muted-foreground">
                {t("yourDataProtected")}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm bg-background">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">{t("freeToUse")}</h3>
              <p className="text-center text-muted-foreground">
                {t("getStartedFree")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm">{t("testimonials")}</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t("whatUsersSay")}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("dontJustTake")}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm bg-card">
              <div className="space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-500"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "{t("testimonial1")}"
                </p>
              </div>
              <div className="mt-6 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-accent"></div>
                <div>
                  <p className="font-medium">{t("sarahJohnson")}</p>
                  <p className="text-sm text-muted-foreground">{t("productDesigner")}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-border p-6 shadow-sm bg-card">
              <div className="space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-500"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "{t("testimonial2")}"
                </p>
              </div>
              <div className="mt-6 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-accent"></div>
                <div>
                  <p className="font-medium">{t("carlosMendes")}</p>
                  <p className="text-sm text-muted-foreground">{t("softwareEngineer")}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-500"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "{t("testimonial3")}"
                </p>
              </div>
              <div className="mt-6 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-accent"></div>
                <div>
                  <p className="font-medium">{t("emilyChen")}</p>
                  <p className="text-sm text-muted-foreground">{t("contentCreator")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t("readyToGetStarted")}</h2>
              <p className="max-w-[600px] text-primary-foreground/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("joinThousands")}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-1.5">
                  {t("createFreeAccount")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 md:py-0 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
