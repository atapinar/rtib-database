export type SortField = "rank" | "name" | "industry" | "marketCap" | "employees" | "headquarters" | "ceo"

export type SortDirection = "asc" | "desc"

export interface CompanyFirestore {
  id: string;
  companyName?: string;
  businessActivity?: string;
  yearEstablished?: number | string;
  companyType?: string;
  industry?: string;
  hqLocation?: string;
  registeredAddress?: string;
  phone?: string;
  email?: string;
  website?: string;
  rtibContactName?: string;
  rtibContactPosition?: string;
  rtibContactPhone?: string;
  rtibContactEmail?: string;
  ceoName?: string;
  ceoBirthDate?: string;
  parentCompany?: string;
  totalInvestment?: number;
  annualRevenue?: number;
  importVolume?: number;
  exportVolume?: number;
  numEmployees?: number;
  subsidiaries?: string[];
  createdAt?: any;
  updatedAt?: any;
}

// This is the interface used in the UI components
export interface Company {
  id: string
  rank: number
  name: string
  ticker: string
  industry: string
  description: string
  logoUrl: string
  website?: string
  featured: boolean
  headquarters: {
    city: string
    country: string
  }
  employees: number
  financials: {
    marketCap: number
    revenue?: number
    profit?: number
  }
  ceo?: {
    name: string
    linkedinUrl: string
  }
}

