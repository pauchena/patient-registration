import { useEffect } from 'react'
import './Modal.css'

interface ConfirmModalProps {
  show: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isProcessing?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal = ({
  show,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
    document.body.style.overflow = 'unset'
  }, [show])

  if (!show) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-container">
          <svg
            className="modal-icon error-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86l-8 14A2 2 0 004.02 21h15.96a2 2 0 001.73-3.14l-8-14a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel} disabled={isProcessing}>
            {cancelLabel}
          </button>
          <button className="confirm-btn confirm" onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? 'Deleting...' : confirmLabel}
          </button>
        </div>

        <button className="modal-close-icon" onClick={onCancel} aria-label="Close modal">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ConfirmModal
