"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import type { CEOData } from "@/components/ceo-profile-hover"

type TimelineEntry = {
  position: string
  company?: string
  startDate: string
  endDate?: string
}

type FormData = {
  name: string
  position: string
  company: string
  bio: string
  email: string
  linkedinUrl: string
  imageUrl: string
  timeline: TimelineEntry[]
}

type FormErrors = {
  [key in keyof FormData]?: string
} & {
  timeline?: { [key: number]: { [key: string]: string } }
}

// Translations for the modal
const translations = {
  en: {
    title: "Add CEO",
    subtitle: "Enter the CEO details below. Required fields are marked with an asterisk (*).",
    basicInfo: "Basic Information",
    name: "Full Name",
    position: "Position",
    company: "Company",
    contactInfo: "Contact Information",
    email: "Email",
    linkedin: "LinkedIn URL",
    additionalInfo: "Additional Information",
    bio: "Bio",
    profileImage: "Profile Image",
    uploadImage: "Upload Image",
    imageUrl: "Image URL",
    timeline: "Career Timeline",
    addTimelineEntry: "Add Timeline Entry",
    timelinePosition: "Position",
    timelineCompany: "Company",
    timelineStartDate: "Start Date",
    timelineEndDate: "End Date (leave blank for present)",
    removeEntry: "Remove Entry",
    cancel: "Cancel",
    add: "Add CEO",
    adding: "Adding...",
    // Validation messages
    nameRequired: "Full name is required",
    positionRequired: "Position is required",
    bioRequired: "Bio is required",
    emailInvalid: "Please enter a valid email address",
    timelinePositionRequired: "Position is required",
    timelineStartDateRequired: "Start date is required",
  },
  tr: {
    title: "CEO Ekle",
    subtitle: "CEO bilgilerini aşağıya girin. Zorunlu alanlar yıldız (*) ile işaretlenmiştir.",
    basicInfo: "Temel Bilgiler",
    name: "Tam Ad",
    position: "Pozisyon",
    company: "Şirket",
    contactInfo: "İletişim Bilgileri",
    email: "E-posta",
    linkedin: "LinkedIn URL",
    additionalInfo: "Ek Bilgiler",
    bio: "Biyografi",
    profileImage: "Profil Resmi",
    uploadImage: "Resim Yükle",
    imageUrl: "Resim URL",
    timeline: "Kariyer Zaman Çizelgesi",
    addTimelineEntry: "Zaman Çizelgesi Girişi Ekle",
    timelinePosition: "Pozisyon",
    timelineCompany: "Şirket",
    timelineStartDate: "Başlangıç Tarihi",
    timelineEndDate: "Bitiş Tarihi (şimdiki zaman için boş bırakın)",
    removeEntry: "Girişi Kaldır",
    cancel: "İptal",
    add: "CEO Ekle",
    adding: "Ekleniyor...",
    // Validation messages
    nameRequired: "Tam ad gereklidir",
    positionRequired: "Pozisyon gereklidir",
    bioRequired: "Biyografi gereklidir",
    emailInvalid: "Lütfen geçerli bir e-posta adresi girin",
    timelinePositionRequired: "Pozisyon gereklidir",
    timelineStartDateRequired: "Başlangıç tarihi gereklidir",
  },
  ru: {
    title: "Добавить генерального директора",
    subtitle: "Введите данные генерального директора ниже. Обязательные поля отмечены звездочкой (*).",
    basicInfo: "Основная информация",
    name: "Полное имя",
    position: "Должность",
    company: "Компания",
    contactInfo: "Контактная информация",
    email: "Электронная почта",
    linkedin: "LinkedIn URL",
    additionalInfo: "Дополнительная информация",
    bio: "Биография",
    profileImage: "Изображение профиля",
    uploadImage: "Загрузить изображение",
    imageUrl: "URL изображения",
    timeline: "Карьерная хронология",
    addTimelineEntry: "Добавить запись в хронологию",
    timelinePosition: "Должность",
    timelineCompany: "Компания",
    timelineStartDate: "Дата начала",
    timelineEndDate: "Дата окончания (оставьте пустым для настоящего времени)",
    removeEntry: "Удалить запись",
    cancel: "Отмена",
    add: "Добавить генерального директора",
    adding: "Добавление...",
    // Validation messages
    nameRequired: "Полное имя обязательно",
    positionRequired: "Должность обязательна",
    bioRequired: "Биография обязательна",
    emailInvalid: "Пожалуйста, введите действительный адрес электронной почты",
    timelinePositionRequired: "Должность обязательна",
    timelineStartDateRequired: "Дата начала обязательна",
  },
}

