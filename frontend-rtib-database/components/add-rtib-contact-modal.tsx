"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export type RTIBContactData = {
  id: string
  name: string
  position: string
  email: string
  phone?: string
  imageUrl?: string
}

type FormData = {
  name: string
  position: string
  email: string
  phone: string
  imageUrl: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

// Translations for the modal
const translations = {
  en: {
    title: "Add RTIB Contact",
    titleUpdate: "Update RTIB Contact",
    subtitle: "Enter the RTIB contact details below. Required fields are marked with an asterisk (*).",
    basicInfo: "Contact Information",
    name: "Full Name",
    position: "Position",
    contactInfo: "Contact Details",
    email: "Email",
    phone: "Phone",
    profileImage: "Profile Image",
    uploadImage: "Upload Image",
    imageUrl: "Image URL",
    cancel: "Cancel",
    add: "Add Contact",
    update: "Update Contact",
    processing: "Processing...",
    // Validation messages
    nameRequired: "Full name is required",
    positionRequired: "Position is required",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
  },
  tr: {
    title: "RTIB İletişim Ekle",
    titleUpdate: "RTIB İletişim Güncelle",
    subtitle: "RTIB iletişim bilgilerini aşağıya girin. Zorunlu alanlar yıldız (*) ile işaretlenmiştir.",
    basicInfo: "İletişim Bilgileri",
    name: "Tam Ad",
    position: "Pozisyon",
    contactInfo: "İletişim Detayları",
    email: "E-posta",
    phone: "Telefon",
    profileImage: "Profil Resmi",
    uploadImage: "Resim Yükle",
    imageUrl: "Resim URL",
    cancel: "İptal",
    add: "İletişim Ekle",
    update: "İletişim Güncelle",
    processing: "İşleniyor...",
    // Validation messages
    nameRequired: "Tam ad gereklidir",
    positionRequired: "Pozisyon gereklidir",
    emailRequired: "E-posta gereklidir",
    emailInvalid: "Lütfen geçerli bir e-posta adresi girin",
  },
  ru: {
    title: "Добавить контакт RTIB",
    titleUpdate: "Обновить контакт RTIB",
    subtitle: "Введите контактные данные RTIB ниже. Обязательные поля отмечены звездочкой (*).",
    basicInfo: "Контактная информация",
    name: "Полное имя",
    position: "Должность",
    contactInfo: "Контактные данные",
    email: "Электронная почта",
    phone: "Телефон",
    profileImage: "Изображение профиля",
    uploadImage: "Загрузить изображение",
    imageUrl: "URL изображения",
    cancel: "Отмена",
    add: "Добавить контакт",
    update: "Обновить контакт",
    processing: "Обработка...",
    // Validation messages
    nameRequired: "Полное имя обязательно",
    positionRequired: "Должность обязательна",
    emailRequired: "Электронная почта обязательна",
    emailInvalid: "Пожалуйста, введите действительный адрес электронной почты",
  },
}

export function AddRTIBContactModal({
  isOpen,
  onClose,
  onSubmit,
  existingContact,
  language = "en",
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (contact: RTIBContactData) => void
  existingContact?: RTIBContactData
  language?: "en" | "tr" | "ru"
}) {
  const t = translations[language]
  const isUpdate = !!existingContact

  const initialFormData: FormData = {
    name: existingContact?.name || "",
    position: existingContact?.position || "",
    email: existingContact?.email || "",
    phone: existingContact?.phone || "",
    imageUrl: existingContact?.imageUrl || "",
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(existingContact?.imageUrl || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.name) newErrors.name = t.nameRequired
    if (!formData.position) newErrors.position = t.positionRequired
    if (!formData.email) newErrors.email = t.emailRequired

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

    // Create the contact object
    const contactData: RTIBContactData = {
      id: existingContact?.id || `rtib-${Date.now()}`,
      name: formData.name,
      position: formData.position,
      email: formData.email,
      phone: formData.phone || undefined,
      imageUrl: formData.imageUrl || previewImage || undefined,
    }

    // Call the onSubmit prop with the contact data
    setTimeout(() => {
      onSubmit(contactData)
      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setErrors({})
    if (!existingContact) {
      setPreviewImage(null)
    }
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-semibold">{isUpdate ? t.titleUpdate : t.title}</DialogTitle>
          <p className="text-sm text-gray-500">{t.subtitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                placeholder="Regional Manager"
              />
              {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">{t.contactInfo}</h3>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                {t.email} <span className="text-red-500">*</span>
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
              <Label htmlFor="phone" className="text-sm font-medium">
                {t.phone}
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1.5"
                placeholder="+7 (XXX) XXX-XXXX"
              />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Profile Image */}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-full">
              {t.cancel}
            </Button>
            <Button type="submit" className="rounded-full bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
              {isSubmitting ? t.processing : isUpdate ? t.update : t.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

