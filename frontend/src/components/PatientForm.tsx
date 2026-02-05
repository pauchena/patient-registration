import { useState, FormEvent, ChangeEvent } from 'react'
import { CreatePatientData, ValidationErrors } from '../types/patient.ts'
import FileUpload from './FileUpload.tsx'
import './PatientForm.css'

interface PatientFormProps {
  onSubmit: (data: CreatePatientData) => Promise<void>
}

const PatientForm = ({ onSubmit }: PatientFormProps) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_country_code: '+598',
    phone_number: '',
  })
  const [documentPhoto, setDocumentPhoto] = useState<File | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const validateField = (name: string, value: string | File | null): string => {
    switch (name) {
      case 'full_name':
        if (!value) return 'Full name is required'
        if (!/^[a-zA-Z\s]+$/.test(value as string)) {
          return 'Full name should only contain letters and spaces'
        }
        return ''

      case 'email':
        if (!value) return 'Email address is required'
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value as string)) {
          return 'Only @gmail.com email addresses are accepted'
        }
        return ''

      case 'phone_country_code':
        if (!value) return 'Country code is required'
        if (!/^\+\d{1,4}$/.test(value as string)) {
          return 'Country code must be a valid format (+ followed by 1-4 digits)'
        }
        return ''

      case 'phone_number':
        if (!value) return 'Phone number is required'
        if (!/^\d+$/.test(value as string)) {
          return 'Phone number must contain only digits'
        }
        return ''

      case 'document_photo': {
        if (!value) return 'Document photo is required'
        const file = value as File
        if (!file.type.match(/image\/jpe?g/)) {
          return 'Document photo must be a JPG image'
        }
        if (file.size > 10 * 1024 * 1024) {
          return 'Document photo must not exceed 10MB'
        }
        return ''
      }

      default:
        return ''
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }))

    if (hasSubmitted) {
      const error = validateField(name, value)
      setErrors((prev: ValidationErrors) => ({ ...prev, [name]: error || undefined }))
    }
  }

  const handleFileChange = (file: File | null) => {
    setDocumentPhoto(file)
    if (hasSubmitted) {
      const error = validateField('document_photo', file)
      setErrors((prev: ValidationErrors) => ({ ...prev, document_photo: error || undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof ValidationErrors] = error
        isValid = false
      }
    })

    const photoError = validateField('document_photo', documentPhoto)
    if (photoError) {
      newErrors.document_photo = photoError
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setHasSubmitted(true)

    if (!validateForm()) {
      return
    }

    if (!documentPhoto) {
      setErrors((prev: ValidationErrors) => ({
        ...prev,
        document_photo: 'Document photo is required',
      }))
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        document_photo: documentPhoto,
      })

      setFormData({
        full_name: '',
        email: '',
        phone_country_code: '+598',
        phone_number: '',
      })
      setDocumentPhoto(null)
      setErrors({})
      setHasSubmitted(false)
    } catch (error) {
      // Error is handled by parent component through modal
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="patient-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">Register New Patient</h2>

      <div className="form-grid">
        <div className={`form-group ${errors.full_name && hasSubmitted ? 'error shake' : ''}`}>
          <label htmlFor="full_name" className="form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="form-input"
            placeholder="John Doe"
          />
          {errors.full_name && hasSubmitted && (
            <span className="error-message slide-in">{errors.full_name}</span>
          )}
        </div>

        <div className={`form-group ${errors.email && hasSubmitted ? 'error shake' : ''}`}>
          <label htmlFor="email" className="form-label">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="example@gmail.com"
          />
          {errors.email && hasSubmitted && (
            <span className="error-message slide-in">{errors.email}</span>
          )}
        </div>

        <div className="form-group phone-group">
          <label className="form-label">Phone Number *</label>
          <div className="phone-inputs">
            <div
              className={`phone-code ${errors.phone_country_code && hasSubmitted ? 'error shake' : ''}`}
            >
              <input
                type="text"
                name="phone_country_code"
                value={formData.phone_country_code}
                onChange={handleChange}
                className="form-input"
                placeholder="+598"
              />
            </div>
            <div
              className={`phone-number ${errors.phone_number && hasSubmitted ? 'error shake' : ''}`}
            >
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="form-input"
                placeholder="12345678"
              />
            </div>
          </div>
          {errors.phone_country_code && hasSubmitted && (
            <span className="error-message slide-in">{errors.phone_country_code}</span>
          )}
          {errors.phone_number && hasSubmitted && (
            <span className="error-message slide-in">{errors.phone_number}</span>
          )}
        </div>

        <div
          className={`form-group form-group-full ${errors.document_photo && hasSubmitted ? 'error' : ''}`}
        >
          <label className="form-label">Document Photo *</label>
          <FileUpload
            file={documentPhoto}
            onChange={handleFileChange}
            error={errors.document_photo && hasSubmitted ? errors.document_photo : undefined}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Registering...
            </>
          ) : (
            'Register Patient'
          )}
        </button>
      </div>
    </form>
  )
}

export default PatientForm
