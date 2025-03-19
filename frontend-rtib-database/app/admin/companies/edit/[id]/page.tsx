"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { getDocument, updateDocument, uploadFile, deleteFile } from "@/lib/firebase-service";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";

interface Company {
  id: string;
  // Basic Info
  name?: string;
  companyName?: string;
  industry?: string;
  businessActivity?: string;
  companyType?: string;
  yearEstablished?: number | string;
  foundedYear?: number;
  description?: string;
  logoUrl?: string;
  
  // Location
  location?: string;
  hqLocation?: string;
  registeredAddress?: string;
  
  // Contact Info
  website?: string;
  contactEmail?: string;
  email?: string;
  contactPhone?: string;
  phone?: string;
  
  // RTIB Contact
  rtibContactName?: string;
  rtibContactPosition?: string;
  rtibContactPhone?: string;
  rtibContactEmail?: string;
  
  // Management
  ceoName?: string;
  ceoBirthDate?: string;
  parentCompany?: string;
  mainShareholder?: string;
  subsidiaries?: string[] | string;
  
  // Financial Info
  employeeCount?: number;
  numEmployees?: number;
  totalInvestment?: number;
  annualRevenue?: number;
  importVolume?: number;
  exportVolume?: number;
  
  // System fields
  createdAt?: any;
  updatedAt?: any;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function AdminEditCompanyPage({ params }: PageProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return;
    }