export function AddCEOModal({
  isOpen,
  onClose,
  onSubmit,
  companyName,
  language = "en",
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ceo: CEOData) => void
  companyName: string
  language?: "en" | "tr" | "ru"
}) {
  const t = translations[language]

  const initialFormData: FormData = {
    name: "",
    position: "CEO",
    company: companyName,
    bio: "",
    email: "",
    linkedinUrl: "",
    imageUrl: "",
    timeline: [
      {
        position: "CEO",
        company: companyName,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      },
    ],
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleTimelineChange = (index: number, field: keyof TimelineEntry, value: string) => {
    setFormData((prev) => {
      const newTimeline = [...prev.timeline]
      newTimeline[index] = { ...newTimeline[index], [field]: value }
      return { ...prev, timeline: newTimeline }
    })

    // Clear error when user types
    if (errors.timeline?.[index]?.[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        if (newErrors.timeline && newErrors.timeline[index]) {
          newErrors.timeline[index] = { ...newErrors.timeline[index], [field]: undefined }
        }
        return newErrors
      })
    }
  }

  const addTimelineEntry = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
        },
      ],
    }))
  }

  const removeTimelineEntry = (index: number) => {
    setFormData((prev) => {
      const newTimeline = [...prev.timeline]
      newTimeline.splice(index, 1)
      return { ...prev, timeline: newTimeline }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.name) newErrors.name = t.nameRequired
    if (!formData.position) newErrors.position = t.positionRequired
    if (!formData.bio) newErrors.bio = t.bioRequired

    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t.emailInvalid
    }

    // Timeline validation
    const timelineErrors: { [key: number]: { [key: string]: string } } = {}
    let hasTimelineErrors = false

    formData.timeline.forEach((entry, index) => {
      const entryErrors: { [key: string]: string } = {}

      if (!entry.position) {
        entryErrors.position = t.timelinePositionRequired
        hasTimelineErrors = true
      }

      if (!entry.startDate) {
        entryErrors.startDate = t.timelineStartDateRequired
        hasTimelineErrors = true
      }

      if (Object.keys(entryErrors).length > 0) {
        timelineErrors[index] = entryErrors
      }
    })

    if (hasTimelineErrors) {
      newErrors.timeline = timelineErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Create the CEO object
    const newCEO: CEOData = {
      name: formData.name,
      position: formData.position,
      company: formData.company,
      bio: formData.bio,
      email: formData.email,
      linkedinUrl: formData.linkedinUrl,
      imageUrl: formData.imageUrl || previewImage || undefined,
      timeline: formData.timeline,
    }

    // Call the onSubmit prop with the new CEO
    setTimeout(() => {
      onSubmit(newCEO)
      setIsSubmitting(false)
      setFormData(initialFormData)
      setPreviewImage(null)
      onClose()
    }, 500)
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setErrors({})
    setPreviewImage(null)
    onClose()
  }

  // Handle image upload (in a real app, this would upload to a server)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-semibold">{t.title}</DialogTitle>
          <p className="text-sm text-gray-500">{t.subtitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">{t.basicInfo}</h3>
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  {t.name} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1.5 ${errors.name ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position" className="text-sm font-medium">
                    {t.position} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`mt-1.5 ${errors.position ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                    placeholder="CEO"
                  />
                  {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium">
                    {t.company}
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1.5"
                    disabled
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">{t.contactInfo}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1.5 ${errors.email ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="linkedinUrl" className="text-sm font-medium">
                    {t.linkedin}
                  </Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="mt-1.5"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">{t.additionalInfo}</h3>
              <div>
                <Label htmlFor="bio" className="text-sm font-medium">
                  {t.bio} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className={`mt-1.5 min-h-[100px] ${errors.bio ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                  placeholder="Brief description of the CEO's background and expertise..."
                />
                {errors.bio && <p className="mt-1 text-xs text-red-500">{errors.bio}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">{t.profileImage}</Label>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-16 w-16 border border-gray-200">
                      {previewImage ? (
                        <AvatarImage src={previewImage} alt="Preview" />
                      ) : (
                        <AvatarFallback className="bg-gray-100 text-gray-400">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <Label htmlFor="imageUpload" className="text-xs text-gray-500">
                        {t.uploadImage}
                      </Label>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="imageUrl" className="text-xs text-gray-500">
                        {t.imageUrl}
                      </Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Career Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">{t.timeline}</h3>

              <div className="space-y-6">
                {formData.timeline.map((entry, index) => (
                  <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-medium">Timeline Entry #{index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-full p-0 text-gray-500 hover:text-red-500"
                          onClick={() => removeTimelineEntry(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t.removeEntry}</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`timeline-${index}-position`} className="text-sm font-medium">
                          {t.timelinePosition} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`timeline-${index}-position`}
                          value={entry.position}
                          onChange={(e) => handleTimelineChange(index, "position", e.target.value)}
                          className={`mt-1.5 ${
                            errors.timeline?.[index]?.position ? "border-red-300 focus-visible:ring-red-300" : ""
                          }`}
                          placeholder="CEO"
                        />
                        {errors.timeline?.[index]?.position && (
                          <p className="mt-1 text-xs text-red-500">{errors.timeline[index].position}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`timeline-${index}-company`} className="text-sm font-medium">
                          {t.timelineCompany}
                        </Label>
                        <Input
                          id={`timeline-${index}-company`}
                          value={entry.company || ""}
                          onChange={(e) => handleTimelineChange(index, "company", e.target.value)}
                          className="mt-1.5"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`timeline-${index}-startDate`} className="text-sm font-medium">
                          {t.timelineStartDate} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`timeline-${index}-startDate`}
                          type="date"
                          value={entry.startDate}
                          onChange={(e) => handleTimelineChange(index, "startDate", e.target.value)}
                          className={`mt-1.5 ${
                            errors.timeline?.[index]?.startDate ? "border-red-300 focus-visible:ring-red-300" : ""
                          }`}
                        />
                        {errors.timeline?.[index]?.startDate && (
                          <p className="mt-1 text-xs text-red-500">{errors.timeline[index].startDate}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`timeline-${index}-endDate`} className="text-sm font-medium">
                          {t.timelineEndDate}
                        </Label>
                        <Input
                          id={`timeline-${index}-endDate`}
                          type="date"
                          value={entry.endDate || ""}
                          onChange={(e) => handleTimelineChange(index, "endDate", e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" size="sm" className="mt-2 gap-1.5" onClick={addTimelineEntry}>
                  <Plus className="h-3.5 w-3.5" />
                  {t.addTimelineEntry}
                </Button>
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

