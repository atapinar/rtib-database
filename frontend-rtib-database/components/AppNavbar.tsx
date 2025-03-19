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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Globe className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              RTIB Database
            </span>
          </Link>
        </div>
        
        {/* Show navigation only for authenticated users */}
        {user && (
          <nav className="flex-1 hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Companies
            </Link>
            <Link
              href="/about"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/about" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/contact" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Contact
            </Link>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 transition-colors hover:text-foreground/80 ${
                  pathname.startsWith("/admin")
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        )}

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex-1 sm:flex-initial sm:grow-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="px-2"
                        size="icon"
                      >
                        <span className="mx-1">{language.toUpperCase()}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Change language</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {languages.map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code as "en" | "tr" | "ru")}
                          className="cursor-pointer"
                        >
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change language</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <nav className="flex items-center space-x-1">
            <ThemeSwitcher />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 px-0 md:hidden"
                  size="icon"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <SheetHeader className="px-4">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 px-4 py-6">
                  {/* Show navigation links for authenticated users only */}
                  {user && (
                    <>
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
                        Companies
                      </Link>
                      <Link
                        href="/about"
                        className={`flex items-center gap-2 text-base transition-colors hover:text-foreground/80 ${
                          pathname === "/about"
                            ? "font-semibold text-foreground"
                            : "text-foreground/70"
                        }`}
                        onClick={closeSheet}
                      >
                        <Globe className="h-5 w-5" />
                        About
                      </Link>
                      <Link
                        href="/contact"
                        className={`flex items-center gap-2 text-base transition-colors hover:text-foreground/80 ${
                          pathname === "/contact"
                            ? "font-semibold text-foreground"
                            : "text-foreground/70"
                        }`}
                        onClick={closeSheet}
                      >
                        <ShieldCheck className="h-5 w-5" />
                        Contact
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          href="/admin"
                          className={`flex items-center gap-2 text-base transition-colors hover:text-foreground/80 ${
                            pathname.startsWith("/admin")
                              ? "font-semibold text-foreground"
                              : "text-foreground/70"
                          }`}
                          onClick={closeSheet}
                        >
                          <ShieldCheck className="h-5 w-5" />
                          Admin
                        </Link>
                      )}
                    </>
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
          </nav>
          
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