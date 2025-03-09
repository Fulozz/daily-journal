import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import CookieConsent from "@/components/cookie-consent"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col items-center">
              {children}
              <CookieConsent />
              <Toaster position="top-right" />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

