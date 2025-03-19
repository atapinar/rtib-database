"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="search"
        placeholder="Search companies..."
        className="pl-10 pr-10 rounded-full border-gray-200 dark:border-gray-700 h-12 text-base"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-full"
          onClick={() => setSearchQuery("")}
        >
          <X className="h-5 w-5 text-gray-400" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}

