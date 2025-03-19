"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Settings, Database } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 animate-pulse rounded bg-gray-100"></div>
            <div className="h-48 animate-pulse rounded bg-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null; // Will redirect in the useEffect
  }

  const adminLinks = [
    {
      title: "Manage Companies",
      description: "Add, edit, and delete company records",
      icon: <Building className="h-8 w-8" />,
      href: "/admin/companies",
    },
    {
      title: "Manage Users",
      description: "View users and manage admin access",
      icon: <Users className="h-8 w-8" />,
      href: "/admin/users",
    },
    {
      title: "System Settings",
      description: "Configure application settings",
      icon: <Settings className="h-8 w-8" />,
      href: "/admin/settings",
    },
    {
      title: "Database Backup",
      description: "Backup and restore database",
      icon: <Database className="h-8 w-8" />,
      href: "/admin/backup",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button asChild variant="outline">
            <Link href="/">Back to Site</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminLinks.map((link) => (
            <Card key={link.title} className="overflow-hidden">
              <Link href={link.href}>
                <div className="h-full hover:bg-accent/10 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="text-primary">{link.icon}</div>
                      <CardTitle>{link.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{link.description}</p>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 