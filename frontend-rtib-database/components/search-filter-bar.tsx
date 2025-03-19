"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface SearchFilterBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  industries: string[]
  cities: string[]
  industryFilter: string | null
  cityFilter: string | null
  setIndustryFilter: (industry: string | null) => void
  setCityFilter: (city: string | null) => void
}

export function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  industries,
  cities,
  industryFilter,
  cityFilter,
  setIndustryFilter,
  setCityFilter,
}: SearchFilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const hasActiveFilters = industryFilter !== null || cityFilter !== null

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden sm:block">
        <FilterBar
          industries={industries}
          cities={cities}
          industryFilter={industryFilter}
          cityFilter={cityFilter}
          setIndustryFilter={setIndustryFilter}
          setCityFilter={setCityFilter}
        />
      </div>

      {/* Mobile Filter Button and Sheet */}
      <div className="sm:hidden">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`w-full flex items-center justify-center gap-2 ${hasActiveFilters ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400" : ""}`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  {(industryFilter ? 1 : 0) + (cityFilter ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl px-4 pt-6 pb-8">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-center text-xl">Filters</SheetTitle>
            </SheetHeader>
            <div className="px-1">
              <FilterBar
                industries={industries}
                cities={cities}
                industryFilter={industryFilter}
                cityFilter={cityFilter}
                setIndustryFilter={setIndustryFilter}
                setCityFilter={setCityFilter}
                isMobile={true}
              />
            </div>
            <div className="mt-8 flex justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIndustryFilter(null)
                  setCityFilter(null)
                }}
                disabled={!hasActiveFilters}
                className="flex-1 rounded-full"
              >
                Clear All
              </Button>
              <Button size="lg" onClick={() => setIsFilterOpen(false)} className="flex-1 rounded-full">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

