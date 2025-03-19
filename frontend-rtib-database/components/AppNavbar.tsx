"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, User as UserIcon, Home, ShieldCheck, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useLanguage } from "@/contexts/language-context";

export function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const closeSheet = () => {
    setIsOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // Language options
  const languages = [
    { code: "en", name: "English" },
    { code: "tr", name: "Türkçe" },
    { code: "ru", name: "Русский" },
  ];

  // Handle language change
  const handleLanguageChange = (lang: "en" | "tr" | "ru") => {
    console.log("Changing language to:", lang);
    setLanguage(lang);
    // Force a page reload to ensure all components reflect the language change
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>RTIB Database</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 py-4">
                <Link
                  href="/"
                  className={`flex items-center gap-2 text-base transition-colors hover:text-foreground/80 ${
                    pathname === "/"
                      ? "font-semibold text-foreground"
                      : "text-foreground/70"
                  }`}
                  onClick={closeSheet}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    className={`flex items-center gap-2 text-base transition-colors hover:text-foreground/80 ${
                      pathname === "/admin"
                        ? "font-semibold text-foreground"
                        : "text-foreground/70"
                    }`}
                    onClick={closeSheet}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    Admin Panel
                  </Link>
                )}
                
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className={`flex items-center gap-2 text-base transition-colors hover:text-foreground/80 ${
                        pathname === "/profile"
                          ? "font-semibold text-foreground"
                          : "text-foreground/70"
                      }`}
                      onClick={closeSheet}
                    >
                      <UserIcon className="h-5 w-5" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-base text-left transition-colors hover:text-foreground/80 text-foreground/70"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className={`flex items-center gap-2 text-base transition-colors hover:text-foreground/80 ${
                      pathname === "/auth"
                        ? "font-semibold text-foreground"
                        : "text-foreground/70"
                    }`}
                    onClick={closeSheet}
                  >
                    <UserIcon className="h-5 w-5" />
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:block font-bold text-xl text-foreground"
            >
              RTIB Database
            </Link>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/"
                    className={`flex items-center justify-center p-2 rounded-md transition-colors hover:bg-accent ${
                      pathname === "/"
                        ? "bg-accent text-foreground"
                        : "text-foreground/70"
                    }`}
                    aria-label="Home"
                  >
                    <Home className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {user?.isAdmin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin"
                      className={`flex items-center justify-center p-2 rounded-md transition-colors hover:bg-accent ${
                        pathname === "/admin"
                          ? "bg-accent text-foreground"
                          : "text-foreground/70"
                      }`}
                      aria-label="Admin Panel"
                    >
                      <ShieldCheck className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Admin Panel</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Globe className="h-5 w-5" />
                      <span className="sr-only">Change language</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change language</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as "en" | "tr" | "ru")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  {lang.name}
                  {language === lang.code && <span className="ml-2">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme Switcher */}
          <ThemeSwitcher />
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 text-sm transition-colors hover:text-foreground/80 ${
                    pathname === "/profile"
                      ? "font-semibold text-foreground"
                      : "text-foreground/70"
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">My Profile</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground/70 hover:text-foreground/80 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">Logout</span>
                </Button>
              </div>
            </div>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 