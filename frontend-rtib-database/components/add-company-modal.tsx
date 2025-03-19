"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

type FormData = {
  name: string
  sector: string
  type: string
  established: string
  address: string
  website?: string
  socialMedia?: string
  description?: string
  investment?: string
  revenue?: string
  importVolume?: string
  exportVolume?: string
  employees?: string
  mainShareholder?: string
  subsidiaries?: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

// Translations for the modal
const translations = {
  en: {
    title: "Add New Company",
    subtitle: "Enter the company details below. Required fields are marked with an asterisk (*).",
    basicInfo: "Basic Information",
    companyName: "Company Name",
    sector: "Sector",
    companyType: "Company Type",
    yearEstablished: "Year Established",
    locationDetails: "Location Details",
    addressInRussia: "Address in Russia",
    contactInfo: "RTIB Contact Information",
    contactName: "Contact Name",
    position: "Position",
    email: "Email",
    phone: "Phone",
    cancel: "Cancel",
    add: "Add Company",
    adding: "Adding...",
    selectSector: "Select sector",
    selectType: "Select type",
    enterCompanyName: "Enter company name",
    enterYear: "e.g. 1995",
    enterAddress: "Enter company address in Russia",
    enterContactName: "Enter contact name",
    enterPosition: "e.g. RTIB Representative",
    enterEmail: "email@example.com",
    enterPhone: "+7 (XXX) XXX-XXXX",
    // Validation messages
    nameRequired: "Company name is required",
    sectorRequired: "Sector is required",
    typeRequired: "Company type is required",
    establishedRequired: "Establishment year is required",
    addressRequired: "Address is required",
    contactNameRequired: "Contact name is required",
    emailInvalid: "Please enter a valid email address",
    financialInfo: "Financial Information",
    investment: "Investment in Russia",
    revenue: "Annual Revenue",
    importVolume: "Import Volume",
    exportVolume: "Export Volume",
    employees: "Number of Employees",
    enterInvestment: "e.g. 5000000",
    enterRevenue: "e.g. 10000000",
    enterImportVolume: "e.g. 2000000",
    enterExportVolume: "e.g. 1000000",
    enterEmployees: "e.g. 100",
    notice: "CEO, Employees, and RTIB Contact information can be added separately after the company is created.",
    description: "Company Description",
    enterDescription: "Brief description of the company...",
    website: "Company Website",
    enterWebsite: "https://example.com",
    socialMedia: "Social Media Links",
    enterSocialMedia: "LinkedIn, Twitter, etc.",
    mainShareholder: "Main Shareholder",
    enterMainShareholder: "Parent company or main shareholder",
    subsidiaries: "Subsidiaries",
    enterSubsidiaries: "Comma-separated list of subsidiaries",
  },
  tr: {
    title: "Yeni Şirket Ekle",
    subtitle: "Şirket bilgilerini aşağıya girin. Zorunlu alanlar yıldız (*) ile işaretlenmiştir.",
    basicInfo: "Temel Bilgiler",
    companyName: "Şirket Adı",
    sector: "Sektör",
    companyType: "Şirket Türü",
    yearEstablished: "Kuruluş Yılı",
    locationDetails: "Konum Bilgileri",
    addressInRussia: "Rusya'daki Adres",
    contactInfo: "RTIB İletişim Bilgileri",
    contactName: "İletişim Adı",
    position: "Pozisyon",
    email: "E-posta",
    phone: "Telefon",
    cancel: "İptal",
    add: "Şirket Ekle",
    adding: "Ekleniyor...",
    selectSector: "Sektör seçin",
    selectType: "Tür seçin",
    enterCompanyName: "Şirket adını girin",
    enterYear: "örn. 1995",
    enterAddress: "Rusya'daki şirket adresini girin",
    enterContactName: "İletişim adını girin",
    enterPosition: "örn. RTIB Temsilcisi",
    enterEmail: "email@example.com",
    enterPhone: "+7 (XXX) XXX-XXXX",
    // Validation messages
    nameRequired: "Şirket adı gereklidir",
    sectorRequired: "Sektör gereklidir",
    typeRequired: "Şirket türü gereklidir",
    establishedRequired: "Kuruluş yılı gereklidir",
    addressRequired: "Adres gereklidir",
    contactNameRequired: "İletişim adı gereklidir",
    emailInvalid: "Lütfen geçerli bir e-posta adresi girin",
    financialInfo: "Finansal Bilgiler",
    investment: "Rusya'daki Yatırım",
    revenue: "Yıllık Ciro",
    importVolume: "İthalat Hacmi",
    exportVolume: "İhracat Hacmi",
    employees: "Çalışan Sayısı",
    enterInvestment: "örn. 5000000",
    enterRevenue: "örn. 10000000",
    enterImportVolume: "örn. 2000000",
    enterExportVolume: "örn. 1000000",
    enterEmployees: "örn. 100",
    notice: "CEO, Çalışanlar ve RTIB İletişim bilgileri, şirket oluşturulduktan sonra ayrı olarak eklenebilir.",
    description: "Şirket Açıklaması",
    enterDescription: "Şirketin kısa açıklaması...",
    website: "Şirket Web Sitesi",
    enterWebsite: "https://example.com",
    socialMedia: "Sosyal Medya Bağlantıları",
    enterSocialMedia: "LinkedIn, Twitter, vb.",
    mainShareholder: "Ana Hissedar",
    enterMainShareholder: "Ana şirket veya ana hissedar",
    subsidiaries: "İştirakler",
    enterSubsidiaries: "Virgülle ayrılmış iştirakler listesi",
  },
  ru: {
    title: "Добавить новую компанию",
    subtitle: "Введите данные компании ниже. Обязательные поля отмечены звездочкой (*).",
    basicInfo: "Основная информация",
    companyName: "Название компании",
    sector: "Сектор",
    companyType: "Тип компании",
    yearEstablished: "Год основания",
    locationDetails: "Информация о местоположении",
    addressInRussia: "Адрес в России",
    contactInfo: "Контактная информация RTIB",
    contactName: "Имя контакта",
    position: "Должность",
    email: "Электронная почта",
    phone: "Телефон",
    cancel: "Отмена",
    add: "Добавить компанию",
    adding: "Добавление...",
    selectSector: "Выберите сектор",
    selectType: "Выберите тип",
    enterCompanyName: "Введите название компании",
    enterYear: "напр. 1995",
    enterAddress: "Введите адрес компании в России",
    enterContactName: "Введите имя контакта",
    enterPosition: "напр. Представитель RTIB",
    enterEmail: "email@example.com",
    enterPhone: "+7 (XXX) XXX-XXXX",
    // Validation messages
    nameRequired: "Название компании обязательно",
    sectorRequired: "Сектор обязателен",
    typeRequired: "Тип компании обязателен",
    establishedRequired: "Год основания обязателен",
    addressRequired: "Адрес обязателен",
    contactNameRequired: "Имя контакта обязательно",
    emailInvalid: "Пожалуйста, введите действительный адрес электронной почты",
    financialInfo: "Финансовая информация",
    investment: "Инвестиции в России",
    revenue: "Годовой доход",
    importVolume: "Объем импорта",
    exportVolume: "Объем экспорта",
    employees: "Количество сотрудников",
    enterInvestment: "напр. 5000000",
    enterRevenue: "напр. 10000000",
    enterImportVolume: "напр. 2000000",
    enterExportVolume: "напр. 1000000",
    enterEmployees: "напр. 100",
    notice:
      "Информация о генеральном директоре, сотрудниках и контактах RTIB может быть добавлена отдельно после создания компании.",
    description: "Описание компании",
    enterDescription: "Краткое описание компании...",
    website: "Веб-сайт компании",
    enterWebsite: "https://example.com",
    socialMedia: "Ссылки на социальные сети",
    enterSocialMedia: "LinkedIn, Twitter и т. д.",
    mainShareholder: "Основной акционер",
    enterMainShareholder: "Материнская компания или основной акционер",
    subsidiaries: "Дочерние компании",
    enterSubsidiaries: "Список дочерних компаний, разделенных запятыми",
  },
}

export function AddCompanyModal({
  isOpen,
  onClose,
  onSubmit,
  language = "en",
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  language?: "en" | "tr" | "ru"
}) {
  const t = translations[language]

  const initialFormData: FormData = {
    name: "",
    sector: "",
    type: "",
    established: "",
    address: "",
    website: "",
    socialMedia: "",
    description: "",
    investment: "",
    revenue: "",
    importVolume: "",
    exportVolume: "",
    employees: "",
    mainShareholder: "",
    subsidiaries: "",
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.name) newErrors.name = t.nameRequired
    if (!formData.sector) newErrors.sector = t.sectorRequired
    if (!formData.type) newErrors.type = t.typeRequired
    if (!formData.established) newErrors.established = t.establishedRequired
    if (!formData.address) newErrors.address = t.addressRequired

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Call the onSubmit prop with the form data
    setTimeout(() => {
      console.log("Submitted company data:", formData)
      onSubmit(formData)
      setIsSubmitting(false)
      setFormData(initialFormData)
      onClose()
    }, 1000)
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setErrors({})
    onClose()
  }

  // Sector options based on language
  const sectorOptions = {
    en: [
      { value: "Food & Beverage", label: "Food & Beverage" },
      { value: "Manufacturing", label: "Manufacturing" },
      { value: "Healthcare", label: "Healthcare" },
      { value: "Energy", label: "Energy" },
      { value: "Construction", label: "Construction" },
      { value: "Electronics", label: "Electronics" },
      { value: "Technology", label: "Technology" },
      { value: "Finance", label: "Finance" },
    ],
    tr: [
      { value: "Food & Beverage", label: "Gıda ve İçecek" },
      { value: "Manufacturing", label: "Üretim" },
      { value: "Healthcare", label: "Sağlık" },
      { value: "Energy", label: "Enerji" },
      { value: "Construction", label: "İnşaat" },
      { value: "Electronics", label: "Elektronik" },
      { value: "Technology", label: "Teknoloji" },
      { value: "Finance", label: "Finans" },
    ],
    ru: [
      { value: "Food & Beverage", label: "Продукты питания и напитки" },
      { value: "Manufacturing", label: "Производство" },
      { value: "Healthcare", label: "Здравоохранение" },
      { value: "Energy", label: "Энергетика" },
      { value: "Construction", label: "Строительство" },
      { value: "Electronics", label: "Электроника" },
      { value: "Technology", label: "Технологии" },
      { value: "Finance", label: "Финансы" },
    ],
  }

  // Company type options based on language
  const companyTypeOptions = {
    en: [
      { value: "Joint Stock", label: "Joint Stock" },
      { value: "Holding", label: "Holding" },
      { value: "Limited Liability", label: "Limited Liability" },
      { value: "Partnership", label: "Partnership" },
    ],
    tr: [
      { value: "Joint Stock", label: "Anonim Şirket" },
      { value: "Holding", label: "Holding" },
      { value: "Limited Liability", label: "Limited Şirket" },
      { value: "Partnership", label: "Ortaklık" },
    ],
    ru: [
      { value: "Joint Stock", label: "Акционерное общество" },
      { value: "Holding", label: "Холдинг" },
      { value: "Limited Liability", label: "Общество с ограниченной ответственностью" },
      { value: "Partnership", label: "Товарищество" },
    ],
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-semibold">{t.title}</DialogTitle>
          <p className="text-sm text-gray-500">{t.subtitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Notice about separate forms */}
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
            <p>{t.notice}</p>
          </div>

          {/* Company Basic Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">{t.basicInfo}</h3>
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  {t.companyName} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1.5 ${errors.name ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                  placeholder={t.enterCompanyName}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sector" className="text-sm font-medium">
                    {t.sector} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.sector} onValueChange={(value) => handleSelectChange("sector", value)}>
                    <SelectTrigger
                      id="sector"
                      className={`mt-1.5 ${errors.sector ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                    >
                      <SelectValue placeholder={t.selectSector} />
                    </SelectTrigger>
                    <SelectContent>
                      {sectorOptions[language].map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sector && <p className="mt-1 text-xs text-red-500">{errors.sector}</p>}
                </div>

                <div>
                  <Label htmlFor="type" className="text-sm font-medium">
                    {t.companyType} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger
                      id="type"
                      className={`mt-1.5 ${errors.type ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                    >
                      <SelectValue placeholder={t.selectType} />
                    </SelectTrigger>
                    <SelectContent>
                      {companyTypeOptions[language].map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="established" className="text-sm font-medium">
                  {t.yearEstablished} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="established"
                  name="established"
                  value={formData.established}
                  onChange={handleChange}
                  className={`mt-1.5 ${errors.established ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                  placeholder={t.enterYear}
                />
                {errors.established && <p className="mt-1 text-xs text-red-500">{errors.established}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  {t.description}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1.5 min-h-[80px]"
                  placeholder={t.enterDescription}
                  rows={3}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Company Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">{t.locationDetails}</h3>
              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  {t.addressInRussia} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`mt-1.5 min-h-[80px] ${errors.address ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                  placeholder={t.enterAddress}
                  rows={3}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Web Presence */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Web Presence</h3>
              <div>
                <Label htmlFor="website" className="text-sm font-medium">
                  {t.website}
                </Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1.5"
                  placeholder={t.enterWebsite}
                />
              </div>
              <div>
                <Label htmlFor="socialMedia" className="text-sm font-medium">
                  {t.socialMedia}
                </Label>
                <Input
                  id="socialMedia"
                  name="socialMedia"
                  value={formData.socialMedia}
                  onChange={handleChange}
                  className="mt-1.5"
                  placeholder={t.enterSocialMedia}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">{t.financialInfo}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="investment" className="text-sm font-medium">
                    {t.investment}
                  </Label>
                  <Input
                    id="investment"
                    name="investment"
                    type="number"
                    value={formData.investment}
                    onChange={handleChange}
                    className="mt-1.5"
                    placeholder={t.enterInvestment}
                  />
                </div>
                <div>
                  <Label htmlFor="revenue" className="text-sm font-medium">
                    {t.revenue}
                  </Label>
                  <Input
                    id="revenue"
                    name="revenue"
                    type="number"
                    value={formData.revenue}
                    onChange={handleChange}
                    className="mt-1.5"
                    placeholder={t.enterRevenue}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="importVolume" className="text-sm font-medium">
                    {t.importVolume}
                  </Label>
                  <Input
                    id="importVolume"
                    name="importVolume"
                    type="number"
                    value={formData.importVolume}
                    onChange={handleChange}
                    className="mt-1.5"
                    placeholder={t.enterImportVolume}
                  />
                </div>
                <div>
                  <Label htmlFor="exportVolume" className="text-sm font-medium">
                    {t.exportVolume}
                  </Label>
                  <Input
                    id="exportVolume"
                    name="exportVolume"
                    type="number"
                    value={formData.exportVolume}
                    onChange={handleChange}
                    className="mt-1.5"
                    placeholder={t.enterExportVolume}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="employees" className="text-sm font-medium">
                  {t.employees}
                </Label>
                <Input
                  id="employees"
                  name="employees"
                  type="number"
                  value={formData.employees}
                  onChange={handleChange}
                  className="mt-1.5"
                  placeholder={t.enterEmployees}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Company Structure */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Company Structure</h3>
              <div>
                <Label htmlFor="mainShareholder" className="text-sm font-medium">
                  {t.mainShareholder}
                </Label>
                <Input
                  id="mainShareholder"
                  name="mainShareholder"
                  value={formData.mainShareholder}
                  onChange={handleChange}
                  className="mt-1.5"
                  placeholder={t.enterMainShareholder}
                />
              </div>
              <div>
                <Label htmlFor="subsidiaries" className="text-sm font-medium">
                  {t.subsidiaries}
                </Label>
                <Input
                  id="subsidiaries"
                  name="subsidiaries"
                  value={formData.subsidiaries}
                  onChange={handleChange}
                  className="mt-1.5"
                  placeholder={t.enterSubsidiaries}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-full">
              {t.cancel}
            </Button>
            <Button type="submit" className="rounded-full bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
              {isSubmitting ? t.adding : t.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

