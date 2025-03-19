"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Linkedin, Mail, Building2, Info, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Employee data type
export type EmployeeData = {
  id: string
  name: string
  position: string
  department: string
  company: string
  bio?: string
  imageUrl?: string
  email?: string
  linkedinUrl?: string
}

// Update the interface to accept children
interface EmployeeProfileHoverProps {
  employee: EmployeeData
  language?: "en" | "tr" | "ru"
  children?: React.ReactNode
}

// Translations
const translations = {
  en: {
    contactVia: "Contact via",
    viewProfile: "View Profile",
    noAdditionalInfo: "No additional information provided.",
    expand: "Expand Profile",
  },
  tr: {
    contactVia: "İletişim",
    viewProfile: "Profili Görüntüle",
    noAdditionalInfo: "Ek bilgi sağlanmadı.",
    expand: "Profili Genişlet",
  },
  ru: {
    contactVia: "Связаться через",
    viewProfile: "Просмотр профиля",
    noAdditionalInfo: "Дополнительная информация не предоставлена.",
    expand: "Развернуть профиль",
  },
}

// Update the component to use children as trigger if provided
export function EmployeeProfileHover({ employee, language = "en", children }: EmployeeProfileHoverProps) {
  const [isHovering, setIsHovering] = useState(false)
  const hoverRef = useRef<HTMLDivElement>(null)
  const t = translations[language]
  const router = useRouter()

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Generate a consistent profile URL
  const getProfileUrl = () => {
    // If we have an ID, use it, otherwise use the name
    if (employee.id) {
      return `/profile/employee-${employee.id}`
    }
    return `/profile/employee-${employee.name.toLowerCase().replace(/\s+/g, "-")}`
  }

  // Handle expand button click
  const handleExpand = () => {
    router.push(getProfileUrl())
  }

  // Handle click outside to close the hover card
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (hoverRef.current && !hoverRef.current.contains(event.target as Node)) {
        setIsHovering(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="inline-flex items-center relative" ref={hoverRef}>
      {children ? (
        children
      ) : (
        <button className="text-blue-600 dark:text-blue-400 hover:underline">{employee.name}</button>
      )}

      <button
        className="ml-1.5 inline-flex items-center justify-center rounded-full bg-blue-50 p-1 hover:bg-blue-100 transition-colors cursor-pointer dark:bg-blue-900/30 dark:hover:bg-blue-800/50"
        aria-label="View profile information"
        onClick={() => setIsHovering(!isHovering)}
        onMouseEnter={() => setIsHovering(true)}
      >
        <Info className="h-3 w-3 text-blue-600 dark:text-blue-400" />
      </button>

      {isHovering && (
        <div
          className="absolute top-full left-0 mt-2 w-80 rounded-md shadow-lg bg-white z-50 border border-gray-200 animate-in fade-in zoom-in-95 duration-200 dark:bg-gray-800 dark:border-gray-700"
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 border border-gray-100 dark:border-gray-700">
                {employee.imageUrl ? (
                  <AvatarImage src={employee.imageUrl} alt={employee.name} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{employee.name}</div>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{employee.position}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{employee.department}</div>
                </div>
              </div>
            </div>

            {employee.bio ? (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{employee.bio}</div>
            ) : (
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic">{t.noAdditionalInfo}</div>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {employee.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${employee.email}`}
                    className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                  >
                    {employee.email}
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                {employee.linkedinUrl && (
                  <a
                    href={employee.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">{t.contactVia} LinkedIn</span>
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-xs gap-1.5 h-8 rounded-full"
                  onClick={() => {
                    router.push(getProfileUrl())
                    setIsHovering(false)
                  }}
                >
                  {t.viewProfile}
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full gap-1.5 text-xs rounded-full"
                onClick={handleExpand}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t.expand}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

