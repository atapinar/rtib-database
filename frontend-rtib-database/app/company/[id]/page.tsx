"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getDocument } from "@/lib/firebase-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Edit, Globe, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";

// Format functions in case lib/utils doesn't have them
const formatAmountFallback = (amount: number, currency = '$') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDateFallback = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

interface CompanyData {
  id: string;
  companyName?: string;
  name?: string;
  businessActivity?: string;
  industry?: string;
  yearEstablished?: string;
  foundedYear?: number;
  companyType?: string;
  logoUrl?: string;
  hqLocation?: string;
  location?: string;
  registeredAddress?: string;
  description?: string;
  website?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  contactPhone?: string;
  rtibContactName?: string;
  rtibContactPosition?: string;
  rtibContactPhone?: string;
  rtibContactEmail?: string;
  ceoName?: string;
  ceoBirthDate?: string;
  parentCompany?: string;
  mainShareholder?: string;
  subsidiaries?: string[];
  numEmployees?: number;
  employeeCount?: number;
  totalInvestment?: number;
  annualRevenue?: number;
  importVolume?: number;
  exportVolume?: number;
  createdAt?: any;
  updatedAt?: any;
}

export default function CompanyDetailsPage() {
  const params = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const companyId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;
      
      try {
        const companyData = await getDocument<CompanyData>("companies", companyId);
        setCompany(companyData);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  // Helper function to get value with fallback for backward compatibility
  const getValue = (primary?: string | number, fallback?: string | number) => {
    return primary !== undefined && primary !== "" ? primary : fallback;
  };

  // Helper function to format undefined values
  const formatValue = (value: any, formatter?: (val: any) => string) => {
    if (value === undefined || value === null || value === "") {
      return "—";
    }
    return formatter ? formatter(value) : value;
  };

  // Format functions - use imported ones if they exist, otherwise use fallbacks
  const formatAmountWithFallback = (val: number, currency?: string) => {
    try {
      return formatAmount(val, currency);
    } catch (e) {
      return formatAmountFallback(val, currency);
    }
  };

  const formatDateWithFallback = (date: Date) => {
    try {
      return formatDate(date);
    } catch (e) {
      return formatDateFallback(date);
    }
  };

  // Helper function to safely format dates from Firestore
  const safelyFormatDate = (dateValue: any) => {
    if (!dateValue) return "—";
    
    try {
      // Check if it's a Firestore timestamp with toDate method
      if (typeof dateValue.toDate === 'function') {
        return formatDateWithFallback(dateValue.toDate());
      }
      
      // Check if it's already a date
      if (dateValue instanceof Date) {
        return formatDateWithFallback(dateValue);
      }
      
      // If it's a timestamp number
      if (typeof dateValue === 'number') {
        return formatDateWithFallback(new Date(dateValue));
      }
      
      return "—";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "—";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-56" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  The company you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => router.push("/")}>Go Back</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const companyName = getValue(company.companyName, company.name) as string;
  const industry = getValue(company.businessActivity, company.industry) as string;
  const location = getValue(company.hqLocation, company.location) as string;
  const description = getValue(company.registeredAddress, company.description) as string;
  const email = getValue(company.email, company.contactEmail) as string;
  const phone = getValue(company.phone, company.contactPhone) as string;
  const employees = getValue(company.numEmployees, company.employeeCount) as number;
  const foundedYear = getValue(company.yearEstablished, company.foundedYear) as string | number;
  const parentCompany = getValue(company.parentCompany, company.mainShareholder) as string;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{companyName}</h1>
          </div>
          
          {user && user.isAdmin && (
            <Button asChild>
              <Link href={`/admin/companies/edit/${company.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Company
              </Link>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Company Details</CardTitle>
              <div className="flex space-x-2">
                {company.companyType && (
                  <Badge variant="outline">{company.companyType}</Badge>
                )}
                {industry && (
                  <Badge>{industry}</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="management">Management</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {company.logoUrl && (
                    <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 relative rounded-lg overflow-hidden border">
                      <Image 
                        src={company.logoUrl}
                        alt={`${companyName} logo`}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${company.logoUrl ? 'flex-1' : 'w-full'}`}>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Name</h3>
                      <p className="text-lg">{formatValue(companyName)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Industry/Business Activity</h3>
                      <p className="text-lg">{formatValue(industry)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Company Type</h3>
                      <p className="text-lg">{formatValue(company.companyType)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Year Established</h3>
                      <p className="text-lg">{formatValue(foundedYear)}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Headquarters</h3>
                      <p className="text-lg">{formatValue(location)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Registered Address</h3>
                    <p className="text-lg whitespace-pre-line">{formatValue(description)}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Website</h3>
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {email && (
                    <div className="flex items-start gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                        <a 
                          href={`mailto:${email}`}
                          className="text-primary hover:underline"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                        <a 
                          href={`tel:${phone}`}
                          className="text-primary hover:underline"
                        >
                          {phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {(company.rtibContactName || company.rtibContactPosition || company.rtibContactPhone || company.rtibContactEmail) && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-medium mb-4">RTIB Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {company.rtibContactName && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Name</h3>
                          <p className="text-lg">{company.rtibContactName}</p>
                        </div>
                      )}
                      
                      {company.rtibContactPosition && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Position</h3>
                          <p className="text-lg">{company.rtibContactPosition}</p>
                        </div>
                      )}
                      
                      {company.rtibContactPhone && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Phone</h3>
                          <a 
                            href={`tel:${company.rtibContactPhone}`}
                            className="text-primary hover:underline"
                          >
                            {company.rtibContactPhone}
                          </a>
                        </div>
                      )}
                      
                      {company.rtibContactEmail && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Email</h3>
                          <a 
                            href={`mailto:${company.rtibContactEmail}`}
                            className="text-primary hover:underline"
                          >
                            {company.rtibContactEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="management" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.ceoName && (
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">CEO</h3>
                        <p className="text-lg">{company.ceoName}</p>
                        {company.ceoBirthDate && (
                          <p className="text-sm text-muted-foreground">
                            Born: {safelyFormatDate(company.ceoBirthDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {parentCompany && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Parent Company/Main Shareholder</h3>
                      <p className="text-lg">{parentCompany}</p>
                    </div>
                  )}
                </div>
                
                {company.subsidiaries && company.subsidiaries.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Subsidiaries</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.subsidiaries.map((subsidiary, index) => (
                        <Badge key={index} variant="secondary">{subsidiary}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(employees !== undefined) && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Number of Employees</h3>
                      <p className="text-lg">{formatValue(employees)}</p>
                    </div>
                  )}
                  
                  {company.totalInvestment !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Investment</h3>
                      <p className="text-lg">{formatValue(company.totalInvestment, val => formatAmountWithFallback(val, '$'))}</p>
                    </div>
                  )}
                  
                  {company.annualRevenue !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Annual Revenue</h3>
                      <p className="text-lg">{formatValue(company.annualRevenue, val => formatAmountWithFallback(val, '$'))}</p>
                    </div>
                  )}
                  
                  {company.importVolume !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Import Volume</h3>
                      <p className="text-lg">{formatValue(company.importVolume, val => formatAmountWithFallback(val, '$'))}</p>
                    </div>
                  )}
                  
                  {company.exportVolume !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Export Volume</h3>
                      <p className="text-lg">{formatValue(company.exportVolume, val => formatAmountWithFallback(val, '$'))}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Created: {safelyFormatDate(company.createdAt)}</span>
              <span>Updated: {safelyFormatDate(company.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 