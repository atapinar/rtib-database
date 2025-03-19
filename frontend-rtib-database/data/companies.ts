export type SortField = "rank" | "name" | "industry" | "marketCap" | "employees" | "headquarters" | "ceo"

export type SortDirection = "asc" | "desc"

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

export const companies: Company[] = [
  {
    id: "1",
    rank: 1,
    name: "Isbank",
    ticker: "ISBTR",
    industry: "Banking",
    description:
      "Isbank is one of Turkey's largest banks, providing a wide range of financial services to customers in Russia. The bank offers personal and business banking solutions, including loans, deposits, and investment services.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/isbank_logo-biaW0VprFJRqeDx5nmGo0Ap5pD7HWn.png",
    website: "https://www.isbank.com.ru",
    featured: false,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 1200,
    financials: {
      marketCap: 5200000000,
      revenue: 850000000,
      profit: 210000000,
    },
    ceo: {
      name: "Murat Bilgiç",
      linkedinUrl: "https://www.linkedin.com/in/murat-bilgic/",
    },
  },
  {
    id: "2",
    rank: 2,
    name: "Turkish Airlines",
    ticker: "THYAO",
    industry: "Aviation",
    description:
      "Turkish Airlines (THY) operates flights to various destinations in Russia, connecting Turkish and Russian cities. The airline provides passenger and cargo services with a focus on quality and customer satisfaction.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thy_logo-SqDjGoKFd7tZ8QEyFeAxvyCRKFsdB5.png",
    website: "https://www.turkishairlines.com",
    featured: true,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 3500,
    financials: {
      marketCap: 4800000000,
      revenue: 1200000000,
      profit: 180000000,
    },
    ceo: {
      name: "Bilal Ekşi",
      linkedinUrl: "https://www.linkedin.com/in/bilal-eksi/",
    },
  },
  {
    id: "3",
    rank: 3,
    name: "Ziraat Bank",
    ticker: "ZIRTR",
    industry: "Banking",
    description:
      "Ziraat Bank is a state-owned Turkish bank with a strong presence in Russia. It specializes in agricultural financing and provides comprehensive banking services to both individuals and businesses.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-tXziqo16BGgNmfGM0qIAPuwH70bisU.png",
    website: "https://www.ziraatbank.ru",
    featured: false,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 950,
    financials: {
      marketCap: 4800000000,
      revenue: 720000000,
      profit: 180000000,
    },
    ceo: {
      name: "Alpaslan Çakar",
      linkedinUrl: "https://www.linkedin.com/in/alpaslan-cakar/",
    },
  },
  {
    id: "4",
    rank: 4,
    name: "Credit Europe Bank",
    ticker: "CEBR",
    industry: "Banking",
    description:
      "Credit Europe Bank is a Turkish-owned bank operating in Russia, providing a wide range of banking services to individuals and businesses. The bank specializes in retail banking, corporate banking, and trade finance.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-IvVW9eaYrcZ1y2gsVkbpujXfH5obiP.png",
    website: "https://www.crediteurope.ru",
    featured: false,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 1100,
    financials: {
      marketCap: 2800000000,
      revenue: 580000000,
      profit: 120000000,
    },
    ceo: {
      name: "Bektaş Şirin",
      linkedinUrl: "https://www.linkedin.com/in/bektas-sirin/",
    },
  },
  {
    id: "5",
    rank: 5,
    name: "Ruscam",
    ticker: "RSCM",
    industry: "Manufacturing",
    description:
      "Ruscam is a subsidiary of Şişecam Group, one of Turkey's largest industrial enterprises. The company specializes in glass production and packaging solutions for various industries in Russia.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-YbGk4YGwxj04pWrlFEoErfJjqopmdz.png",
    website: "https://www.sisecamcamambalaj.com/ru",
    featured: false,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 1800,
    financials: {
      marketCap: 980000000,
      revenue: 620000000,
      profit: 75000000,
    },
    ceo: {
      name: "Ahmet Kırman",
      linkedinUrl: "https://www.linkedin.com/in/ahmet-kirman/",
    },
  },
  {
    id: "6",
    rank: 6,
    name: "Beko",
    ticker: "BEKO",
    industry: "Manufacturing",
    description:
      "Beko is a leading Turkish home appliance manufacturer operating in Russia. The company produces a wide range of products including refrigerators, washing machines, dishwashers, and small kitchen appliances.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beko%20Logo-bfmi8eIwVRrvpDQ8dZYrr8ygEWEWxz.png",
    website: "https://www.beko.ru",
    featured: false,
    headquarters: {
      city: "St. Petersburg",
      country: "Russia",
    },
    employees: 2500,
    financials: {
      marketCap: 3900000000,
      revenue: 1200000000,
      profit: 150000000,
    },
    ceo: {
      name: "Hakan Bulgurlu",
      linkedinUrl: "https://www.linkedin.com/in/hakan-bulgurlu/",
    },
  },
  {
    id: "7",
    rank: 7,
    name: "Efes Rus",
    ticker: "EFES",
    industry: "Food & Beverage",
    description:
      "Efes Rus is a Turkish brewery company with a strong presence in the Russian market. The company produces and distributes a variety of beer brands and soft drinks throughout Russia, with multiple production facilities across the country.",
    logoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Efes%20Logo.jpg-VOJ6Z8TNFwodut9xroBszjPTejMbik.jpeg",
    website: "https://www.efesrus.ru",
    featured: true,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 1800,
    financials: {
      marketCap: 1200000000,
      revenue: 950000000,
      profit: 110000000,
    },
    ceo: {
      name: "Can Çaka",
      linkedinUrl: "https://www.linkedin.com/in/can-caka/",
    },
  },
  {
    id: "8",
    rank: 8,
    name: "Mavi",
    ticker: "MAVI",
    industry: "Retail",
    description:
      "Mavi is a Turkish denim and fashion brand with retail operations in Russia. Known for its high-quality jeans and casual wear, Mavi has established itself as a popular fashion choice among Russian consumers.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mavi%20Logo-pXfJdBHhYunF3X9RISz6gZBLvC83sb.png",
    website: "https://www.mavi.ru",
    featured: true,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 350,
    financials: {
      marketCap: 1200000000,
      revenue: 450000000,
      profit: 85000000,
    },
    ceo: {
      name: "Cüneyt Yavuz",
      linkedinUrl: "https://www.linkedin.com/in/cuneyt-yavuz/",
    },
  },
  {
    id: "9",
    rank: 9,
    name: "Kalekim",
    ticker: "KALE",
    industry: "Construction",
    description:
      "Kalekim is a Turkish construction materials company operating in Russia. The company specializes in producing adhesives, grouts, waterproofing materials, and other construction chemicals for the Russian market.",
    logoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kalekim%20Logo-DbbMEZxjdAUef7qkiPLvb0xxS97qoc.png",
    website: "https://www.kalekim.ru",
    featured: false,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 420,
    financials: {
      marketCap: 580000000,
      revenue: 320000000,
      profit: 45000000,
    },
    ceo: {
      name: "Altuğ Akbaş",
      linkedinUrl: "https://www.linkedin.com/in/altug-akbas/",
    },
  },
  {
    id: "10",
    rank: 10,
    name: "Enka",
    ticker: "ENKA",
    industry: "Construction",
    description:
      "Enka is a Turkish construction and engineering company with significant operations in Russia. The company has been involved in numerous large-scale construction projects, including shopping centers, office buildings, and infrastructure development.",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-eKB1AW84Wj0fWHYnC7WNwoeIAwUjlX.png",
    website: "https://www.enka.com",
    featured: false,
    headquarters: {
      city: "Moscow",
      country: "Russia",
    },
    employees: 3200,
    financials: {
      marketCap: 850000000,
      revenue: 1500000000,
      profit: 120000000,
    },
    ceo: {
      name: "Mehmet Tara",
      linkedinUrl: "https://www.linkedin.com/in/mehmet-tara/",
    },
  },
]