    const fetchCompany = async () => {
      if (!params.id) {
        setError("Company ID is required");
        setLoading(false);
        return;
      }

      try {
        const data = await getDocument<Company>("companies", params.id);
        if (!data) {
          setError("Company not found");
        } else {
          setCompany(data);
          console.log("Fetched company data:", data);
        }
      } catch (err: any) {
        console.error("Error fetching company:", err);
        setError(err.message || "Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [params.id, user, router]);

  const handleLogoSelect = (file: File | null) => {
    setSelectedLogo(file);
    if (file === null) {
      // When logo is cleared, we update the state to show this intent
      setLogoError(false);
    }
  };

  const handleLogoClear = () => {
    // Mark the logo for deletion
    setSelectedLogo(null);
    setLogoError(true); // This indicates we intentionally want to remove the logo
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !user.isAdmin) {
      toast.error("You must be an admin to edit a company");
      return;
    }

    if (!params.id || !company) {
      toast.error("Company data is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      // Parse subsidiaries from comma-separated string to array
      const subsidiariesStr = formData.get("subsidiaries") as string;
      const subsidiaries = subsidiariesStr 
        ? subsidiariesStr.split(",").map(item => item.trim()) 
        : [];
      
      // Handle logo upload or deletion
      let logoUrl = company.logoUrl;
      
      // If logo should be deleted (either explicitly or by selecting a new one)
      if (logoError || selectedLogo) {
        // Delete existing logo if there is one
        if (company.logoUrl) {
          try {
            // Extract the path from the URL by removing the Firebase Storage base URL
            const urlParts = company.logoUrl.split('/');
            const fileName = urlParts[urlParts.length - 1].split('?')[0];
            const existingLogoPath = `companies/${params.id}/${fileName}`;
            
            await deleteFile(existingLogoPath).catch(err => {
              console.warn("Failed to delete existing logo, it may not exist or you may not have permission:", err);
              // Continue even if deletion fails
            });
          } catch (err) {
            console.warn("Error parsing logo URL for deletion:", err);
            // Continue even if parsing fails
          }
        }
        
        // Set logoUrl to null if we're just deleting without uploading a new one
        if (logoError && !selectedLogo) {
          logoUrl = undefined; // Using undefined instead of null for string | undefined type
        }
      }
      
      // Upload new logo if selected
      if (selectedLogo) {
        setUploadingLogo(true);
        try {
          // Generate a unique path for the logo with a clean filename
          const safeFileName = selectedLogo.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
          const logoPath = `companies/${params.id}/logo_${Date.now()}_${safeFileName}`;
          
          // Upload the new logo
          logoUrl = await uploadFile(selectedLogo, logoPath);
        } catch (error) {
          console.error("Error uploading logo:", error);
          toast.error("Failed to upload logo");
          // Continue with update even if logo upload fails
        } finally {
          setUploadingLogo(false);
        }
      }
      
      const updatedCompany = {
        ...company,
        // Basic Info
        companyName: formData.get("companyName") as string,
        name: formData.get("companyName") as string, // Keep for backward compatibility
        businessActivity: formData.get("businessActivity") as string,
        industry: formData.get("businessActivity") as string, // Keep for backward compatibility
        companyType: formData.get("companyType") as string,
        yearEstablished: formData.get("yearEstablished") as string,
        foundedYear: parseInt(formData.get("yearEstablished") as string) || undefined,
        logoUrl,
        
        // Location
        hqLocation: formData.get("hqLocation") as string,
        location: formData.get("hqLocation") as string, // Keep for backward compatibility
        registeredAddress: formData.get("registeredAddress") as string,
        description: formData.get("registeredAddress") as string, // Keep for backward compatibility
        
        // Contact Info
        website: formData.get("website") as string,
        email: formData.get("email") as string,
        contactEmail: formData.get("email") as string, // Keep for backward compatibility
        phone: formData.get("phone") as string,
        contactPhone: formData.get("phone") as string, // Keep for backward compatibility
        
        // RTIB Contact
        rtibContactName: formData.get("rtibContactName") as string,
        rtibContactPosition: formData.get("rtibContactPosition") as string,
        rtibContactPhone: formData.get("rtibContactPhone") as string,
        rtibContactEmail: formData.get("rtibContactEmail") as string,
        
        // Management
        ceoName: formData.get("ceoName") as string,
        ceoBirthDate: formData.get("ceoBirthDate") as string,
        parentCompany: formData.get("parentCompany") as string,
        mainShareholder: formData.get("parentCompany") as string, // Keep for backward compatibility
        subsidiaries: subsidiaries,
        
        // Financial Info
        numEmployees: parseInt(formData.get("numEmployees") as string) || undefined,
        employeeCount: parseInt(formData.get("numEmployees") as string) || undefined, // Keep for backward compatibility
        totalInvestment: parseFloat(formData.get("totalInvestment") as string) || undefined,
        annualRevenue: parseFloat(formData.get("annualRevenue") as string) || undefined,
        importVolume: parseFloat(formData.get("importVolume") as string) || undefined,
        exportVolume: parseFloat(formData.get("exportVolume") as string) || undefined,
        
        // System fields
        updatedAt: new Date(),
      };

      console.log("Updating company with data:", updatedCompany);
      await updateDocument("companies", params.id, updatedCompany);
      toast.success("Company updated successfully");
      router.push("/admin/companies");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-6"></div>
        <div className="h-96 w-full animate-pulse rounded bg-gray-100"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6">
        <div className="p-6 max-w-4xl mx-auto bg-red-50 text-red-500 rounded border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error || "Company not found"}</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/admin/companies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to get value for each field
  const getValue = (key: string, fallback: any = "") => {
    const companyAny = company as any;
    return companyAny[key] !== undefined ? companyAny[key] : fallback;
  };

  // Get company name from either field
  const companyNameValue = company.companyName || company.name || "";
  
  // Get industry from either field
  const industryValue = company.businessActivity || company.industry || "";
  
  // Get location from either field
  const locationValue = company.hqLocation || company.location || "";
  
  // Get description/address from either field
  const addressValue = company.registeredAddress || company.description || "";
  
  // Get contact email from either field
  const emailValue = company.email || company.contactEmail || "";
  
  // Get phone from either field
  const phoneValue = company.phone || company.contactPhone || "";
  
  // Get number of employees from either field
  const employeesValue = company.numEmployees || company.employeeCount || "";
  
  // For subsidiaries, convert array to string if needed
  const subsidiariesValue = Array.isArray(company.subsidiaries) 
    ? company.subsidiaries.join(", ") 
    : company.subsidiaries || "";

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/companies">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit {companyNameValue}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        defaultValue={companyNameValue}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessActivity">Industry/Business Activity *</Label>
                      <Input
                        id="businessActivity"
                        name="businessActivity"
                        defaultValue={industryValue}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyType">Company Type</Label>
                      <Select defaultValue={getValue("companyType")} name="companyType">
                        <SelectTrigger>
                          <SelectValue placeholder="Select company type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Corporation">Corporation</SelectItem>
                          <SelectItem value="LLC">LLC</SelectItem>
                          <SelectItem value="Partnership">Partnership</SelectItem>
                          <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="Joint Venture">Joint Venture</SelectItem>
                          <SelectItem value="Subsidiary">Subsidiary</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearEstablished">Year Established</Label>
                      <Input
                        id="yearEstablished"
                        name="yearEstablished"
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        defaultValue={getValue("yearEstablished") || getValue("foundedYear")}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <FileUpload 
                        id="company-logo"
                        label="Company Logo"
                        accept="image/*"
                        maxSize={2}
                        currentImageUrl={company.logoUrl}
                        onFileSelect={handleLogoSelect}
                        onClear={handleLogoClear}
                        disabled={saving}
                        isUploading={uploadingLogo}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a square logo for best results. Max 2MB.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="location" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="hqLocation">Location/Headquarters *</Label>
                      <Input
                        id="hqLocation"
                        name="hqLocation"
                        defaultValue={locationValue}
                        placeholder="e.g. Moscow, Russia"
                        required
                      />
                      <p className="text-sm text-muted-foreground">Format: City, Country</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registeredAddress">Registered Address</Label>
                      <Textarea
                        id="registeredAddress"
                        name="registeredAddress"
                        defaultValue={addressValue}
                        rows={3}
                        placeholder="Full address including street, building, city, postal code"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        defaultValue={getValue("website")}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={emailValue}
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={phoneValue}
                        placeholder="+7 (XXX) XXX-XXXX"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  <h3 className="text-lg font-medium mb-4">RTIB Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rtibContactName">Contact Name</Label>
                      <Input
                        id="rtibContactName"
                        name="rtibContactName"
                        defaultValue={getValue("rtibContactName")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtibContactPosition">Position</Label>
                      <Input
                        id="rtibContactPosition"
                        name="rtibContactPosition"
                        defaultValue={getValue("rtibContactPosition")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtibContactPhone">Contact Phone</Label>
                      <Input
                        id="rtibContactPhone"
                        name="rtibContactPhone"
                        defaultValue={getValue("rtibContactPhone")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtibContactEmail">Contact Email</Label>
                      <Input
                        id="rtibContactEmail"
                        name="rtibContactEmail"
                        type="email"
                        defaultValue={getValue("rtibContactEmail")}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="management" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ceoName">CEO Name</Label>
                      <Input
                        id="ceoName"
                        name="ceoName"
                        defaultValue={getValue("ceoName")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ceoBirthDate">CEO Birth Date</Label>
                      <Input
                        id="ceoBirthDate"
                        name="ceoBirthDate"
                        type="date"
                        defaultValue={getValue("ceoBirthDate")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentCompany">Parent Company/Main Shareholder</Label>
                      <Input
                        id="parentCompany"
                        name="parentCompany"
                        defaultValue={getValue("parentCompany") || getValue("mainShareholder")}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="subsidiaries">Subsidiaries</Label>
                      <Textarea
                        id="subsidiaries"
                        name="subsidiaries"
                        defaultValue={subsidiariesValue}
                        rows={2}
                        placeholder="Comma-separated list of subsidiaries"
                      />
                      <p className="text-sm text-muted-foreground">Separate each subsidiary with a comma</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="financial" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="numEmployees">Number of Employees</Label>
                      <Input
                        id="numEmployees"
                        name="numEmployees"
                        type="number"
                        min="0"
                        defaultValue={employeesValue}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalInvestment">Total Investment ($)</Label>
                      <Input
                        id="totalInvestment"
                        name="totalInvestment"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={getValue("totalInvestment")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                      <Input
                        id="annualRevenue"
                        name="annualRevenue"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={getValue("annualRevenue")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="importVolume">Import Volume ($)</Label>
                      <Input
                        id="importVolume"
                        name="importVolume"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={getValue("importVolume")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exportVolume">Export Volume ($)</Label>
                      <Input
                        id="exportVolume"
                        name="exportVolume"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={getValue("exportVolume")}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/companies")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 