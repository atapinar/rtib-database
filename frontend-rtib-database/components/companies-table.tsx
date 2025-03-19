"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, ExternalLink, Building, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CompanyTooltip } from "@/components/company-tooltip"
import { formatCurrency } from "@/lib/utils"
import type { Company, SortField, SortDirection } from "@/types/company"
import { industryIcons, industryColors } from "@/data/industry-config"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CompaniesTableProps {
  companies: Company[]
  sortField: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField) => void
}

export function CompaniesTable({ companies, sortField, sortDirection, onSortChange }: CompaniesTableProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const { language } = useLanguage()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Translations for table headers
  const translations = {
    en: {
      rank: "Rank",
      company: "Company",
      industry: "Industry",
      marketCap: "Market Cap",
      employees: "Employees",
      headquarters: "Headquarters",
      ceo: "CEO",
      noCompanies: "No companies found matching your criteria.",
      viewDetails: "View Details",
    },
    tr: {
      rank: "Sıralama",
      company: "Şirket",
      industry: "Sektör",
      marketCap: "Piyasa Değeri",
      employees: "Çalışan Sayısı",
      headquarters: "Merkez",
      ceo: "CEO",
      noCompanies: "Kriterlerinize uygun şirket bulunamadı.",
      viewDetails: "Detayları Görüntüle",
    },
    ru: {
      rank: "Ранг",
      company: "Компания",
      industry: "Отрасль",
      marketCap: "Рыночная Кап.",
      employees: "Сотрудники",
      headquarters: "Штаб-квартира",
      ceo: "Генеральный директор",
      noCompanies: "Не найдено компаний, соответствующих вашим критериям.",
      viewDetails: "Посмотреть детали",
    },
  }

  const t = translations[language]

  // Helper to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null

    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  // Helper to get row background class based on company status
  const getRowBackgroundClass = (company: Company) => {
    if (company.rank <= 3) return "bg-amber-50 dark:bg-amber-950/20"
    if (company.featured) return "bg-pink-50 dark:bg-pink-950/20"
    return ""
  }

  // Helper to render industry icon
  const renderIndustryIcon = (industry: string) => {
    const IconComponent = industryIcons[industry] || Building
    return <IconComponent className="mr-2 h-5 w-5 text-gray-500" />
  }

  // Helper to get industry badge color
  const getIndustryBadgeClass = (industry: string) => {
    const colorConfig = industryColors[industry] || { bg: "bg-gray-100", text: "text-gray-700" }
    return `${colorConfig.bg} ${colorConfig.text} dark:bg-opacity-20`
  }

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

  // Mobile card view for companies
  if (isMobile) {
    return (
      <div className="space-y-4">
        {companies.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            {t.noCompanies}
          </div>
        ) : (
          companies.map((company) => (
            <div
              key={company.id}
              className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden ${getRowBackgroundClass(
                company,
              )}`}
            >
              <div className="p-4">
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
                    <Badge className={`${getIndustryBadgeClass(company.industry)} font-normal mt-1`}>
                      {company.industry}
                    </Badge>
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
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {company.employees.toLocaleString()}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/company/${company.id}`}
                  className="flex items-center justify-center w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 min-h-[44px]"
                >
                  {t.viewDetails}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  // Desktop table view
  return (
    <TooltipProvider>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold -ml-3"
                    onClick={() => onSortChange("rank")}
                  >
                    {t.rank}
                    {renderSortIndicator("rank")}
                  </Button>
                </TableHead>

                <TableHead className="min-w-[200px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold -ml-3"
                    onClick={() => onSortChange("name")}
                  >
                    {t.company}
                    {renderSortIndicator("name")}
                  </Button>
                </TableHead>

                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold -ml-3"
                    onClick={() => onSortChange("industry")}
                  >
                    {t.industry}
                    {renderSortIndicator("industry")}
                  </Button>
                </TableHead>

                <TableHead className="hidden lg:table-cell text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold -ml-3"
                    onClick={() => onSortChange("marketCap")}
                  >
                    {t.marketCap}
                    {renderSortIndicator("marketCap")}
                  </Button>
                </TableHead>

                <TableHead className="hidden lg:table-cell text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold -ml-3"
                    onClick={() => onSortChange("employees")}
                  >
                    {t.employees}
                    {renderSortIndicator("employees")}
                  </Button>
                </TableHead>

                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-semibold -ml-3"
                    onClick={() => onSortChange("headquarters")}
                  >
                    {t.headquarters}
                    {renderSortIndicator("headquarters")}
                  </Button>
                </TableHead>

                <TableHead className="hidden xl:table-cell">
                  <Button variant="ghost" size="sm" className="font-semibold -ml-3" onClick={() => onSortChange("ceo")}>
                    {t.ceo}
                    {renderSortIndicator("ceo")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {t.noCompanies}
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow
                    key={company.id}
                    className={`${getRowBackgroundClass(company)} hover:bg-gray-50 dark:hover:bg-gray-700/50 table-row-hover`}
                  >
                    <TableCell className="font-medium text-center">{company.rank}</TableCell>

                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/company/${company.id}`}
                            className="flex items-center cursor-pointer mobile-touch-target"
                            onMouseEnter={() => setActiveTooltip(company.id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <div
                              className={`relative h-10 w-10 mr-3 rounded-md overflow-hidden ${getLogoBackground(
                                company.id,
                              )} flex-shrink-0`}
                            >
                              <Image
                                src={company.logoUrl || "/placeholder.svg?height=40&width=40"}
                                alt={company.name}
                                fill
                                className={`object-contain ${getLogoStyle(company.id)}`}
                                sizes="40px"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white flex items-center">
                                {renderIndustryIcon(company.industry)}
                                {company.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{company.ticker}</div>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="p-0 overflow-hidden">
                          <CompanyTooltip company={company} />
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge className={`${getIndustryBadgeClass(company.industry)} font-normal`}>
                        {company.industry}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-right font-mono">
                      {formatCurrency(company.financials.marketCap)}
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-right">
                      {company.employees.toLocaleString()}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <span>{company.headquarters.city}</span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden xl:table-cell">
                      {company.ceo ? (
                        <div className="flex items-center">
                          <a
                            href={company.ceo.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center dark:text-blue-400 mobile-touch-target"
                          >
                            {company.ceo.name}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}

