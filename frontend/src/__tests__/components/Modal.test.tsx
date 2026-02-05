import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../../components/Modal'

describe('Modal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not render when show is false', () => {
    const mockOnClose = vi.fn()
    const { container } = render(
      <Modal show={false} type="success" message="Test message" onClose={mockOnClose} />
    )

    expect(container.querySelector('.modal-overlay')).not.toBeInTheDocument()
  })

  it('renders success modal when show is true', () => {
    const mockOnClose = vi.fn()
    render(<Modal show={true} type="success" message="Test message" onClose={mockOnClose} />)

    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders error modal when type is error', () => {
    const mockOnClose = vi.fn()
    render(<Modal show={true} type="error" message="Error message" onClose={mockOnClose} />)

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const mockOnClose = vi.fn()
    render(<Modal show={true} type="success" message="Test message" onClose={mockOnClose} />)

    const buttons = screen.getAllByRole('button')
    const closeButton = buttons.find((btn) => btn.textContent === 'Close') || buttons[0]
    await user.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const mockOnClose = vi.fn()
    const { container } = render(
      <Modal show={true} type="success" message="Test message" onClose={mockOnClose} />
    )

    const overlay = container.querySelector('.modal-overlay')!
    await user.click(overlay)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('does not close when modal content is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const mockOnClose = vi.fn()
    const { container } = render(
      <Modal show={true} type="success" message="Test message" onClose={mockOnClose} />
    )

    const content = container.querySelector('.modal-content')!
    await user.click(content)

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('auto-closes after 5 seconds', () => {
    const mockOnClose = vi.fn()
    render(<Modal show={true} type="success" message="Test message" onClose={mockOnClose} />)

    vi.advanceTimersByTime(5000)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
