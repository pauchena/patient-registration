import '@testing-library/jest-dom'

if (!URL.createObjectURL) {
  URL.createObjectURL = () => 'blob:http://localhost/mock'
}

if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => {}
}
