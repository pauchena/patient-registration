import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PatientList from '../../components/PatientList'
import { Patient } from '../../types/patient'

describe('PatientList', () => {
  const mockPatient: Patient = {
    id: 1,
    full_name: 'John Doe',
    email: 'john@gmail.com',
    phone_country_code: '+1',
    phone_number: '1234567890',
    document_photo_url: 'https://example.com/photo.jpg',
    created_at: '2025-02-05T10:00:00Z',
  }

  it('shows loading state when isLoading is true', () => {
    const mockOnDelete = vi.fn()
    render(<PatientList patients={[]} isLoading={true} onDeleteRequest={mockOnDelete} />)

    expect(screen.getByText('Loading patients...')).toBeInTheDocument()
  })

  it('shows empty state when no patients', () => {
    const mockOnDelete = vi.fn()
    render(<PatientList patients={[]} isLoading={false} onDeleteRequest={mockOnDelete} />)

    expect(screen.getByText('No patients yet')).toBeInTheDocument()
    expect(screen.getByText(/Start by adding your first patient/i)).toBeInTheDocument()
  })

  it('renders patient list with multiple patients', () => {
    const mockOnDelete = vi.fn()
    const patients = [mockPatient, { ...mockPatient, id: 2, full_name: 'Jane Smith' }]

    render(<PatientList patients={patients} isLoading={false} onDeleteRequest={mockOnDelete} />)

    expect(screen.getByText('Registered Patients (2)')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('displays correct patient count', () => {
    const mockOnDelete = vi.fn()
    const patients = Array(5)
      .fill(null)
      .map((_, i) => ({
        ...mockPatient,
        id: i + 1,
        full_name: `Patient ${i + 1}`,
      }))

    render(<PatientList patients={patients} isLoading={false} onDeleteRequest={mockOnDelete} />)

    expect(screen.getByText('Registered Patients (5)')).toBeInTheDocument()
  })

  it('passes onDeleteRequest to PatientCard', () => {
    const mockOnDelete = vi.fn()
    const patients = [mockPatient]

    render(<PatientList patients={patients} isLoading={false} onDeleteRequest={mockOnDelete} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('does not show loading spinner when isLoading is false and patients exist', () => {
    const mockOnDelete = vi.fn()
    const { container } = render(
      <PatientList patients={[mockPatient]} isLoading={false} onDeleteRequest={mockOnDelete} />
    )

    expect(container.querySelector('.loading-spinner')).not.toBeInTheDocument()
  })

  it('does not show empty state when patients exist', () => {
    const mockOnDelete = vi.fn()
    render(
      <PatientList patients={[mockPatient]} isLoading={false} onDeleteRequest={mockOnDelete} />
    )

    expect(screen.queryByText('No patients yet')).not.toBeInTheDocument()
  })
})
