"use client"

import { Building2, MapPin, Users, DollarSign, ExternalLink } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Company } from "@/types/company"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface CompanyTooltipProps {
  company: Company
}

export function CompanyTooltip({ company }: CompanyTooltipProps) {
  const { language } = useLanguage()

  // Translations
  const translations = {
    en: {
      employees: "employees",
      marketCap: "Market Cap:",
    },
    tr: {
      employees: "çalışan",
      marketCap: "Piyasa Değeri:",
    },
    ru: {
      employees: "сотрудников",
      marketCap: "Рыночная Кап.:",
    },
  }

  const t = translations[language]

  // Helper to get logo styling based on company ID
  const getLogoStyle = (companyId: string) => {
    switch (companyId) {
      case "1": // Isbank
        return "scale-110"
      case "2": // Turkish Airlines
        return "scale-90"
      case "3": // Ziraat Bank
        return "scale-110"
      case "6": // Beko
        return "scale-90 p-0"
      case "7": // Efes Rus
        return "scale-110"
      case "8": // Mavi
        return "scale-90"
      case "9": // Kalekim
        return "scale-90"
      case "10": // Enka
        return "scale-90"
      default:
        return ""
    }
  }

  // Helper to get background color for logo container
  const getLogoBackground = (companyId: string) => {
    switch (companyId) {
      case "6": // Beko - blue logo on white
      case "7": // Efes Rus - blue logo on white
      case "8": // Mavi - blue logo on white
      case "9": // Kalekim - black and red logo on white
        return "bg-white"
      default:
        return "bg-gray-100 dark:bg-gray-700"
    }
  }

  return (
    <div className="w-[300px] p-4 bg-white dark:bg-gray-800 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`relative h-12 w-12 rounded-md overflow-hidden ${getLogoBackground(company.id)} flex-shrink-0`}
          >
            <Image
              src={company.logoUrl || "/placeholder.svg?height=48&width=48"}
              alt={company.name}
              fill
              className={`object-contain ${getLogoStyle(company.id)}`}
              sizes="48px"
            />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{company.name}</h3>
        </div>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{company.description}</p>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Building2 className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">{company.industry}</span>
        </div>

        <div className="flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">
            {company.headquarters.city}, {company.headquarters.country}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">
            {company.employees.toLocaleString()} {t.employees}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">
            {t.marketCap} {formatCurrency(company.financials.marketCap)}
          </span>
        </div>
      </div>
    </div>
  )
}

