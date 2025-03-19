export interface OrganizationMember {
  id: string
  name: string
  position: string
  department?: string
  email?: string
  phone?: string
  linkedinUrl?: string
  imageUrl?: string
  level: number
  parentId?: string
}

export interface OrganizationChartData {
  nodes: OrganizationMember[]
}

