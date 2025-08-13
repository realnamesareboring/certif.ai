// lib/utils/certification-utils.ts
// Ultra-safe certification data consolidation - extracting from page.tsx
// Following the proven pattern

import { MULTI_CLOUD_CERTIFICATIONS_2025, type Certification } from '../certifications'

/**
 * Get popular certifications for onboarding selection
 * Extracted from page.tsx POPULAR_CERTIFICATIONS array
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
 * Get certification domains for specific certification
 * Replaces the CERTIFICATIONS object in page.tsx
 */
export const getCertificationDomains = (certificationId: string) => {
  const cert = MULTI_CLOUD_CERTIFICATIONS_2025[certificationId]
  if (!cert) {
    // Return fallback structure for backwards compatibility
    return {
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

  // Transform to match page.tsx expected format
  return {
    id: cert.id,
    name: cert.name,
    fullName: cert.fullName,
    color: cert.color,
    domains: cert.domains
  }
}

/**
 * Get certification color for UI theming
 * Extracted from page.tsx getCertificationColor function
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
 * Legacy support - map old CERTIFICATIONS format to new data
 * Maintains backward compatibility during transition
 */
export const getLegacyCertificationData = () => {
  return {
    'AZ-900': getCertificationDomains('AZ-900'),
    'SC-200': getCertificationDomains('SC-200'), 
    'AWS-SAA': getCertificationDomains('SAA-C03'), // Map to new ID
    'GCP-CDL': getCertificationDomains('CDL')
  }
}