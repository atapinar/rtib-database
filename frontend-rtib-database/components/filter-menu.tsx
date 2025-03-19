"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type FilterMenuProps = {
  activeFilters: {
    sectors: string[]
    types: string[]
    years: string[]
    statuses: string[]
  }
  setActiveFilters: React.Dispatch<
    React.SetStateAction<{
      sectors: string[]
      types: string[]
      years: string[]
      statuses: string[]
    }>
  >
  onClose: () => void
  language?: "en" | "tr" | "ru"
}

export function FilterMenu({ activeFilters, setActiveFilters, onClose, language = "en" }: FilterMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Toggle filter selection
  const toggleFilter = (category: keyof typeof activeFilters, value: string) => {
    setActiveFilters((prev) => {
      const currentFilters = [...prev[category]]

      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [category]: currentFilters.filter((item) => item !== value),
        }
      } else {
        return {
          ...prev,
          [category]: [...currentFilters, value],
        }
      }
    })
  }

  // Clear filters for a specific category
  const clearCategoryFilters = (category: keyof typeof activeFilters) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: [],
    }))
  }

  // Check if a filter is active
  const isFilterActive = (category: keyof typeof activeFilters, value: string) => {
    return activeFilters[category].includes(value)
  }

  // Translations
  const translations = {
    en: {
      filterCompanies: "Filter Companies",
      sector: "Sector",
      companyType: "Company Type",
      established: "Established",
      status: "Status",
      clear: "Clear",
      applyFilters: "Apply Filters",
    },
    tr: {
      filterCompanies: "Şirketleri Filtrele",
      sector: "Sektör",
      companyType: "Şirket Türü",
      established: "Kuruluş Yılı",
      status: "Durum",
      clear: "Temizle",
      applyFilters: "Filtreleri Uygula",
    },
    ru: {
      filterCompanies: "Фильтр компаний",
      sector: "Сектор",
      companyType: "Тип компании",
      established: "Год основания",
      status: "Статус",
      clear: "Очистить",
      applyFilters: "Применить фильтры",
    },
  }

  const t = translations[language]

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 z-50 w-[320px] animate-in fade-in slide-in-from-top-5 rounded-xl border border-gray-100 bg-white p-4 shadow-lg dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium dark:text-gray-200">{t.filterCompanies}</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Sector filters */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.sector}</h4>
          {activeFilters.sectors.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 dark:text-gray-400"
              onClick={() => clearCategoryFilters("sectors")}
            >
              {t.clear}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <Badge
              key={sector}
              variant="outline"
              className={`cursor-pointer rounded-full px-3 py-1 text-xs ${
                isFilterActive("sectors", sector)
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
              }`}
              onClick={() => toggleFilter("sectors", sector)}
            >
              {sector}
            </Badge>
          ))}
        </div>
      </div>

      {/* Company Type filters */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.companyType}</h4>
          {activeFilters.types.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 dark:text-gray-400"
              onClick={() => clearCategoryFilters("types")}
            >
              {t.clear}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {companyTypes.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className={`cursor-pointer rounded-full px-3 py-1 text-xs ${
                isFilterActive("types", type)
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
              }`}
              onClick={() => toggleFilter("types", type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Establishment Year filters */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.established}</h4>
          {activeFilters.years.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 dark:text-gray-400"
              onClick={() => clearCategoryFilters("years")}
            >
              {t.clear}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={`year-${year}`}
                checked={isFilterActive("years", year)}
                onCheckedChange={() => toggleFilter("years", year)}
              />
              <Label htmlFor={`year-${year}`} className="text-xs dark:text-gray-300">
                {year}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Status filters */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.status}</h4>
          {activeFilters.statuses.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 dark:text-gray-400"
              onClick={() => clearCategoryFilters("statuses")}
            >
              {t.clear}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Badge
              key={status}
              variant="outline"
              className={`cursor-pointer rounded-full px-3 py-1 text-xs ${
                isFilterActive("statuses", status)
                  ? status === "Active"
                    ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                    : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
              }`}
              onClick={() => toggleFilter("statuses", status)}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button size="sm" className="rounded-full bg-blue-500 hover:bg-blue-600" onClick={onClose}>
          {t.applyFilters}
        </Button>
      </div>
    </div>
  )
}

// Updated filter options based on the new company data
const sectors = ["Banking", "Electronics", "Textile", "Construction", "Manufacturing"]

const companyTypes = ["JSC", "LLC", "Public", "Private"]

const years = ["1863", "1924", "1938", "1955", "1991", "1995"]

const statuses = ["Active", "Pending", "Inactive"]

