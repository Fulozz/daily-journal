"use client"

import { useState, useEffect } from "react"
import { setCookie, getCookie } from "cookies-next"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export default function CookieConsent() {
  const { t, language } = useLanguage()
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = getCookie("cookies-accept")
    if (!hasAccepted) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    // Set a permanent cookie (10 years expiration)
    setCookie("cookies-accept", "true", { maxAge: 60 * 60 * 24 * 365 * 10 })
    setShowConsent(false)
  }

  if (!showConsent) return null

  const consentText = {
    "en-US":
      "By using this site, you agree to our use of cookies for analytics e personalization.",
    "pt-BR":
      "Ao usar este site, você concorda com o uso de cookies para análises e personalização.",
  }

  const buttonText = {
    "en-US": "Accept",
    "pt-BR": "Aceitar",
  }
  const closeText = {
    "en-US" : "Close",
    "pt-BR" : "Fechar"
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background border-t shadow-lg">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-center sm:text-left">{consentText[language] || consentText["en-US"]}</div>
        <div className="flex items-center gap-2">
          <Button onClick={acceptCookies} size="sm">
            {buttonText[language] || buttonText["en-US"]}
          </Button>
          <Button variant="ghost" size="icon" onClick={acceptCookies}>
            <X className="h-4 w-4" />
            <span className="sr-only">{closeText[language] || closeText["en-US"]}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

