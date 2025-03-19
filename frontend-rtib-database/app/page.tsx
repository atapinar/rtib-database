"use client"

import { useState, useEffect } from "react"
import { CompaniesTable } from "@/components/companies-table"
import { SearchFilterBar } from "@/components/search-filter-bar"
import { LanguageProvider } from "@/contexts/language-context"
import { CompanyCard } from "@/components/company-card"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Company, CompanyFirestore, SortField, SortDirection } from "@/types/company"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"
import { getDocuments } from "@/lib/firebase-service" 

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState<string | null>(null)
  const [cityFilter, setCityFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { user } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  // Fetch companies from Firestore
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getDocuments<CompanyFirestore>("companies")
        
        // Transform Firestore data to match application structure
        const transformedData = data.map(item => {
          console.log("Company ID from Firestore:", item.id);
          
          // Extract city and country from hqLocation
          const locationParts = item.hqLocation?.split(',').map(part => part.trim()) || ["Unknown", "Russia"]
          const city = locationParts[0] || "Unknown"
          const country = locationParts.length > 1 ? locationParts[1] : "Russia"

          // Set default values for missing fields to prevent errors
          const company: Company = {
            id: item.id,
            name: item.companyName || "",
            industry: item.businessActivity || item.industry || "",
            description: item.registeredAddress || "",
            rank: 0,
            employees: item.numEmployees || 0,
            headquarters: {
              city,
              country
            },
            financials: {
              marketCap: item.annualRevenue || 0
            },
            ceo: {
              name: item.ceoName || "",
              linkedinUrl: ""
            },
            logoUrl: "",
            ticker: "",
            featured: false,
            website: item.website
          }
          return company
        })
        
        setCompanies(transformedData)
        setFilteredCompanies(transformedData)
      } catch (error) {
        console.error("Error fetching companies:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCompanies()
  }, [])

  // Get unique industries and cities for filters
  const industries = Array.from(new Set(companies.map((company) => company.industry).filter(Boolean)))
  const cities = Array.from(new Set(companies.map((company) => company.headquarters?.city).filter(Boolean)))

  // Handle search and filtering
  useEffect(() => {
    if (companies.length === 0) return
    
    let result = [...companies]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.industry.toLowerCase().includes(query) ||
          (company.description && company.description.toLowerCase().includes(query)),
      )
    }

    // Apply industry filter
    if (industryFilter) {
      result = result.filter((company) => company.industry === industryFilter)
    }

    // Apply city filter
    if (cityFilter) {
      result = result.filter((company) => company.headquarters.city === cityFilter)
    }

    // Apply sorting
    result = sortCompanies(result, sortField, sortDirection)

    setFilteredCompanies(result)
  }, [companies, searchQuery, industryFilter, cityFilter, sortField, sortDirection])

  // Handle sort change
  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort companies based on field and direction
  const sortCompanies = (companies: Company[], field: SortField, direction: SortDirection): Company[] => {
    return [...companies].sort((a, b) => {
      let comparison = 0

      switch (field) {
        case "rank":
          comparison = (a.rank || 0) - (b.rank || 0)
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "industry":
          comparison = (a.industry || "").localeCompare(b.industry || "")
          break
        case "marketCap":
          comparison = (a.financials?.marketCap || 0) - (b.financials?.marketCap || 0)
          break
        case "employees":
          comparison = (a.employees || 0) - (b.employees || 0)
          break
        case "headquarters":
          comparison = (a.headquarters?.city || "").localeCompare(b.headquarters?.city || "")
          break
        case "ceo":
          comparison = (a.ceo?.name || "").localeCompare(b.ceo?.name || "")
          break
        default:
          comparison = 0
      }

      return direction === "asc" ? comparison : -comparison
    })
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Main content */}
        <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-6">
            <SearchFilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              industries={industries}
              cities={cities}
              industryFilter={industryFilter}
              cityFilter={cityFilter}
              setIndustryFilter={setIndustryFilter}
              setCityFilter={setCityFilter}
            />
          </div>

          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
              Loading companies...
            </div>
          ) : isMobile ? (
            <div className="space-y-4">
              {filteredCompanies.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
                  No companies found matching your criteria.
                </div>
              ) : (
                filteredCompanies.map((company) => <CompanyCard key={company.id} company={company} />)
              )}
            </div>
          ) : (
            <CompaniesTable
              companies={filteredCompanies}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
            />
          )}

          {user?.isAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-800">Admin Access</h2>
              <p className="mb-4 text-blue-700">
                You have administrator privileges. You can manage companies and users.
              </p>
              <Link href="/admin">
                <Button className="gap-2 mb-2 w-full md:w-auto">
                  <ShieldCheck className="h-5 w-5" />
                  Go to Admin Dashboard
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </LanguageProvider>
  )
}

