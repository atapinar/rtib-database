"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

interface ThemeSwitcherProps {
  variant?: "icon" | "button"
  size?: "sm" | "md" | "lg"
}

export function ThemeSwitcher({ variant = "icon", size = "sm" }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant={variant === "icon" ? "ghost" : "outline"}
      size={size}
      onClick={toggleTheme}
      className={`${variant === "icon" ? (size === "sm" ? "h-10 w-10" : "h-12 w-12") + " rounded-full p-0" : "rounded-full border-gray-200 px-4 py-2 h-10"}`}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? (
        <Moon className={`${size === "sm" ? "h-5 w-5" : "h-6 w-6"}`} />
      ) : (
        <Sun className={`${size === "sm" ? "h-5 w-5" : "h-6 w-6"}`} />
      )}
      <span className="sr-only">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </Button>
  )
}

