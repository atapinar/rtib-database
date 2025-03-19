"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Building,
  Home,
  Users,
  Settings,
  Database,
  LogOut,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-64 h-screen animate-pulse bg-gray-100 border-r"></div>
        <div className="flex-1 p-8">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-6"></div>
          <div className="h-[calc(100vh-120px)] animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null; // Will redirect in the useEffect
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

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
          <h1 className="font-bold text-xl">Admin Panel</h1>
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
            <h1 className="font-bold">Admin Panel</h1>
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