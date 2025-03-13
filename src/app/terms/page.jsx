"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function TermsPage() {
  const { t } = useLanguage()
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
      {/* Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">Daily Journal</span>
          </Link>
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("backToHome")}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container py-12 bg-background">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
            <p>Last Updated: March 8, 2025</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Daily Journal service, you agree to be bound by these Terms of Service. If you
              do not agree to these terms, please do not use our service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Daily Journal provides a platform for users to create and manage personal journal entries and tasks. We
              reserve the right to modify, suspend, or discontinue any aspect of the service at any time.
            </p>

            <h2>3. User Accounts</h2>
            <p>
              To use certain features of our service, you must register for an account. You are responsible for
              maintaining the confidentiality of your account information and for all activities that occur under your
              account.
            </p>

            <h2>4. User Content</h2>
            <p>
              You retain all rights to the content you post on Daily Journal. By posting content, you grant us a
              non-exclusive, worldwide, royalty-free license to use, reproduce, and display your content in connection
              with providing and improving our service.
            </p>

            <h2>5. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with the operation of the service</li>
              <li>Attempt to gain unauthorized access to the service</li>
            </ul>

            <h2>6. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct
              that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>

            <h2>7. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without warranties of any kind, either express or implied. We do not
              warrant that the service will be uninterrupted or error-free.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall Daily Journal be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of or related to your use of the service.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will provide notice of significant
              changes by posting the new terms on our website.
            </p>

            <h2>10. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by the laws of the jurisdiction in which we operate, without
              regard to its conflict of law provisions.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at
              support@dailyjournal.example.com.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t("allRightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm font-medium underline-offset-4 hover:underline">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="text-sm font-medium underline-offset-4 hover:underline">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

