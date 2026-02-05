import { useState } from 'react'
import { Patient } from '../types/patient.ts'
import './PatientCard.css'

interface PatientCardProps {
  patient: Patient
  onDeleteRequest: (patient: Patient) => void
}

const PatientCard = ({ patient, onDeleteRequest }: PatientCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDeleteRequest(patient)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className={`patient-card ${isExpanded ? 'expanded' : ''} slide-in`}>
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="card-image-container">
          <img
            src={patient.document_photo_url}
            alt={`${patient.full_name}'s document`}
            className="card-image"
          />
        </div>
        <div className="card-title-section">
          <h3 className="card-name">{patient.full_name}</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="delete-button"
              onClick={handleDelete}
              aria-label="Delete patient"
              title="Delete patient"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button className="expand-button" aria-label="Expand card">
              <svg
                className={`expand-icon ${isExpanded ? 'rotated' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="card-details scale-in">
          <div className="detail-item">
            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <span className="detail-label">Email</span>
              <span className="detail-value">{patient.email}</span>
            </div>
          </div>

          <div className="detail-item">
            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <span className="detail-label">Phone</span>
              <span className="detail-value">
                {patient.phone_country_code} {patient.phone_number}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <span className="detail-label">Registered</span>
              <span className="detail-value">{formatDate(patient.created_at)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientCard
