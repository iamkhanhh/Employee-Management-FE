// Format date
// export const formatDate = (date, format = 'DD/MM/YYYY') => {
//   if (!date) return ''
//   const d = new Date(date)
//   if (format === 'DD/MM/YYYY') {
//     return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
//   }
//   return d.toLocaleDateString()
// }

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get error message from API response
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  if (error?.message) {
    return error.message
  }
  return 'An error occurred. Please try again later.'
}

