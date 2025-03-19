"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Building, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Company {
  id: string
  name: string
  sector: string
  description: string
  location: string
  established: string
  employees: number
  website?: string
  logoUrl: string
}

interface CompanyListViewProps {
  companies: Company[]
}

export function CompanyListView({ companies }: CompanyListViewProps) {
  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div
          key={company.id}
          className="flex flex-col sm:flex-row gap-6 rounded-xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <Image
              src={company.logoUrl || "/placeholder.svg"}
              alt={company.name}
              fill
              className="object-contain p-2"
              sizes="96px"
            />
          </div>

          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{company.name}</h2>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {company.sector}
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-600 line-clamp-2 dark:text-gray-300">{company.description}</p>

            <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{company.location}</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Building className="mr-2 h-4 w-4" />
                <span>{company.employees} employees</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Est. {company.established}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/companies/${company.id}`}>View Details</Link>
              </Button>

              {company.website && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => window.open(company.website, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Visit website</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export type { Company }

