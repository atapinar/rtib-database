"use client"

import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FilterBarProps {
  industries: string[]
  cities: string[]
  industryFilter: string | null
  cityFilter: string | null
  setIndustryFilter: (industry: string | null) => void
  setCityFilter: (city: string | null) => void
  isMobile?: boolean
}

export function FilterBar({
  industries,
  cities,
  industryFilter,
  cityFilter,
  setIndustryFilter,
  setCityFilter,
  isMobile = false,
}: FilterBarProps) {
  const clearFilters = () => {
    setIndustryFilter(null)
    setCityFilter(null)
  }

  const hasActiveFilters = industryFilter !== null || cityFilter !== null

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="industry-mobile" className="text-base font-medium">
            Industry
          </Label>
          <Select value={industryFilter || ""} onValueChange={(value) => setIndustryFilter(value || null)}>
            <SelectTrigger id="industry-mobile" className="w-full h-12 text-base">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry} className="py-3">
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="city-mobile" className="text-base font-medium">
            City
          </Label>
          <Select value={cityFilter || ""} onValueChange={(value) => setCityFilter(value || null)}>
            <SelectTrigger id="city-mobile" className="w-full h-12 text-base">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city} className="py-3">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center">
        <Filter className="mr-2 h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter:</span>
      </div>

      <Select value={industryFilter || ""} onValueChange={(value) => setIndustryFilter(value || null)}>
        <SelectTrigger className="w-[180px] h-9 text-sm">
          <SelectValue placeholder="Industry" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Industries</SelectItem>
          {industries.map((industry) => (
            <SelectItem key={industry} value={industry}>
              {industry}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={cityFilter || ""} onValueChange={(value) => setCityFilter(value || null)}>
        <SelectTrigger className="w-[180px] h-9 text-sm">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
          Clear Filters
        </Button>
      )}
    </div>
  )
}

