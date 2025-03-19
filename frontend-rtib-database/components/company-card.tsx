"use client"

import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { industryColors } from "@/data/industry-config"
import type { Company } from "@/types/company"
import { useLanguage } from "@/contexts/language-context"

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { language } = useLanguage()

  // Translations
  const translations = {
    en: {
      industry: "Industry",
      headquarters: "Headquarters",
      marketCap: "Market Cap",
      employees: "Employees",
      viewDetails: "View Details",
    },
    tr: {
      industry: "Sektör",
      headquarters: "Merkez",
      marketCap: "Piyasa Değeri",
      employees: "Çalışan Sayısı",
      viewDetails: "Detayları Görüntüle",
    },
    ru: {
      industry: "Отрасль",
      headquarters: "Штаб-квартира",
      marketCap: "Рыночная Кап.",
      employees: "Сотрудники",
      viewDetails: "Посмотреть детали",
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

  // Helper to get industry badge color
  const getIndustryBadgeClass = (industry: string) => {
    // Check if this industry exists in our config
    const isKnownIndustry = industry in industryColors;
    
    // Default colors if not found
    const defaultColors = { bg: "bg-gray-100", text: "text-gray-700" };
    
    // Use industry colors if known, otherwise use default
    const colorConfig = isKnownIndustry 
      ? industryColors[industry as keyof typeof industryColors] 
      : defaultColors;
      
    return `${colorConfig.bg} ${colorConfig.text} dark:bg-opacity-20`;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div
              className={`relative h-12 w-12 mr-3 rounded-md overflow-hidden ${getLogoBackground(
                company.id,
              )} flex-shrink-0`}
            >
              <Image
                src={company.logoUrl || "/placeholder.svg?height=48&width=48"}
                alt={company.name}
                fill
                className={`object-contain ${getLogoStyle(company.id)}`}
                sizes="48px"
              />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{company.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{company.ticker}</div>
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">#{company.rank}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.industry}</div>
            <Badge className={`${getIndustryBadgeClass(company.industry)} font-normal mt-1`}>{company.industry}</Badge>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.headquarters}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{company.headquarters.city}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.marketCap}</div>
            <div className="text-sm font-mono text-gray-700 dark:text-gray-300 mt-1">
              {formatCurrency(company.financials.marketCap)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.employees}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{company.employees.toLocaleString()}</div>
          </div>
        </div>

        <Link
          href={`/company/${company.id}`}
          className="flex items-center justify-center w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          {t.viewDetails}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}

