import { Patient } from '../types/patient.ts'
import PatientCard from './PatientCard.tsx'
import './PatientList.css'

interface PatientListProps {
  patients: Patient[]
  isLoading: boolean
  onDeleteRequest: (patient: Patient) => void
}

const PatientList = ({ patients, isLoading, onDeleteRequest }: PatientListProps) => {
  if (isLoading) {
    return (
      <div className="patient-list-state">
        <div className="loading-spinner"></div>
        <p>Loading patients...</p>
      </div>
    )
  }

  if (patients.length === 0) {
    return (
      <div className="patient-list-state empty-state">
        <svg
          className="empty-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3>No patients yet</h3>
        <p>Start by adding your first patient using the button above</p>
      </div>
    )
  }

  return (
    <div className="patient-list">
      <h2 className="patient-list-title">Registered Patients ({patients.length})</h2>
      <div className="patient-grid">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} onDeleteRequest={onDeleteRequest} />
        ))}
      </div>
    </div>
  )
}

export default PatientList
