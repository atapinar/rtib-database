"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

// Define supported languages
type LanguageType = "en" | "tr" | "ru"

// Context type definition
type LanguageContextType = {
  language: LanguageType
  setLanguage: (language: LanguageType) => void
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
})

export const useLanguage = () => useContext(LanguageContext)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>("en")
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    // Get stored language preference from localStorage if available
    const storedLanguage = localStorage.getItem("language") as LanguageType
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "tr" || storedLanguage === "ru")) {
      setLanguage(storedLanguage)
    }
    setIsMounted(true)
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("language", language)
    }
  }, [language, isMounted])

  const handleSetLanguage = (newLanguage: LanguageType) => {
    setLanguage(newLanguage)
  }

  // Return null during server-side rendering to prevent hydration mismatch
  if (!isMounted) return <>{children}</>

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

