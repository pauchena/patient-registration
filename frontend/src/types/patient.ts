export interface Patient {
  id: number
  full_name: string
  email: string
  phone_country_code: string
  phone_number: string
  document_photo_url: string
  created_at: string
}

export interface CreatePatientData {
  full_name: string
  email: string
  phone_country_code: string
  phone_number: string
  document_photo: File
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  error?: string
}

export interface ValidationErrors {
  full_name?: string
  email?: string
  phone_country_code?: string
  phone_number?: string
  document_photo?: string
}
