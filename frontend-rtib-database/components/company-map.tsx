"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import Image from "next/image"

interface CompanyMapProps {
  address: string
  employees?: number
  language?: "en" | "tr" | "ru"
}

const translations = {
  en: {
    offices: "Offices",
    employees: "people",
    headquarters: "HQ",
  },
  tr: {
    offices: "Ofisler",
    employees: "çalışan",
    headquarters: "Merkez",
  },
  ru: {
    offices: "Офисы",
    employees: "сотрудников",
    headquarters: "Штаб-квартира",
  },
}

export function CompanyMap({ address, employees, language = "en" }: CompanyMapProps) {
  const t = translations[language]

  // Extract city from address for simplified display
  const city = address.split(",")[0].trim()

  return (
    <Card className="mt-6 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {t.offices}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[400px] w-full">
          {/* Static map image with object-cover to ensure full coverage */}
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-13%20at%2019.06.42-WljufhNu0YgAIyRDGalQaOMGZTiNqy.png"
              alt="Map"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {/* Office marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg dark:bg-gray-700">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="mt-2 rounded-lg bg-white px-3 py-2 text-center shadow-md dark:bg-gray-800 dark:text-gray-200">
                <div className="font-medium">{t.headquarters}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{city}</div>
                {employees && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {employees} {t.employees}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

