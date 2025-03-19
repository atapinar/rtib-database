"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Linkedin, Calendar, Building2, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { ceoData } from "@/lib/ceo-data"
import { employeeData } from "@/lib/employee-data"
import type { CEOData } from "@/components/ceo-profile-hover"
import type { EmployeeData } from "@/components/employee-profile-hover"
import type { RTIBContactData } from "@/components/add-rtib-contact-modal"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeSwitcher } from "@/components/theme-switcher"

// Translations
const translations = {
  en: {
    back: "Back",
    profile: "Profile",
    currentPosition: "Current Position",
    contactInformation: "Contact Information",
    email: "Email",
    phone: "Phone",
    careerTimeline: "Career Timeline",
    present: "Present",
    professionalSummary: "Professional Summary",
    noSummary: "No professional summary available.",
    notFound: "Profile not found",
    notFoundDesc: "The profile you're looking for doesn't exist or has been removed.",
    returnToDashboard: "Return to dashboard",
    fallbackTitle: "Profile information is being updated",
    fallbackDesc: "This profile is currently being updated with complete information. Here's what we have so far:",
    ceoProfile: "CEO Profile",
    employeeProfile: "Employee Profile",
    rtibContactProfile: "RTIB Contact Profile",
    skills: "Skills & Expertise",
    education: "Education",
    languages: "Languages",
    projects: "Projects",
    achievements: "Achievements",
  },
  tr: {
    back: "Geri",
    profile: "Profil",
    currentPosition: "Mevcut Pozisyon",
    contactInformation: "İletişim Bilgileri",
    email: "E-posta",
    phone: "Telefon",
    careerTimeline: "Kariyer Zaman Çizelgesi",
    present: "Günümüz",
    professionalSummary: "Profesyonel Özet",
    noSummary: "Profesyonel özet mevcut değil.",
    notFound: "Profil bulunamadı",
    notFoundDesc: "Aradığınız profil mevcut değil veya kaldırılmış.",
    returnToDashboard: "Ana sayfaya dön",
    fallbackTitle: "Profil bilgileri güncelleniyor",
    fallbackDesc: "Bu profil şu anda tam bilgilerle güncelleniyor. Şu ana kadar sahip olduğumuz bilgiler:",
    ceoProfile: "CEO Profili",
    employeeProfile: "Çalışan Profili",
    rtibContactProfile: "RTIB İletişim Profili",
    skills: "Beceriler ve Uzmanlık",
    education: "Eğitim",
    languages: "Diller",
    projects: "Projeler",
    achievements: "Başarılar",
  },
  ru: {
    back: "Назад",
    profile: "Профиль",
    currentPosition: "Текущая должность",
    contactInformation: "Контактная информация",
    email: "Электронная почта",
    phone: "Телефон",
    careerTimeline: "Карьерная хронология",
    present: "Настоящее время",
    professionalSummary: "Профессиональное резюме",
    noSummary: "Профессиональное резюме недоступно.",
    notFound: "Профиль не найден",
    notFoundDesc: "Профиль, который вы ищете, не существует или был удален.",
    returnToDashboard: "Вернуться на главную",
    fallbackTitle: "Информация профиля обновляется",
    fallbackDesc: "Этот профиль в настоящее время обновляется полной информацией. Вот что у нас есть на данный момент:",
    ceoProfile: "Профиль генерального директора",
    employeeProfile: "Профиль сотрудника",
    rtibContactProfile: "Профиль контакта RTIB",
    skills: "Навыки и опыт",
    education: "Образование",
    languages: "Языки",
    projects: "Достижения",
  },
}

