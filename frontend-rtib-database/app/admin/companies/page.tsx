"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFirestore } from "@/hooks/useFirestore";
import { deleteDocument } from "@/lib/firebase-service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Search, Pencil, Trash, Eye, FilterX } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Company {
  id: string;
  name?: string;
  companyName?: string; // Support both name and companyName fields
  industry?: string;
  businessActivity?: string; // Support both industry and businessActivity fields
  location?: string;
  hqLocation?: string; // Support both location and hqLocation fields
  contactEmail?: string;
  email?: string; // Support both contactEmail and email fields
  createdAt?: any;
}

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const { documents: companies, loading, error } = useFirestore<Company>("companies", {
    orderByField: "companyName",
  });
  
  const itemsPerPage = 10;
  
  // Debug logging to check the data being returned
  useEffect(() => {
    if (companies.length > 0) {
      console.log("Companies loaded:", companies);
    } else if (!loading && companies.length === 0) {
      console.log("No companies found in Firestore");
    }
  }, [companies, loading]);
  
  // Helper function to safely get company name
  const getCompanyName = (company: Company): string => {
    return company.companyName || company.name || "Unnamed Company";
  };
  
  // Helper function to safely get company industry
  const getCompanyIndustry = (company: Company): string => {
    return company.industry || company.businessActivity || "N/A";
  };
  
  // Helper function to safely get company location
  const getCompanyLocation = (company: Company): string => {
    return company.location || company.hqLocation || "N/A";
  };
  
  // Helper function to safely get company email
  const getCompanyEmail = (company: Company): string => {
    return company.contactEmail || company.email || "N/A";
  };
  
  // Filter companies based on search term
  const filteredCompanies = companies.filter(
    (company) =>
      getCompanyName(company).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompanyIndustry(company).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCompanyLocation(company).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate the filtered companies
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle company deletion
  const handleDeleteCompany = async (id: string) => {
    try {
      await deleteDocument("companies", id);
      toast.success("Company deleted successfully");
      setCompanyToDelete(null);
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company");
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Companies</h1>
        <Button asChild>
          <Link href="/admin/companies/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Company
          </Link>
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10 pr-10"
          placeholder="Search companies by name, industry, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm("")}
          >
            <FilterX className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="border rounded-md">
        {loading ? (
          <div className="p-4">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">Error loading companies: {error}</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">No companies found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm
                ? "Try adjusting your search term"
                : "Add your first company to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{getCompanyName(company)}</TableCell>
                    <TableCell>{getCompanyIndustry(company)}</TableCell>
                    <TableCell>{getCompanyLocation(company)}</TableCell>
                    <TableCell>{getCompanyEmail(company)}</TableCell>
                    <TableCell>
                      {company.createdAt?.toDate
                        ? format(company.createdAt.toDate(), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="View"
                        >
                          <Link href={`/company/${company.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Edit"
                        >
                          <Link href={`/admin/companies/edit/${company.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              title="Delete"
                              onClick={() => setCompanyToDelete(company.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this company?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                company record and all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setCompanyToDelete(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => companyToDelete && handleDeleteCompany(companyToDelete)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 