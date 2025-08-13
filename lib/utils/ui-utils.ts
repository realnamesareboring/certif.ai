// lib/utils/ui-utils.ts
// Ultra-safe UI utility extraction from page.tsx
// Following the proven pattern

import { MULTI_CLOUD_CERTIFICATIONS_2025 } from '../certifications'

/**
 * Get color classes for certification cards based on color and theme
 * Extracted from page.tsx getColorClasses function - ~25 lines saved
 */
export const getColorClasses = (color: string, theme: 'light' | 'dark') => {
  const colorMap = {
    blue: {
      bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
      border: 'border-blue-200',
      text: theme === 'dark' ? 'text-blue-300' : 'text-blue-700',
      icon: 'bg-blue-500'
    },
    red: {
      bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
      border: 'border-red-200',
      text: theme === 'dark' ? 'text-red-300' : 'text-red-700',
      icon: 'bg-red-500'
    },
    orange: {
      bg: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50',
      border: 'border-orange-200',
      text: theme === 'dark' ? 'text-orange-300' : 'text-orange-700',
      icon: 'bg-orange-500'
    },
    green: {
      bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
      border: 'border-green-200',
      text: theme === 'dark' ? 'text-green-300' : 'text-green-700',
      icon: 'bg-green-500'
    },
    purple: {
      bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50',
      border: 'border-purple-200',
      text: theme === 'dark' ? 'text-purple-300' : 'text-purple-700',
      icon: 'bg-purple-500'
    }
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.blue
}

/**
 * Get provider icon letter for certification cards
 * Extracted from page.tsx getProviderIcon function - ~8 lines saved
 */
export const getProviderIcon = (provider: string): string => {
  switch (provider) {
    case 'Microsoft': return 'M'
    case 'AWS': return 'A'  
    case 'GCP': return 'G'
    default: return '?'
  }
}

/**
 * Get filtered certifications based on selected provider
 * Extracted from page.tsx getFilteredCertifications function - ~5 lines saved
 */
export const getFilteredCertifications = (selectedProvider: 'All' | 'Microsoft' | 'AWS' | 'GCP') => {
  const certs = Object.values(MULTI_CLOUD_CERTIFICATIONS_2025)
  if (selectedProvider === 'All') return certs
  return certs.filter(cert => cert.provider === selectedProvider)
}

/**
 * Toggle theme and update DOM classes
 * Extracted from page.tsx toggleTheme function - ~8 lines saved
 */
export const toggleTheme = (
  currentTheme: 'light' | 'dark', 
  setTheme: (theme: 'light' | 'dark') => void
): 'light' | 'dark' => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
  localStorage.setItem('theme', newTheme)
  document.documentElement.classList.toggle('dark', newTheme === 'dark')
  return newTheme
}

/**
 * Initialize theme from localStorage and apply to DOM
 * Extracted from page.tsx useEffect theme logic - ~5 lines saved
 */
export const initializeTheme = (setTheme: (theme: 'light' | 'dark') => void): 'light' | 'dark' => {
  const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  setTheme(savedTheme)
  document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  return savedTheme
}

/**
 * Format message content with proper line breaks
 * Extracted from page.tsx formatMessage function - ~15 lines saved (if used)
 */
export const formatMessageContent = (content: string) => {
  const lines = content.split(/\n|\r\n|\r/)
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim()
    
    if (!trimmedLine) {
      return { type: 'break', key: index }
    }
    
    if (/^[A-D]\)/.test(trimmedLine)) {
      return {
        type: 'option',
        key: index,
        content: trimmedLine,
        className: 'ml-4 my-1 font-medium'
      }
    }
    
    return {
      type: 'text',
      key: index,
      content: trimmedLine,
      className: 'mb-2'
    }
  })
}

/**
 * Get theme-appropriate CSS classes for common UI elements
 * New utility to reduce theme class duplication
 */
export const getThemeClasses = (theme: 'light' | 'dark') => ({
  // Background classes
  cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
  sectionBg: theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100',
  inputBg: theme === 'dark' ? 'bg-gray-700' : 'bg-white',
  
  // Text classes
  primaryText: theme === 'dark' ? 'text-white' : 'text-gray-800',
  secondaryText: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
  mutedText: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
  
  // Border classes
  border: theme === 'dark' ? 'border-gray-600' : 'border-gray-200',
  divider: theme === 'dark' ? 'border-gray-600' : 'border-gray-200',
  
  // Button classes
  button: theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50',
  buttonText: theme === 'dark' ? 'text-gray-300 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
})