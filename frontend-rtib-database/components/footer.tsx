"use client"

import { useLanguage } from "@/context/LanguageContext"
import Image from "next/image"

export function Footer() {
  const { language } = useLanguage()

  // Translations for the footer
  const translations = {
    en: {
      allRightsReserved: "© 2025 RTIB Database. All rights reserved.",
    },
    tr: {
      allRightsReserved: "© 2025 RTIB Veritabanı. Tüm hakları saklıdır.",
    },
    ru: {
      allRightsReserved: "© 2025 База данных RTIB. Все права защищены.",
    },
  }

  const t = translations[language]

  return (
    <footer className="border-t border-gray-200 bg-white py-4">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RTIB%20Logo.jpg-exbo6COsGsmVxstkJYYGib8QO6aoJ3.jpeg"
            alt="RTIB Logo"
            width={80}
            height={96}
            className="h-auto w-20 mb-2"
          />
          <div className="text-sm text-gray-500 text-center">
            <p>{t.allRightsReserved}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

