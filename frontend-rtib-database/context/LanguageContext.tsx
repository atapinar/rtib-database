"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

// Define supported languages
export type Language = "en" | "tr" | "ru"

// Context type definition
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // English translations
    "company.type": "Company Type",
    "company.established": "Established",
    "company.status": "Status",
    "company.contact": "Contact",
    "company.address": "Address in Russia",
    "company.overview": "Company Overview",
    "company.financials": "Financials",
    "company.subsidiaries": "Subsidiaries",
    "company.documents": "Documents",
    // Add more translations as needed
  },
  tr: {
    // Turkish translations
    "company.type": "Şirket Türü",
    "company.established": "Kuruluş",
    "company.status": "Durum",
    "company.contact": "İletişim",
    "company.address": "Rusya'daki Adres",
    "company.overview": "Şirket Genel Bakışı",
    "company.financials": "Finansal Bilgiler",
    "company.subsidiaries": "Bağlı Kuruluşlar",
    "company.documents": "Belgeler",
    // Add more translations as needed
  },
  ru: {
    // Russian translations
    "company.type": "Тип компании",
    "company.established": "Основана",
    "company.status": "Статус",
    "company.contact": "Контакт",
    "company.address": "Адрес в России",
    "company.overview": "Обзор компании",
    "company.financials": "Финансы",
    "company.subsidiaries": "Дочерние компании",
    "company.documents": "Документы",
    // Add more translations as needed
  },
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage if available, otherwise use browser language or default to English
  const [language, setLanguageState] = useState<Language>("en")
  const router = useRouter()
  const pathname = usePathname()

  // Initialize language on client-side
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language
    if (storedLanguage && ["en", "tr", "ru"].includes(storedLanguage)) {
      setLanguageState(storedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0] as Language
      const defaultLang = ["en", "tr", "ru"].includes(browserLang) ? browserLang : "en"
      setLanguageState(defaultLang)
      localStorage.setItem("language", defaultLang)
    }
  }, [])

  // Set language and store in localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)

    // Optional: Add URL-based language switching if needed
    // This would change the URL to include the language, e.g., /en/company/1
    // router.push(`/${lang}${pathname.replace(/^\/(en|tr|ru)/, '')}`)
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext)

