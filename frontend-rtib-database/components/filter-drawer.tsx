"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeFilters: {
    sectors: string[]
    locations: string[]
    years: string[]
  }
  setActiveFilters: React.Dispatch<
    React.SetStateAction<{
      sectors: string[]
      locations: string[]
      years: string[]
    }>
  >
}

// Filter options
const sectors = ["Banking", "Manufacturing", "Retail", "Construction", "Energy", "Technology", "Textile"]
const locations = ["Moscow", "St. Petersburg", "Kazan", "Sochi", "Novosibirsk"]
const years = ["1990-2000", "2001-2010", "2011-2020", "2021-present"]

export function FilterDrawer({ isOpen, onClose, activeFilters, setActiveFilters }: FilterDrawerProps) {
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

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      sectors: [],
      locations: [],
      years: [],
    })
  }

  // Check if a filter is active
  const isFilterActive = (category: keyof typeof activeFilters, value: string) => {
    return activeFilters[category].includes(value)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-md sm:max-w-lg">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-xl">Filter Companies</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Sector filters */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Sector</h3>
              {activeFilters.sectors.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => clearCategoryFilters("sectors")}
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {sectors.map((sector) => (
                <div key={sector} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sector-${sector}`}
                    checked={isFilterActive("sectors", sector)}
                    onCheckedChange={() => toggleFilter("sectors", sector)}
                  />
                  <Label htmlFor={`sector-${sector}`} className="text-sm">
                    {sector}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Location filters */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Location</h3>
              {activeFilters.locations.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => clearCategoryFilters("locations")}
                >
                  Clear
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={isFilterActive("locations", location)}
                    onCheckedChange={() => toggleFilter("locations", location)}
                  />
                  <Label htmlFor={`location-${location}`} className="text-sm">
                    {location}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Year filters */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Established</h3>
              {activeFilters.years.length > 0 && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => clearCategoryFilters("years")}>
                  Clear
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {years.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={isFilterActive("years", year)}
                    onCheckedChange={() => toggleFilter("years", year)}
                  />
                  <Label htmlFor={`year-${year}`} className="text-sm">
                    {year}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={clearAllFilters}>
            Clear All
          </Button>
          <Button onClick={onClose}>Apply Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

