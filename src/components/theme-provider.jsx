"use client"

import { createContext, useContext, useEffect } from "react"

const ThemeProviderContext = createContext({})

export function ThemeProvider({ children, ...props }) {
  useEffect(() => {
    // Force dark mode only
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  // Provide a minimal context that doesn't actually change the theme
  const value = {
    theme: "dark",
    setTheme: () => {}, // No-op function
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

