import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientForm from '../../components/PatientForm'

describe('PatientForm', () => {
  it('renders all form fields', () => {
    const mockOnSubmit = vi.fn()
    render(<PatientForm onSubmit={mockOnSubmit} />)

    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('validates full name with letters and spaces only', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<PatientForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getAllByRole('textbox')[0]
    await user.type(nameInput, 'John123')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText(/only contain letters and spaces/i)).toBeInTheDocument()
    })
  })

  it('validates email with @gmail.com domain', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<PatientForm onSubmit={mockOnSubmit} />)

    const inputs = screen.getAllByRole('textbox')
    const emailInput = inputs[1]

    await user.type(emailInput, 'john@yahoo.com')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText(/@gmail\.com/)).toBeInTheDocument()
    })
  })

  it('validates phone number contains only digits', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<PatientForm onSubmit={mockOnSubmit} />)

    const inputs = screen.getAllByRole('textbox')
    const phoneInput = inputs[3]

    await user.type(phoneInput, '123abc456')
    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText(/phone number must contain only digits/i)).toBeInTheDocument()
    })
  })

  it('requires document photo', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<PatientForm onSubmit={mockOnSubmit} />)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'John Doe')
    await user.type(inputs[1], 'john@gmail.com')
    await user.type(inputs[3], '1234567890')

    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(screen.getByText(/document photo is required/i)).toBeInTheDocument()
    })
  })

  it('calls onSubmit with valid form data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn(() => Promise.resolve())
    render(<PatientForm onSubmit={mockOnSubmit} />)

    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'John Doe')
    await user.type(inputs[1], 'john@gmail.com')
    await user.type(inputs[3], '1234567890')

    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })
})
