"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { addDocument, uploadFile } from "@/lib/firebase-service";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";

export default function AdminAddCompanyPage() {
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleLogoSelect = (file: File | null) => {
    setSelectedLogo(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !user.isAdmin) {
      toast.error("You must be an admin to add a company");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      // Parse subsidiaries from comma-separated string to array
      const subsidiariesStr = formData.get("subsidiaries") as string;
      const subsidiaries = subsidiariesStr 
        ? subsidiariesStr.split(",").map(item => item.trim()) 
        : [];
      
      // Upload logo if selected
      let logoUrl;
      if (selectedLogo) {
        setUploadingLogo(true);
        try {
          // Clean the filename to prevent issues
          const safeFileName = selectedLogo.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
          // Create a temp path - we'll move it once we have the company ID
          const tempLogoPath = `companies/temp/logo_${Date.now()}_${safeFileName}`;
          logoUrl = await uploadFile(selectedLogo, tempLogoPath);
        } catch (error) {
          console.error("Error uploading logo:", error);
          toast.error("Failed to upload logo");
          // Continue with company creation even if logo upload fails
        } finally {
          setUploadingLogo(false);
        }
      }
      
      const company = {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Adding company:", company);
      const companyId = await addDocument("companies", company);
      console.log("Company added with ID:", companyId);
      
      // If a logo was uploaded with a temporary path, we should move it to a permanent location
      // This would be a more advanced feature and would require moving the file in Storage
      // For now, we'll keep the temp path
      
      toast.success("Company added successfully");
      router.push("/admin/companies");
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !user.isAdmin) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-6"></div>
        <div className="h-96 w-full animate-pulse rounded bg-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/companies">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add New Company</h1>
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
                        placeholder="e.g. Acme Corporation"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessActivity">Industry/Business Activity *</Label>
                      <Input
                        id="businessActivity"
                        name="businessActivity"
                        placeholder="e.g. Technology, Construction, Retail"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyType">Company Type</Label>
                      <Select name="companyType">
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
                        placeholder={`e.g. ${new Date().getFullYear() - 10}`}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <FileUpload 
                        id="company-logo"
                        label="Company Logo"
                        accept="image/*"
                        maxSize={2}
                        onFileSelect={handleLogoSelect}
                        disabled={loading}
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
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
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
                        placeholder="e.g. John Smith"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtibContactPosition">Position</Label>
                      <Input
                        id="rtibContactPosition"
                        name="rtibContactPosition"
                        placeholder="e.g. Regional Director"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtibContactPhone">Contact Phone</Label>
                      <Input
                        id="rtibContactPhone"
                        name="rtibContactPhone"
                        placeholder="+7 (XXX) XXX-XXXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtibContactEmail">Contact Email</Label>
                      <Input
                        id="rtibContactEmail"
                        name="rtibContactEmail"
                        type="email"
                        placeholder="contact@example.com"
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
                        placeholder="e.g. Jane Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ceoBirthDate">CEO Birth Date</Label>
                      <Input
                        id="ceoBirthDate"
                        name="ceoBirthDate"
                        type="date"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentCompany">Parent Company/Main Shareholder</Label>
                      <Input
                        id="parentCompany"
                        name="parentCompany"
                        placeholder="e.g. Holding Corp Ltd."
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="subsidiaries">Subsidiaries</Label>
                      <Textarea
                        id="subsidiaries"
                        name="subsidiaries"
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
                        placeholder="e.g. 100"
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
                        placeholder="e.g. 5000000"
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
                        placeholder="e.g. 10000000"
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
                        placeholder="e.g. 2000000"
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
                        placeholder="e.g. 1000000"
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
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Company"}
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