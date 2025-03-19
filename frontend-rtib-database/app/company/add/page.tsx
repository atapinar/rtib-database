"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AddCompanyForm from "@/components/company/AddCompanyForm";

export default function AddCompanyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-6"></div>
          <div className="h-96 w-full animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Company</h1>
        <AddCompanyForm />
      </div>
    </div>
  );
} 