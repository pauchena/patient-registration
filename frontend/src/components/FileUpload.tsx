import { useState, useRef, DragEvent } from 'react'
import './FileUpload.css'

interface FileUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  onBlur?: () => void
  error?: string
}

const FileUpload = ({ file, onChange, onBlur, error }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    onBlur?.()

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.match(/image\/jpe?g/)) {
      onChange(droppedFile)
    } else {
      onChange(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBlur?.()
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onChange(selectedFile)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error shake' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,image/jpeg"
          onChange={handleFileSelect}
          className="file-input-hidden"
        />

        {file ? (
          <div className="file-preview">
            <img src={URL.createObjectURL(file)} alt="Document preview" className="preview-image" />
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
              <button type="button" onClick={handleRemove} className="btn-remove">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="upload-text">
              <strong>Drag & drop</strong> your document photo here
            </p>
            <p className="upload-subtext">or click to browse</p>
            <p className="upload-hint">JPG images only, max 5MB</p>
          </div>
        )}
      </div>

      {error && <span className="error-message slide-in">{error}</span>}
    </div>
  )
}

export default FileUpload
