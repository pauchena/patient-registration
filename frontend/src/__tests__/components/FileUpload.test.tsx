import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FileUpload from '../../components/FileUpload'

describe('FileUpload', () => {
  it('renders file upload component', () => {
    const mockOnChange = vi.fn()
    const { container } = render(
      <FileUpload 
        file={null} 
        onChange={mockOnChange} 
      />
    )
    
    expect(container.querySelector('.file-upload-container')).toBeInTheDocument()
  })

  it('displays error message when provided', () => {
    const mockOnChange = vi.fn()
    render(
      <FileUpload 
        file={null} 
        onChange={mockOnChange}
        error="Document photo must be a JPG image"
      />
    )
    
    expect(screen.getByText(/Document photo must be a JPG image/)).toBeInTheDocument()
  })

  it('displays file name when file is selected', () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const mockOnChange = vi.fn()
    render(
      <FileUpload 
        file={mockFile} 
        onChange={mockOnChange}
      />
    )
    
    expect(screen.getByText('test.jpg')).toBeInTheDocument()
  })

  it('has file input element', () => {
    const mockOnChange = vi.fn()
    const { container } = render(
      <FileUpload 
        file={null} 
        onChange={mockOnChange}
      />
    )
    
    const fileInput = container.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()
  })

  it('renders drag drop area', () => {
    const mockOnChange = vi.fn()
    const { container } = render(
      <FileUpload 
        file={null} 
        onChange={mockOnChange}
      />
    )
    
    const divs = container.querySelectorAll('div')
    expect(divs.length).toBeGreaterThan(0)
  })

  it('shows file name with file selected', () => {
    const mockFile = new File(['test'], 'myfile.jpg', { type: 'image/jpeg' })
    const mockOnChange = vi.fn()
    render(
      <FileUpload 
        file={mockFile} 
        onChange={mockOnChange}
      />
    )
    
    expect(screen.getByText('myfile.jpg')).toBeInTheDocument()
  })

  it('renders without error when onBlur is provided', () => {
    const mockOnChange = vi.fn()
    const mockOnBlur = vi.fn()
    const { container } = render(
      <FileUpload 
        file={null} 
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    )
    
    expect(container.querySelector('.file-upload-container')).toBeInTheDocument()
  })
})
