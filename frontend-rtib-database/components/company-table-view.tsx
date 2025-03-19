"use client"

import { useRouter } from "next/navigation"
import { MapPin, TrendingUp, DollarSign } from "lucide-react"
import Image from "next/image"
import { CEOProfileHover } from "@/components/ceo-profile-hover"
import { ceoData } from "@/lib/ceo-data"
import { formatCurrency } from "@/lib/utils"

interface Company {
  id: string
  sirket_adi: string
  logoUrl: string
  sektor: string
  faaliyet_alani: string
  sirket_turu: string
  kurulus_yili: string
  status: string
  rusya_adres: string
  color: string
  rtib_kisi_ad: string
  rtib_kisi_pozisyon: string
  rtib_kisi_eposta: string
  rtib_kisi_telefon?: string
  telefon?: string
  eposta?: string
  web_sitesi?: string
  genel_mudur?: string
  genel_mudur_dogum_tarihi?: string
  sirket_ana_ortagi?: string
  rusya_yatirim?: number
  ciro?: number
  ithalat_hacmi?: number
  ihracat_hacmi?: number
  calisan_sayisi?: number
  istirakler?: string[]
}

interface CompanyTableViewProps {
  companies: Company[]
  language: "en" | "tr" | "ru"
}

export function CompanyTableView({ companies, language }: CompanyTableViewProps) {
  const router = useRouter()

  // Translations
  const translations = {
    en: {
      company: "Company",
      sector: "Sector",
      investment: "Investment",
      revenue: "Revenue",
      location: "Location",
      ceo: "CEO",
    },
    tr: {
      company: "Şirket",
      sector: "Sektör",
      investment: "Yatırım",
      revenue: "Gelir",
      location: "Konum",
      ceo: "CEO",
    },
    ru: {
      company: "Компания",
      sector: "Сектор",
      investment: "Инвестиции",
      revenue: "Доход",
      location: "Местоположение",
      ceo: "Генеральный директор",
    },
  }

  const t = translations[language]

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="col-span-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t.company}</div>
        <div className="col-span-2 text-xs font-medium text-gray-500">{t.sector}</div>
        <div className="col-span-2 text-xs font-medium text-gray-500">{t.investment}</div>
        <div className="col-span-2 text-xs font-medium text-gray-500">{t.revenue}</div>
        <div className="col-span-2 text-xs font-medium text-gray-500">{t.location}</div>
        <div className="col-span-1 text-xs font-medium text-gray-500">{t.ceo}</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {companies.map((company) => (
          <div
            key={company.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-800/70"
            onClick={() => router.push(`/company/${company.id}`)}
          >
            {/* Company */}
            <div className="col-span-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={company.logoUrl || "/placeholder.svg"}
                    alt={company.sirket_adi}
                    fill
                    className={`object-contain p-1 ${
                      company.id === "6" ? "scale-150" : company.id === "5" ? "scale-125" : ""
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{company.sirket_adi}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {company.id === "1"
                      ? "АО ИШБАНК"
                      : company.id === "2"
                        ? "АО ЗИРААТ БАНК"
                        : company.id === "3"
                          ? "АО ДЕНИЗБАНК"
                          : company.id === "4"
                            ? "ООО БЕКО"
                            : company.id === "5"
                              ? "МАВИ"
                              : company.id === "6"
                                ? "РУСДЖАМ"
                                : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Sector */}
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-gray-600">{company.sektor}</span>
            </div>

            {/* Investment */}
            <div className="col-span-2 flex items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-sm text-gray-600">
                  {company.rusya_yatirim ? formatCurrency(company.rusya_yatirim) : "-"}
                </span>
              </div>
            </div>

            {/* Revenue */}
            <div className="col-span-2 flex items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-sm text-gray-600">
                  {company.ciro ? formatCurrency(company.ciro) : "-"}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="col-span-2 flex items-center">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{company.rusya_adres.split(",")[0]}</span>
              </div>
            </div>

            {/* CEO */}
            <div className="col-span-1 flex items-center">
              {company.genel_mudur && ceoData[company.genel_mudur] ? (
                <CEOProfileHover ceo={ceoData[company.genel_mudur]} language={language} />
              ) : (
                <span className="text-sm text-gray-600">{company.genel_mudur || "-"}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

