"use client"

import { useState } from "react"
import { Menu, Home, Info, Settings, Moon, Sun, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeSwitcher } from "@/components/theme-switcher"
import Link from "next/link"
import { useTheme } from "next-themes"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-left">RTIB Database</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <Home className="h-5 w-5 text-gray-500" />
            <span>Home</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 px-4 py-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <Info className="h-5 w-5 text-gray-500" />
            <span>About</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-5 w-5 text-gray-500" />
            <span>Settings</span>
          </Link>

          <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-4">
            <div className="px-4 text-sm font-medium text-gray-500 mb-2">Preferences</div>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-500" />
                <span>Language</span>
              </div>
              <LanguageSelector variant="icon" size="sm" />
            </div>

            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-gray-500" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-500" />
                )}
                <span>Theme</span>
              </div>
              <ThemeSwitcher variant="icon" size="sm" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

