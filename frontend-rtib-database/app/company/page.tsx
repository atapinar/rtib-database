"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirestore } from "@/hooks/useFirestore";
import { Building, ExternalLink, MapPin, PlusCircle, Search, User, Trash2, Edit } from "lucide-react";
import { where } from "firebase/firestore";
import { deleteDocument } from "@/lib/firebase-service";
import { toast } from "sonner";

// Define company type
interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  employeeCount: number;
  foundedYear: number;
  createdAt: {
    toDate: () => Date;
  };
}

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  
  // Use our custom hook to get companies
  const { documents: companies, loading, error } = useFirestore<Company>("companies", {
    orderByField: "name"
  });
  
  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCompany = async (id: string) => {
    if (!user) {
      toast.error("You must be logged in to delete a company");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await deleteDocument("companies", id);
        toast.success("Company deleted successfully");
      } catch (error) {
        console.error("Error deleting company:", error);
        toast.error("Failed to delete company");
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Company Database</h1>
        {user && (
          <Button onClick={() => router.push("/company/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search companies by name, industry, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-7 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 border rounded bg-red-50 text-red-500">
          Error loading companies: {error}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No companies found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm 
              ? "Try adjusting your search term" 
              : "Add your first company to get started"
            }
          </p>
          {user && searchTerm === "" && (
            <Button 
              className="mt-4" 
              onClick={() => router.push("/company/add")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="truncate">{company.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span className="truncate">{company.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  <span>{company.industry}</span>
                </div>
                {company.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>
                )}
                {company.employeeCount > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-1 h-4 w-4" />
                    <span>{company.employeeCount} employees</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link href={`/company/${company.id}`}>
                    View Details
                  </Link>
                </Button>
                {user && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => router.push(`/company/${company.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 