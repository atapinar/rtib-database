"use client"

import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage, type Language } from "@/contexts/language-context"

interface LanguageSelectorProps {
  variant?: "icon" | "button"
  size?: "sm" | "md" | "lg"
}

export function LanguageSelector({ variant = "icon", size = "sm" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "en", name: "English" },
    { code: "tr", name: "Türkçe" },
    { code: "ru", name: "Русский" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "icon" ? "ghost" : "outline"}
          size={size}
          className={`${variant === "icon" ? (size === "sm" ? "h-10 w-10" : "h-12 w-12") + " rounded-full p-0" : "rounded-full border-gray-200 px-4 py-2 h-10"}`}
        >
          <Globe className={`${size === "sm" ? "h-5 w-5" : "h-6 w-6"} ${variant === "icon" ? "" : "text-gray-500"}`} />
          <span className="sr-only">Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className="flex items-center justify-between py-3"
          >
            <span>{lang.name}</span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

