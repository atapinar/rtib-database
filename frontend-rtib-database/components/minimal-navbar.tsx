"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Filter, X, Grid, List, PlusCircle, Globe, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilterMenu } from "@/components/filter-menu"
import { useLanguage, type Language } from "@/contexts/language-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AddCompanyModal } from "@/components/add-company-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MinimalNavbarProps {
  onSearch: (query: string) => void
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
  viewMode: "card" | "list"
  setViewMode: (mode: "card" | "list") => void
  onAddCompany: (formData: any) => void
}

export function MinimalNavbar({
  onSearch,
  activeFilters,
  setActiveFilters,
  viewMode,
  setViewMode,
  onAddCompany,
}: MinimalNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { language, setLanguage } = useLanguage()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    onSearch("")
    setSearchOpen(false)
  }

  // Toggle filter menu
  const toggleFilter = () => {
    setFilterOpen(!filterOpen)
  }

  // Close filter menu
  const closeFilter = () => {
    setFilterOpen(false)
  }

  // Toggle view mode
  const toggleViewMode = () => {
    const newMode = viewMode === "card" ? "list" : "card"
    setViewMode(newMode)
    // Save preference to localStorage
    localStorage.setItem("viewMode", newMode)
  }

  // Handle adding a new company
  const handleAddCompany = (formData: any) => {
    // Generate a new ID (in a real app, this would come from the database)
    const newId = (Math.floor(Math.random() * 1000) + 10).toString()

    // Create a new company object with the form data
    const newCompany = {
      id: newId,
      sirket_adi: formData.name,
      logoUrl: "/placeholder.svg?height=80&width=80", // Placeholder logo
      sektor: formData.sector,
      faaliyet_alani: formData.sector,
      sirket_turu: formData.type,
      kurulus_yili: formData.established,
      status: "Active",
      rusya_adres: formData.address,
      color: "blue",
      web_sitesi: formData.website || "",
      sirket_ana_ortagi: formData.mainShareholder || "",
      rusya_yatirim: formData.investment ? Number.parseFloat(formData.investment) : 0,
      ciro: formData.revenue ? Number.parseFloat(formData.revenue) : 0,
      ithalat_hacmi: formData.importVolume ? Number.parseFloat(formData.importVolume) : 0,
      ihracat_hacmi: formData.exportVolume ? Number.parseFloat(formData.exportVolume) : 0,
      calisan_sayisi: formData.employees ? Number.parseInt(formData.employees) : 0,
      istirakler: formData.subsidiaries ? formData.subsidiaries.split(",").map((s: string) => s.trim()) : [],
    }

    // Add the new company to the companies list
    onAddCompany(newCompany)

    // Close the modal
    setIsAddCompanyModalOpen(false)

    // Redirect to the new company page
    // Note: In a real app, you would use router.push here
    setTimeout(() => {
      window.location.href = `/company/${newId}`
    }, 500)
  }

  // Language options
  const languages = [
    { code: "en", name: "English" },
    { code: "tr", name: "Türkçe" },
    { code: "ru", name: "Русский" },
  ]

  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  // Translations
  const translations = {
    en: {
      searchPlaceholder: "Search companies...",
      cardView: "Card View",
      listView: "List View",
      filter: "Filter",
      search: "Search",
      submitCompany: "Submit Company",
      language: "Language",
      theme: "Theme",
      menu: "Menu",
    },
    tr: {
      searchPlaceholder: "Şirket ara...",
      cardView: "Kart Görünümü",
      listView: "Liste Görünümü",
      filter: "Filtre",
      search: "Ara",
      submitCompany: "Şirket Ekle",
      language: "Dil",
      theme: "Tema",
      menu: "Menü",
    },
    ru: {
      searchPlaceholder: "Поиск компаний...",
      cardView: "Карточный вид",
      listView: "Вид списка",
      filter: "Фильтр",
      search: "Поиск",
      submitCompany: "Добавить компанию",
      language: "Язык",
      theme: "Тема",
      menu: "Меню",
    },
  }

  const t = translations[language]

  // Mobile view
  if (isMobile) {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm dark:bg-gray-900/80 dark:border-gray-800">
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            {/* Left side - Logo or title */}
            <div className="text-lg font-semibold">RTIB Database</div>

            {/* Right side - controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="animate-in fade-in slide-in-from-right-5 duration-200">
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-[200px] pr-8 h-9 rounded-full bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">{t.search}</span>
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">{t.menu}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <div className="flex flex-col gap-4 py-4">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        toggleViewMode()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      {viewMode === "card" ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
                      {viewMode === "card" ? t.listView : t.cardView}
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        setIsAddCompanyModalOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t.submitCompany}
                    </Button>

                    <div className="py-2">
                      <h3 className="mb-2 text-sm font-medium">{t.language}</h3>
                      <div className="space-y-2">
                        {languages.map((lang) => (
                          <Button
                            key={lang.code}
                            variant={language === lang.code ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleLanguageChange(lang.code as Language)}
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            {lang.name}
                            {language === lang.code && <Check className="ml-auto h-4 w-4" />}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="py-2">
                      <h3 className="mb-2 text-sm font-medium">{t.theme}</h3>
                      <ThemeSwitcher variant="menu" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Add Company Modal */}
        <AddCompanyModal
          isOpen={isAddCompanyModalOpen}
          onClose={() => setIsAddCompanyModalOpen(false)}
          onSubmit={handleAddCompany}
          language={language}
        />
      </TooltipProvider>
    )
  }

  // Desktop view
  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          {/* Left side - empty for now */}
          <div></div>

          {/* Right side - controls */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <ThemeSwitcher variant="icon" size="sm" />

            {/* Language Switcher */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
                      <Globe className="h-4 w-4" />
                      <span className="sr-only">{t.language}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[150px]">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as Language)}
                        className="flex items-center justify-between"
                      >
                        <span>{lang.name}</span>
                        {language === lang.code && <Check className="h-4 w-4 ml-2" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t.language}</TooltipContent>
            </Tooltip>

            {/* Submit Company Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsAddCompanyModalOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">{t.submitCompany}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t.submitCompany}</TooltipContent>
            </Tooltip>

            {/* View Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0" onClick={toggleViewMode}>
                  {viewMode === "card" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  <span className="sr-only">{viewMode === "card" ? t.listView : t.cardView}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{viewMode === "card" ? t.listView : t.cardView}</TooltipContent>
            </Tooltip>

            {/* Search */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="animate-in fade-in slide-in-from-right-5 duration-200">
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-[200px] sm:w-[300px] pr-8 h-9 rounded-full bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 rounded-full p-0"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-4 w-4" />
                      <span className="sr-only">{t.search}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{t.search}</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Filter */}
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={filterOpen ? "secondary" : "ghost"}
                    size="sm"
                    className="h-9 w-9 rounded-full p-0"
                    onClick={toggleFilter}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">{t.filter}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t.filter}</TooltipContent>
              </Tooltip>

              {filterOpen && (
                <FilterMenu
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  onClose={closeFilter}
                  language={language}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
        onSubmit={handleAddCompany}
        language={language}
      />
    </TooltipProvider>
  )
}

