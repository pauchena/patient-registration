import { Patient, CreatePatientData, ApiResponse } from '../types/patient'

const API_BASE_URL = '/api/v1'

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients`)
    const data: ApiResponse<Patient[]> = await response.json()

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to fetch patients')
    }

    return data.data
  },

  async createPatient(patientData: CreatePatientData): Promise<Patient> {
    const formData = new FormData()
    formData.append('full_name', patientData.full_name)
    formData.append('email', patientData.email)
    formData.append('phone_country_code', patientData.phone_country_code)
    formData.append('phone_number', patientData.phone_number)
    formData.append('document_photo', patientData.document_photo)

    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      body: formData,
    })

    const contentType = response.headers.get('content-type')
    const text = await response.text()

    if (!text) {
      throw new Error('Server returned empty response')
    }

    let data: ApiResponse<Patient>
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('Invalid JSON response:', text)
      throw new Error(`Server returned invalid response: ${text.substring(0, 100)}`)
    }

    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      }
    }

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to create patient')
    }

    return data.data
  },

  async deletePatient(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'DELETE',
    })

    const text = await response.text()

    if (!text) {
      throw new Error('Server returned empty response')
    }

    let data: ApiResponse<null>
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error('Invalid JSON response:', text)
      throw new Error(`Server returned invalid response: ${text.substring(0, 100)}`)
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete patient')
    }
  },
}
