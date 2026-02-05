import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmModal from '../../components/ConfirmModal'

describe('ConfirmModal', () => {
  it('does not render when show is false', () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    const { container } = render(
      <ConfirmModal
        show={false}
        title="Delete Patient"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('renders when show is true', () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    render(
      <ConfirmModal
        show={true}
        title="Delete Patient"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Delete Patient')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('uses default labels when not provided', () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    render(
      <ConfirmModal
        show={true}
        title="Delete"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('uses custom labels when provided', () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    render(
      <ConfirmModal
        show={true}
        title="Delete Patient"
        message="Are you sure?"
        confirmLabel="Yes, Delete"
        cancelLabel="No, Keep"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByRole('button', { name: /Yes, Delete/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /No, Keep/i })).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    render(
      <ConfirmModal
        show={true}
        title="Delete"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const confirmButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.includes('Delete'))
    await user.click(confirmButton!)

    expect(mockOnConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    render(
      <ConfirmModal
        show={true}
        title="Delete"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.includes('Cancel'))
    await user.click(cancelButton!)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('calls onCancel when overlay is clicked', async () => {
    const user = userEvent.setup()
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    const { container } = render(
      <ConfirmModal
        show={true}
        title="Delete"
        message="Are you sure?"
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const overlay = container.querySelector('.modal-overlay')!
    await user.click(overlay)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('disables buttons when isProcessing is true', () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    render(
      <ConfirmModal
        show={true}
        title="Delete"
        message="Are you sure?"
        isProcessing={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      if (btn.textContent?.includes('Deleting') || btn.textContent?.includes('Cancel')) {
        expect(btn).toBeDisabled()
      }
    })
  })

  it('shows processing state text', () => {
    const mockOnConfirm = vi.fn()
    const mockOnCancel = vi.fn()
    render(
      <ConfirmModal
        show={true}
        title="Delete"
        message="Are you sure?"
        isProcessing={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Deleting...')).toBeInTheDocument()
  })
})
