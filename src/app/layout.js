import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import CookieConsent from "@/components/cookie-consent"
import "./globals.css"
import InstallBanner from "@/components/layout/install-banner"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href='/manifest.json' />
      </head>
      <body className={inter.className} cz-shortcut-listen="true">
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col items-center">
              {children}
              <CookieConsent />
              <Toaster position="top-right" />
            </div>
            <InstallBanner />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