// Mock RTIB contact data for demonstration
const rtibContactData: Record<string, RTIBContactData> = {
  "rtib-1": {
    id: "rtib-1",
    name: "Ahmet Demir",
    position: "Regional Manager",
    email: "ahmet.demir@isbank.ru",
    phone: "+7 495 123 4567",
    bio: "Experienced regional manager with expertise in banking operations and team leadership. Focused on expanding Isbank's presence in the Russian market.",
  },
  "rtib-2": {
    id: "rtib-2",
    name: "Mehmet Yılmaz",
    position: "CEO",
    email: "mehmet.yilmaz@ziraat.ru",
    phone: "+7 495 234 5678",
    bio: "Strategic leader with over 15 years of experience in international banking. Specializes in market expansion and digital transformation.",
  },
  "rtib-3": {
    id: "rtib-3",
    name: "Fatih Kaya",
    position: "Branch Manager",
    email: "fatih.kaya@denizbank.ru",
    phone: "+7 495 345 6789",
    bio: "Branch operations expert with a focus on customer service excellence and team development. Led multiple successful branch expansions.",
  },
  "rtib-4": {
    id: "rtib-4",
    name: "Selin Aksoy",
    position: "Marketing Director",
    email: "selin.aksoy@beko.ru",
    phone: "+7 495 456 7890",
    bio: "Creative marketing professional with extensive experience in brand development and digital marketing strategies in the Russian market.",
  },
  "rtib-5": {
    id: "rtib-5",
    name: "Zeynep Yıldız",
    position: "Retail Manager",
    email: "zeynep.yildiz@mavi.ru",
    phone: "+7 495 567 8901",
    bio: "Retail operations specialist with expertise in fashion retail management and customer experience optimization.",
  },
  "rtib-6": {
    id: "rtib-6",
    name: "Ali Demir",
    position: "Project Director",
    email: "ali.demir@ruscam.ru",
    phone: "+7 495 678 9012",
    bio: "Project management professional specializing in manufacturing operations and process optimization in the glass industry.",
  },
}

// Sample fallback data for profiles
const fallbackProfileData = {
  ceo: {
    skills: [
      "Strategic Leadership",
      "Financial Management",
      "Business Development",
      "International Relations",
      "Team Building",
    ],
    education: [
      { degree: "MBA", institution: "Harvard Business School", year: "2005" },
      { degree: "Bachelor of Economics", institution: "Istanbul University", year: "2000" },
    ],
    languages: ["Turkish", "English", "Russian"],
    achievements: [
      "Led company to 30% revenue growth in 2 years",
      "Expanded operations to 3 new regions",
      "Implemented digital transformation initiative",
    ],
  },
  employee: {
    skills: ["Project Management", "Customer Relations", "Data Analysis", "Team Coordination"],
    education: [{ degree: "Bachelor of Business", institution: "Ankara University", year: "2010" }],
    languages: ["Turkish", "English", "Basic Russian"],
    projects: [
      "Market expansion project in Moscow region",
      "Customer satisfaction improvement initiative",
      "Digital tools implementation",
    ],
  },
  rtib: {
    skills: ["Business Networking", "Cross-cultural Communication", "Trade Relations", "Market Analysis"],
    education: [{ degree: "International Relations", institution: "Boğaziçi University", year: "2008" }],
    languages: ["Turkish", "Russian", "English"],
    achievements: [
      "Facilitated 15+ business partnerships between Turkish and Russian companies",
      "Organized 5 major trade events",
      "Provided advisory services to 20+ companies entering the Russian market",
    ],
  },
}

