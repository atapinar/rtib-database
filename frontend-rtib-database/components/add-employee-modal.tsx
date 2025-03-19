"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { EmployeeData } from "@/components/employee-profile-hover"

type FormData = {
  name: string
  position: string
  department: string
  email: string
  linkedinUrl: string
  bio: string
  imageUrl: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

// Translations for the modal
const translations = {
  en: {
    title: "Add New Employee",
    subtitle: "Enter the employee details below. Required fields are marked with an asterisk (*).",
    basicInfo: "Basic Information",
    name: "Full Name",
    position: "Position",
    department: "Department",
    contactInfo: "Contact Information",
    email: "Email",
    linkedin: "LinkedIn URL",
    additionalInfo: "Additional Information",
    bio: "Bio",
    profileImage: "Profile Image",
    uploadImage: "Upload Image",
    imageUrl: "Image URL",
    cancel: "Cancel",
    add: "Add Employee",
    adding: "Adding...",
    // Validation messages
    nameRequired: "Full name is required",
    positionRequired: "Position is required",
    departmentRequired: "Department is required",
    emailInvalid: "Please enter a valid email address",
    // Department options
    departments: {
      management: "Management",
      finance: "Finance",
      marketing: "Marketing",
      sales: "Sales",
      operations: "Operations",
      hr: "Human Resources",
      it: "IT",
      legal: "Legal",
      other: "Other",
    },
  },
  tr: {
    title: "Yeni Çalışan Ekle",
    subtitle: "Çalışan bilgilerini aşağıya girin. Zorunlu alanlar yıldız (*) ile işaretlenmiştir.",
    basicInfo: "Temel Bilgiler",
    name: "Tam Ad",
    position: "Pozisyon",
    department: "Departman",
    contactInfo: "İletişim Bilgileri",
    email: "E-posta",
    linkedin: "LinkedIn URL",
    additionalInfo: "Ek Bilgiler",
    bio: "Biyografi",
    profileImage: "Profil Resmi",
    uploadImage: "Resim Yükle",
    imageUrl: "Resim URL",
    cancel: "İptal",
    add: "Çalışan Ekle",
    adding: "Ekleniyor...",
    // Validation messages
    nameRequired: "Tam ad gereklidir",
    positionRequired: "Pozisyon gereklidir",
    departmentRequired: "Departman gereklidir",
    emailInvalid: "Lütfen geçerli bir e-posta adresi girin",
    // Department options
    departments: {
      management: "Yönetim",
      finance: "Finans",
      marketing: "Pazarlama",
      sales: "Satış",
      operations: "Operasyon",
      hr: "İnsan Kaynakları",
      it: "Bilgi Teknolojileri",
      legal: "Hukuk",
      other: "Diğer",
    },
  },
  ru: {
    title: "Добавить нового сотрудника",
    subtitle: "Введите данные сотрудника ниже. Обязательные поля отмечены звездочкой (*).",
    basicInfo: "Основная информация",
    name: "Полное имя",
    position: "Должность",
    department: "Отдел",
    contactInfo: "Контактная информация",
    email: "Электронная почта",
    linkedin: "LinkedIn URL",
    additionalInfo: "Дополнительная информация",
    bio: "Биография",
    profileImage: "Изображение профиля",
    uploadImage: "Загрузить изображение",
    imageUrl: "URL изображения",
    cancel: "Отмена",
    add: "Добавить сотрудника",
    adding: "Добавление...",
    // Validation messages
    nameRequired: "Полное имя обязательно",
    positionRequired: "Должность обязательна",
    departmentRequired: "Отдел обязателен",
    emailInvalid: "Пожалуйста, введите действительный адрес электронной почты",
    // Department options
    departments: {
      management: "Управление",
      finance: "Финансы",
      marketing: "Маркетинг",
      sales: "Продажи",
      operations: "Операции",
      hr: "Кадры",
      it: "ИТ",
      legal: "Юридический",
      other: "Другое",
    },
  },
}

export function AddEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  companyId,
  language = "en",
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (employee: EmployeeData) => void
  companyId: string
  language?: "en" | "tr" | "ru"
}) {
  const t = translations[language]

  const initialFormData: FormData = {
    name: "",
    position: "",
    department: "",
    email: "",
    linkedinUrl: "",
    bio: "",
    imageUrl: "",
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
    if (!formData.position) newErrors.position = t.positionRequired
    if (!formData.department) newErrors.department = t.departmentRequired

    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t.emailInvalid
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Generate a unique ID for the new employee
    const newId = `emp-${Date.now()}`

    // Create the employee object
    const newEmployee: EmployeeData = {
      id: newId,
      name: formData.name,
      position: formData.position,
      department: formData.department,
      company: `Company ${companyId}`, // This would be replaced with actual company name
      bio: formData.bio,
      email: formData.email,
      linkedinUrl: formData.linkedinUrl,
      imageUrl: formData.imageUrl || previewImage || undefined,
    }

    // Call the onSubmit prop with the new employee
    setTimeout(() => {
      onSubmit(newEmployee)
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
                    placeholder="Marketing Manager"
                  />
                  {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
                </div>

                <div>
                  <Label htmlFor="department" className="text-sm font-medium">
                    {t.department} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger
                      id="department"
                      className={`mt-1.5 ${errors.department ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                    >
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(t.departments).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
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
                  {t.bio}
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1.5 min-h-[100px]"
                  placeholder="Brief description of the employee's background and expertise..."
                />
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

