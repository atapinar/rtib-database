"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Linkedin, Mail, Clock, Info, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

// CEO data type
export type CEOData = {
  name: string
  position: string
  company: string
  bio?: string
  imageUrl?: string
  email?: string
  linkedinUrl?: string
  timeline?: Array<{
    position: string
    company?: string
    startDate: string
    endDate?: string
  }>
}

interface CEOProfileHoverProps {
  ceo: CEOData
  language?: "en" | "tr" | "ru"
}

// Translations
const translations = {
  en: {
    viewTimeline: "View Timeline",
    timeline: "Timeline",
    present: "present",
    contactVia: "Contact via",
    expand: "Expand Profile",
    viewFullProfile: "View full profile",
  },
  tr: {
    viewTimeline: "Zaman Çizelgesini Görüntüle",
    timeline: "Zaman Çizelgesi",
    present: "günümüz",
    contactVia: "İletişim",
    expand: "Profili Genişlet",
    viewFullProfile: "Tam profili görüntüle",
  },
  ru: {
    viewTimeline: "Просмотр Хронологии",
    timeline: "Хронология",
    present: "настоящее время",
    contactVia: "Связаться через",
    expand: "Развернуть профиль",
    viewFullProfile: "Посмотреть полный профиль",
  },
}

export function CEOProfileHover({ ceo, language = "en" }: CEOProfileHoverProps) {
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const hoverRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const t = translations[language]

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Generate profile URL - ensure it's consistent with how we look up profiles
  const getProfileUrl = () => {
    // Use a consistent format for the profile URL
    return `/profile/ceo-${ceo.name.toLowerCase().replace(/\s+/g, "-")}`
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
      <button className="font-medium text-blue-600 dark:text-blue-400 hover:underline">{ceo.name}</button>

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
                {ceo.imageUrl ? (
                  <AvatarImage src={ceo.imageUrl} alt={ceo.name} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {getInitials(ceo.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{ceo.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {ceo.position} at {ceo.company}
                </div>
              </div>
            </div>

            {ceo.bio && <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{ceo.bio}</div>}

            <div className="mt-4 flex flex-col gap-2">
              {ceo.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${ceo.email}`}
                    className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                  >
                    {ceo.email}
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                {ceo.linkedinUrl && (
                  <a
                    href={ceo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">{t.contactVia} LinkedIn</span>
                  </a>
                )}
                {ceo.timeline && ceo.timeline.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5 h-8 rounded-full"
                    onClick={() => {
                      setTimelineOpen(true)
                      setIsHovering(false)
                    }}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    {t.viewTimeline}
                  </Button>
                )}
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

      {/* Timeline Dialog */}
      <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t.timeline}</DialogTitle>
            <DialogClose className="absolute right-4 top-4" />
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {ceo.timeline?.map((item, index) => (
              <div key={index} className="relative pl-6 pb-4">
                {/* Timeline connector */}
                {index < (ceo.timeline?.length || 0) - 1 && (
                  <div className="absolute left-[9px] top-2 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700" />
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="absolute left-0 rounded-full w-[18px] h-[18px] border-2 border-blue-600 bg-white dark:bg-gray-900 dark:border-blue-500" />
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.position}</div>
                  </div>
                  {item.company && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 ml-3">{item.company}</div>
                  )}
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-3">
                    {item.startDate} - {item.endDate || t.present}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