// Helper function to get profile data by ID with improved matching
const getProfileById = (
  id: string,
): { type: "ceo" | "employee" | "rtib"; data: CEOData | EmployeeData | RTIBContactData } | null => {
  // Check if it's a CEO (by name-based ID or direct match)
  for (const key in ceoData) {
    const formattedName = key.toLowerCase().replace(/\s+/g, "-")
    if (id === `ceo-${formattedName}` || formattedName === id.replace("ceo-", "") || key === id) {
      return { type: "ceo", data: ceoData[key] }
    }
  }

  // Check if it's an employee (by ID or name-based ID)
  for (const key in employeeData) {
    const emp = employeeData[key]
    const formattedName = emp.name.toLowerCase().replace(/\s+/g, "-")
    if (emp.id === id || formattedName === id) {
      return { type: "employee", data: emp }
    }
  }

  // Check if it's an RTIB contact (by ID or name-based ID)
  for (const key in rtibContactData) {
    const contact = rtibContactData[key]
    const formattedName = contact.name.toLowerCase().replace(/\s+/g, "-")
    if (key === id || contact.id === id || formattedName === id) {
      return { type: "rtib", data: contact }
    }
  }

  // If no exact match, try partial matching for more flexibility
  const lowercaseId = id.toLowerCase()

  // Partial match for CEOs
  for (const key in ceoData) {
    if (key.toLowerCase().includes(lowercaseId) || lowercaseId.includes(key.toLowerCase())) {
      return { type: "ceo", data: ceoData[key] }
    }
  }

  // Partial match for employees
  for (const key in employeeData) {
    const emp = employeeData[key]
    if (emp.name.toLowerCase().includes(lowercaseId) || lowercaseId.includes(emp.name.toLowerCase())) {
      return { type: "employee", data: emp }
    }
  }

  // Partial match for RTIB contacts
  for (const key in rtibContactData) {
    const contact = rtibContactData[key]
    if (contact.name.toLowerCase().includes(lowercaseId) || lowercaseId.includes(contact.name.toLowerCase())) {
      return { type: "rtib", data: contact }
    }
  }

  // Create fallback data if no match is found
  if (id.includes("ceo") || id.includes("director") || id.includes("manager")) {
    return createFallbackProfile("ceo", id)
  } else if (id.includes("employee") || id.includes("staff")) {
    return createFallbackProfile("employee", id)
  } else if (id.includes("rtib") || id.includes("contact")) {
    return createFallbackProfile("rtib", id)
  }

  // If we still can't determine the type, default to employee
  return createFallbackProfile("employee", id)
}

