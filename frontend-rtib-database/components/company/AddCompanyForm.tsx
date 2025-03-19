"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addDocument } from "@/lib/firebase-service";
import { toast } from "sonner";

export default function AddCompanyForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const company = {
        name: formData.get("name") as string,
        industry: formData.get("industry") as string,
        location: formData.get("location") as string,
        description: formData.get("description") as string || "",
        website: formData.get("website") as string || "",
        contactEmail: formData.get("contactEmail") as string || "",
        contactPhone: formData.get("contactPhone") as string || "",
        employeeCount: parseInt(formData.get("employeeCount") as string) || 0,
        foundedYear: parseInt(formData.get("foundedYear") as string) || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const companyId = await addDocument("companies", company);
      toast.success("Company added successfully");
      router.push(`/company/${companyId}`);
    } catch (error) {
      console.error("Error adding company:", error);
      toast.error("Failed to add company");
    } finally {
      setLoading(false);
    }
  };

  return (
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
                placeholder="e.g. Acme Corporation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                placeholder="e.g. Technology"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Istanbul, Turkey"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="e.g. https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="e.g. contact@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                placeholder="e.g. +90 123 456 7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">Number of Employees</Label>
              <Input
                id="employeeCount"
                name="employeeCount"
                type="number"
                min="0"
                placeholder="e.g. 100"
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
                placeholder={`e.g. ${new Date().getFullYear()}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter company description..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/company")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Company"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 