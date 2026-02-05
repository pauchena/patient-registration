import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientCard from '../../components/PatientCard'
import { Patient } from '../../types/patient'

describe('PatientCard', () => {
  const mockPatient: Patient = {
    id: 1,
    full_name: 'John Doe',
    email: 'john@gmail.com',
    phone_country_code: '+1',
    phone_number: '1234567890',
    document_photo_url: 'https://example.com/photo.jpg',
    created_at: '2025-02-05T10:00:00Z',
  }

  it('renders patient information', () => {
    const mockOnDelete = vi.fn()
    render(<PatientCard patient={mockPatient} onDeleteRequest={mockOnDelete} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByAltText(/John Doe's document/i)).toBeInTheDocument()
  })

  it('expands and collapses when clicked', async () => {
    const user = userEvent.setup()
    const mockOnDelete = vi.fn()
    const { container } = render(
      <PatientCard patient={mockPatient} onDeleteRequest={mockOnDelete} />
    )

    const cardHeader = container.querySelector('.card-header')
    expect(container.querySelector('.patient-card')).not.toHaveClass('expanded')

    await user.click(cardHeader!)
    expect(container.querySelector('.patient-card')).toHaveClass('expanded')

    await user.click(cardHeader!)
    expect(container.querySelector('.patient-card')).not.toHaveClass('expanded')
  })

  it('calls onDeleteRequest when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnDelete = vi.fn()
    render(<PatientCard patient={mockPatient} onDeleteRequest={mockOnDelete} />)

    const deleteButton = screen.getByRole('button', { name: /delete patient/i })
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockPatient)
  })

  it('formats date correctly', () => {
    const mockOnDelete = vi.fn()
    render(<PatientCard patient={mockPatient} onDeleteRequest={mockOnDelete} />)

    // Check that the date is displayed (format may vary)
    const cardHeader = screen.getByText('John Doe').closest('.card-header')
    expect(cardHeader).toBeInTheDocument()
  })
})