// Function to create fallback profile data
function createFallbackProfile(type: "ceo" | "employee" | "rtib", id: string) {
  // Extract a name from the ID if possible
  const nameFromId = id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

  if (type === "ceo") {
    // Try to extract name from ID
    const nameFromId = id
      .replace("ceo-", "")
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")

    // Check if we have actual CEO data
    for (const key in ceoData) {
      if (key.toLowerCase().includes(nameFromId.toLowerCase())) {
        return {
          type: "ceo",
          data: ceoData[key],
        }
      }
    }

    // Fallback if no match found
    return {
      type: "ceo",
      data: {
        name: nameFromId || "CEO Profile",
        position: "Chief Executive Officer",
        company: "Turkish Company",
        bio: "Profile information is being updated. This CEO has extensive experience in leadership and business development.",
        email: "ceo@example.com",
        timeline: [
          {
            position: "CEO",
            company: "Current Company",
            startDate: "2020",
          },
          {
            position: "COO",
            company: "Previous Company",
            startDate: "2015",
            endDate: "2020",
          },
        ],
      } as CEOData,
    }
  } else if (type === "employee") {
    return {
      type: "employee",
      data: {
        id: id,
        name: nameFromId || "Employee Profile",
        position: "Specialist",
        department: "Operations",
        company: "Turkish Company",
        bio: "Profile information is being updated. This employee specializes in operations and project management.",
        email: "employee@example.com",
      } as EmployeeData,
    }
  } else {
    return {
      type: "rtib",
      data: {
        id: id,
        name: nameFromId || "RTIB Contact",
        position: "RTIB Representative",
        email: "contact@rtib.org",
        bio: "Profile information is being updated. This RTIB contact facilitates business relationships between Turkish and Russian companies.",
      } as RTIBContactData,
    }
  }
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const t = translations[language]
  const [profile, setProfile] = useState<{ type: "ceo" | "employee" | "rtib"; data: any; isFallback?: boolean } | null>(
    null,
  )
  const [previousPage, setPreviousPage] = useState<string>("/")

  useEffect(() => {
    // Get profile data
    const profileData = getProfileById(params.id)

    if (profileData) {
      // Check if this is fallback data
      const isFallback = !!(
        (profileData.type === "ceo" && !ceoData[profileData.data.name]) ||
        (profileData.type === "employee" && !employeeData[profileData.data.name]) ||
        (profileData.type === "rtib" && !rtibContactData[profileData.data.id])
      )

      setProfile({ ...profileData, isFallback })
    } else {
      // If no profile data found, create a fallback
      const fallbackProfile = createFallbackProfile("employee", params.id)
      setProfile({ ...fallbackProfile, isFallback: true })
    }

    // Store the previous page URL for the back button
    if (document.referrer && document.referrer.includes(window.location.host)) {
      setPreviousPage(document.referrer)
    } else {
      setPreviousPage("/")
    }
  }, [params.id])

  if (!profile) {
    // This should rarely happen now with our fallback system
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">{t.notFound}</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{t.notFoundDesc}</p>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/">{t.returnToDashboard}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { type, data, isFallback } = profile

  // Extract common profile data
  const name = data.name
  const position = data.position
  const company = type === "ceo" || type === "employee" ? data.company : ""
  const bio = data.bio || ""
  const email = data.email
  const phone = data.phone
  const linkedinUrl = data.linkedinUrl
  const imageUrl = data.imageUrl

  // Get timeline data (only available for CEOs)
  const timeline = type === "ceo" ? data.timeline || [] : []

  // Get fallback data based on profile type
  const fallbackData =
    type === "ceo"
      ? fallbackProfileData.ceo
      : type === "employee"
        ? fallbackProfileData.employee
        : fallbackProfileData.rtib

  // Get profile type title
  const profileTypeTitle =
    type === "ceo" ? t.ceoProfile : type === "employee" ? t.employeeProfile : t.rtibContactProfile

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link href={previousPage}>
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">{t.back}</span>
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{profileTypeTitle}</h1>
            </div>

            {/* Add the theme and language selectors here */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher variant="icon" size="sm" />
              <LanguageSelector variant="button" size="sm" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-8">
        {/* Fallback notice if using generated data */}
        {isFallback && (
          <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:bg-blue-900/20 dark:border-blue-800">
            <h2 className="font-medium text-blue-800 dark:text-blue-300">{t.fallbackTitle}</h2>
            <p className="mt-1 text-blue-700 dark:text-blue-400">{t.fallbackDesc}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-2 border-gray-100 dark:border-gray-700">
                    {imageUrl ? (
                      <AvatarImage src={imageUrl} alt={name} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xl dark:bg-blue-900 dark:text-blue-200">
                        {getInitials(name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">{name}</h2>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {position}
                    {company && ` at ${company}`}
                  </div>
                </div>

                <Separator className="my-6 dark:bg-gray-700" />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.contactInformation}</h3>

                  {email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        {email}
                      </a>
                    </div>
                  )}

                  {phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${phone}`} className="text-blue-600 hover:underline dark:text-blue-400">
                        {phone}
                      </a>
                    </div>
                  )}

                  {linkedinUrl && (
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin className="h-4 w-4 text-gray-400" />
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills & Languages Card (from fallback data) */}
            <Card className="dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-base">{t.skills}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {fallbackData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <h4 className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">{t.languages}</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {fallbackData.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Professional Summary */}
            <Card className="dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">{t.professionalSummary}</CardTitle>
              </CardHeader>
              <CardContent>
                {bio ? (
                  <p className="text-gray-700 dark:text-gray-300">{bio}</p>
                ) : (
                  <p className="text-gray-500 italic dark:text-gray-400">{t.noSummary}</p>
                )}
              </CardContent>
            </Card>

            {/* Current Position */}
            <Card className="dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">{t.currentPosition}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{position}</h3>
                    {company && <p className="text-gray-500 dark:text-gray-400">{company}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Timeline (for CEOs) */}
            {type === "ceo" && timeline.length > 0 && (
              <Card className="dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">{t.careerTimeline}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {timeline.map((item, index) => (
                      <div key={index} className="relative pl-8">
                        {/* Timeline connector */}
                        {index < timeline.length - 1 && (
                          <div className="absolute left-[10px] top-8 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-700" />
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-start">
                            <div className="absolute left-0 top-1 rounded-full w-5 h-5 border-2 border-blue-600 bg-white dark:bg-gray-900 dark:border-blue-500" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">{item.position}</div>
                              {item.company && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.company}</div>
                              )}
                              <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {item.startDate} - {item.endDate || t.present}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education (from fallback data) */}
            {fallbackData.education && (
              <Card className="dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">{t.education}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fallbackData.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{edu.degree}</h3>
                          <p className="text-gray-500 dark:text-gray-400">{edu.institution}</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects or Achievements (from fallback data) */}
            {(fallbackData.projects || fallbackData.achievements) && (
              <Card className="dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">{fallbackData.projects ? t.projects : t.achievements}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(fallbackData.projects || fallbackData.achievements)?.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

