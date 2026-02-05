import { useEffect } from 'react'
import './Modal.css'

interface ModalProps {
  show: boolean
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

const Modal = ({ show, type, message, onClose }: ModalProps) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'

      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = 'unset'
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${type} scale-in`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-container">
          {type === 'success' ? (
            <svg
              className="modal-icon success-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        <h3 className="modal-title">{type === 'success' ? 'Success!' : 'Error'}</h3>

        <p className="modal-message">{message}</p>

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>

        <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
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

export default Modal
