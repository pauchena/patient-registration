import { useState, useEffect } from 'react'
import PatientList from './components/PatientList.tsx'
import PatientForm from './components/PatientForm.tsx'
import Modal from './components/Modal.tsx'
import ConfirmModal from './components/ConfirmModal.tsx'
import { Patient, CreatePatientData } from './types/patient.ts'
import { patientService } from './services/patientService.ts'
import './App.css'

function App() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [modalState, setModalState] = useState<{
    show: boolean
    type: 'success' | 'error'
    message: string
  }>({
    show: false,
    type: 'success',
    message: '',
  })
  const [confirmState, setConfirmState] = useState<{
    show: boolean
    patient: Patient | null
  }>({
    show: false,
    patient: null,
  })
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      const data = await patientService.getAllPatients()
      setPatients(data)
    } catch (error) {
      console.error('Error fetching patients:', error)
      setModalState({
        show: true,
        type: 'error',
        message: 'Failed to load patients. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleAddPatient = async (data: CreatePatientData) => {
    try {
      await patientService.createPatient(data)
      setModalState({
        show: true,
        type: 'success',
        message: 'Patient registered successfully! A confirmation email has been sent.',
      })
      setShowForm(false)
      await fetchPatients()
    } catch (error: unknown) {
      let errorMessage = 'Failed to register patient. Please try again.'

      if (error && typeof error === 'object' && 'errors' in error) {
        const firstError = Object.values((error as { errors: Record<string, unknown> }).errors)[0]
        errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError)
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as { message: unknown }).message)
      }

      setModalState({
        show: true,
        type: 'error',
        message: errorMessage,
      })
      throw error
    }
  }

  const handleDeletePatient = async (id: number) => {
    try {
      setIsDeleting(true)
      await patientService.deletePatient(id)
      await fetchPatients()
      setModalState({
        show: true,
        type: 'success',
        message: 'Patient deleted successfully!',
      })
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Failed to delete patient. Please try again.'

      setModalState({
        show: true,
        type: 'error',
        message: errorMessage,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteRequest = (patient: Patient) => {
    setConfirmState({ show: true, patient })
  }

  const handleConfirmDelete = async () => {
    if (!confirmState.patient) return
    await handleDeletePatient(confirmState.patient.id)
    setConfirmState({ show: false, patient: null })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Patient Registry</h1>
          <p>Manage patient registrations efficiently</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="actions-bar">
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Patient'}
            </button>
          </div>

          {showForm && (
            <div className="form-container fade-in">
              <PatientForm onSubmit={handleAddPatient} />
            </div>
          )}

          <PatientList
            patients={patients}
            isLoading={isLoading}
            onDeleteRequest={handleDeleteRequest}
          />
        </div>
      </main>

      <Modal
        show={modalState.show}
        type={modalState.type}
        message={modalState.message}
        onClose={() => setModalState({ ...modalState, show: false })}
      />
      <ConfirmModal
        show={confirmState.show}
        title="Delete patient?"
        message={
          confirmState.patient
            ? `This will permanently remove ${confirmState.patient.full_name}.`
            : 'This will permanently remove this patient.'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ show: false, patient: null })}
        isProcessing={isDeleting}
      />
    </div>
  )
}

export default App
