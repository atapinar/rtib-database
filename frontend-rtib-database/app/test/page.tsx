"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDocuments } from "@/lib/firebase-service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TestPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getDocuments<any>("companies");
        setCompanies(data);
        console.log("Found companies:", data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return <div>Loading companies...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Test Company Links</h1>
      <p className="mb-4">Click on a company to test direct navigation to company detail page</p>
      
      <div className="grid gap-4">
        {companies.map(company => (
          <Card key={company.id} className="p-4">
            <div className="mb-2">
              <strong>Company ID:</strong> {company.id}
            </div>
            <div className="mb-2">
              <strong>Company Name:</strong> {company.companyName || "No name"}
            </div>
            <div className="flex gap-2 mt-4">
              <Button asChild variant="default">
                <Link href={`/company/${company.id}`}>
                  View Company Detail
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <a href={`/company/${company.id}`} target="_blank" rel="noopener noreferrer">
                  Open in New Tab
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 