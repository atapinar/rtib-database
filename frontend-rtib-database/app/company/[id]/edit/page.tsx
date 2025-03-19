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
import { getDocument, updateDocument } from "@/lib/firebase-service";
import { toast } from "sonner";

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
  createdAt: any;
  updatedAt: any;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditCompanyPage({ params }: PageProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to edit a company");
      return;
    }

    if (!params.id || !company) {
      toast.error("Company data is required");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updatedCompany = {
        ...company,
        name: formData.get("name") as string,
        industry: formData.get("industry") as string,
        location: formData.get("location") as string,
        description: formData.get("description") as string,
        website: formData.get("website") as string,
        contactEmail: formData.get("contactEmail") as string,
        contactPhone: formData.get("contactPhone") as string,
        employeeCount: parseInt(formData.get("employeeCount") as string) || 0,
        foundedYear: parseInt(formData.get("foundedYear") as string) || 0,
        updatedAt: new Date(),
      };

      await updateDocument("companies", params.id, updatedCompany);
      toast.success("Company updated successfully");
      router.push(`/company/${params.id}`);
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-64 animate-pulse rounded bg-gray-200 mb-6"></div>
          <div className="h-96 w-full animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 max-w-4xl mx-auto bg-red-50 text-red-500 rounded border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error || "Company not found"}</p>
          <Button className="mt-4" variant="outline" asChild>
            <Link href="/company">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/company/${company.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit {company.name}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={company.name}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    defaultValue={company.industry}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={company.location}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    defaultValue={company.website}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    defaultValue={company.contactEmail}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    defaultValue={company.contactPhone}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Number of Employees</Label>
                  <Input
                    id="employeeCount"
                    name="employeeCount"
                    type="number"
                    min="0"
                    defaultValue={company.employeeCount}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    name="foundedYear"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    defaultValue={company.foundedYear}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={company.description}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" asChild>
                  <Link href={`/company/${company.id}`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 