"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Building,
  Home,
  Users,
  Settings,
  Database,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdminChecked, setIsAdminChecked] = useState(false);

  useEffect(() => {
    // Only redirect after auth state is fully loaded
    if (!loading) {
      if (!user) {
        toast.error("You must be logged in to access the admin area");
        router.push("/auth");
        return;
      }
      
      if (!user.isAdmin) {
        toast.error("You don't have admin privileges");
        router.push("/");
        return;
      }
      
      setIsAdminChecked(true);
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // If still loading auth state or checking admin status, show loading state
  if (loading || !isAdminChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If not admin, don't render anything (will be redirected in useEffect)
  if (!user || !user.isAdmin) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    {
      href: "/admin/companies",
      label: "Companies",
      icon: <Building className="h-5 w-5" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      href: "/admin/backup",
      label: "Backup",
      icon: <Database className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card hidden md:block">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image 
                src="/images/logo.png" 
                alt="İşbank Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-bold text-xl">Admin Panel</h1>
          </div>
        </div>
        <nav className="py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                    pathname === item.href
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-3 mt-8">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile header */}
      <div className="flex flex-col w-full">
        <div className="border-b p-4 md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6">
                <Image 
                  src="/images/logo.png" 
                  alt="İşbank Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="font-bold">Admin Panel</h1>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-muted-foreground"
              >
                <Link href="/">Exit Admin</Link>
              </Button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto py-2 mt-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant={pathname === item.href ? "default" : "outline"}
                size="sm"
              >
                <Link href={item.href} className="flex items-center gap-1">
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
} 