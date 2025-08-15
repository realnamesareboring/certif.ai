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
 * Get certification color for UI theming
 * Moved from certification-utils.ts
 */
export const getCertificationColor = (certId: string) => {
  const colors: Record<string, string> = {
    'AZ-900': 'blue',
    'SC-200': 'red', 
    'AWS-SAA': 'orange',
    'GCP-CDL': 'green'
  }
  return colors[certId] || 'blue'
}

/**
 * Get popular certifications for onboarding selection
 * Moved from certification-utils.ts
 */
export const getPopularCertifications = () => {
  return [
    {
      id: 'SC-900',
      name: 'SC-900',
      fullName: 'Security, Compliance, and Identity Fundamentals',
      level: 'Fundamentals',
      provider: 'Microsoft',
      color: 'bg-red-500',
      description: 'Security fundamentals and Microsoft security services',
      averageSalary: '$65,000 - $85,000',
      icon: 'M'
    },
    {
      id: 'AZ-900',
      name: 'AZ-900', 
      fullName: 'Azure Fundamentals',
      level: 'Fundamentals',
      provider: 'Microsoft',
      color: 'bg-blue-500',
      description: 'Cloud concepts and core Azure services',
      averageSalary: '$60,000 - $80,000',
      icon: 'M'
    },
    {
      id: 'AZ-104',
      name: 'AZ-104',
      fullName: 'Azure Administrator Associate', 
      level: 'Associate',
      provider: 'Microsoft',
      color: 'bg-blue-600',
      description: 'Azure administration and infrastructure management',
      averageSalary: '$90,000 - $120,000',
      icon: 'M'
    },
    {
      id: 'CLF-C02',
      name: 'AWS CLF-C02',
      fullName: 'AWS Cloud Practitioner',
      level: 'Foundational', 
      provider: 'AWS',
      color: 'bg-orange-500',
      description: 'AWS cloud concepts and services fundamentals',
      averageSalary: '$65,000 - $85,000',
      icon: 'A'
    }
  ]
}

/**
 * Get certification domains - simplified version for backwards compatibility
 * This replaces the complex function from certification-utils.ts
 */
export const getCertificationDomains = (certificationId: string) => {
  // For now, return a simple structure that matches what page.tsx expects
  // You can expand this later or remove if not needed
  const domains = {
    'AZ-900': {
      id: 'AZ-900',
      name: 'AZ-900',
      fullName: 'Azure Fundamentals',
      color: 'blue',
      domains: [
        {
          name: "Cloud Concepts",
          weight: "25-30%",
          description: "Cloud computing concepts and Azure overview"
        },
        {
          name: "Core Azure Services", 
          weight: "25-30%",
          description: "Azure architecture, compute, networking, storage, databases"
        },
        {
          name: "Security and Compliance",
          weight: "25-30%", 
          description: "Azure security features, governance, privacy, compliance"
        },
        {
          name: "Azure Pricing and Support",
          weight: "20-25%",
          description: "Subscriptions, pricing, support options, SLAs"
        }
      ]
    }
    // Add other certifications as needed
  }
  
  return domains[certificationId] || {
    id: certificationId,
    name: certificationId,
    fullName: `${certificationId} Certification`,
    color: 'blue',
    domains: [
      {
        name: "General Knowledge",
        weight: "100%",
        description: "Core certification topics"
      }
    ]
  }
}

/**
 * Format message content with proper line breaks
 * Used by ChatInterface component
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

