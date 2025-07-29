// lib/certifications.ts
// Complete Multi-Cloud Certifications Database (2025)

interface CertificationDomain {
  name: string
  weight: string
  description: string
}

export interface Certification {
  id: string
  name: string
  fullName: string
  level: 'Foundational' | 'Associate' | 'Professional' | 'Expert' | 'Specialty' | 'Fundamentals'
  provider: 'Microsoft' | 'AWS' | 'GCP'
  category: string
  color: string
  domains: CertificationDomain[]
  examCode: string
  prerequisites?: string[]
  status: 'Active' | 'Retiring' | 'New'
  retiredDate?: string
  averageSalary: string
  marketDemand: 'High' | 'Medium' | 'Low'
  description: string
  officialLink: string
  examCost: string
  validityPeriod: string
}

export const MULTI_CLOUD_CERTIFICATIONS_2025: Record<string, Certification> = {
  // ========================================
  // MICROSOFT AZURE & SECURITY (Key Selections)
  // ========================================
  'AZ-900': {
    id: 'AZ-900',
    name: 'AZ-900',
    fullName: 'Microsoft Azure Fundamentals',
    level: 'Fundamentals',
    provider: 'Microsoft',
    category: 'Cloud Fundamentals',
    color: 'blue',
    examCode: 'AZ-900',
    status: 'Active',
    averageSalary: '$60,000 - $80,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: 'Does not expire',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    description: 'Entry-level certification covering basic cloud concepts and Azure services',
    domains: [
      {
        name: "Describe cloud concepts",
        weight: "25-30%",
        description: "Cloud benefits, service types, and deployment models"
      },
      {
        name: "Describe Azure architecture and services", 
        weight: "35-40%",
        description: "Azure regions, compute, networking, storage, and databases"
      },
      {
        name: "Describe Azure management and governance",
        weight: "30-35%", 
        description: "Cost management, features, and tools for governance and compliance"
      }
    ]
  },

  'AZ-104': {
    id: 'AZ-104',
    name: 'AZ-104',
    fullName: 'Microsoft Azure Administrator Associate',
    level: 'Associate',
    provider: 'Microsoft',
    category: 'Cloud Administration',
    color: 'blue',
    examCode: 'AZ-104',
    status: 'Active',
    averageSalary: '$90,000 - $120,000',
    marketDemand: 'High',
    examCost: '$165',
    validityPeriod: '12 months',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/',
    description: 'For Azure administrators managing cloud infrastructure, virtual networks, and security',
    domains: [
      {
        name: "Manage Azure identities and governance",
        weight: "15-20%",
        description: "Azure Active Directory, RBAC, and governance"
      },
      {
        name: "Implement and manage storage",
        weight: "15-20%",
        description: "Storage accounts, blob storage, and file shares"
      },
      {
        name: "Deploy and manage Azure compute resources",
        weight: "20-25%",
        description: "Virtual machines, containers, and App Service"
      },
      {
        name: "Configure and manage virtual networking",
        weight: "25-30%",
        description: "Virtual networks, NSGs, and load balancing"
      },
      {
        name: "Monitor and back up Azure resources",
        weight: "10-15%",
        description: "Azure Monitor, alerts, and backup solutions"
      }
    ]
  },

  'AZ-305': {
    id: 'AZ-305',
    name: 'AZ-305',
    fullName: 'Microsoft Azure Solutions Architect Expert',
    level: 'Expert',
    provider: 'Microsoft',
    category: 'Cloud Architecture',
    color: 'blue',
    examCode: 'AZ-305',
    prerequisites: ['AZ-104 recommended'],
    status: 'Active',
    averageSalary: '$140,000 - $180,000',
    marketDemand: 'High',
    examCost: '$165',
    validityPeriod: '12 months',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/',
    description: 'Expert-level certification for architects designing comprehensive Azure solutions',
    domains: [
      {
        name: "Design identity, governance, and monitoring solutions",
        weight: "25-30%",
        description: "Identity management, governance, and monitoring architectures"
      },
      {
        name: "Design data storage solutions",
        weight: "25-30%",
        description: "Data architecture, storage, and database solutions"
      },
      {
        name: "Design business continuity solutions",
        weight: "10-15%",
        description: "Backup, disaster recovery, and high availability"
      },
      {
        name: "Design infrastructure solutions",
        weight: "30-35%",
        description: "Compute, application architecture, and migration"
      }
    ]
  },

  'SC-200': {
    id: 'SC-200',
    name: 'SC-200',
    fullName: 'Microsoft Security Operations Analyst Associate',
    level: 'Associate',
    provider: 'Microsoft',
    category: 'Cybersecurity',
    color: 'red',
    examCode: 'SC-200',
    status: 'Active',
    averageSalary: '$95,000 - $130,000',
    marketDemand: 'High',
    examCost: '$165',
    validityPeriod: '12 months',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/',
    description: 'For security analysts investigating and responding to threats using Microsoft security tools',
    domains: [
      {
        name: "Mitigate threats using Microsoft Defender XDR",
        weight: "25-30%",
        description: "Threat detection, investigation, and response with Defender XDR"
      },
      {
        name: "Mitigate threats using Microsoft Defender for Cloud",
        weight: "25-30%",
        description: "Cloud security posture management and workload protection"
      },
      {
        name: "Mitigate threats using Microsoft Sentinel",
        weight: "40-45%",
        description: "SIEM operations, threat hunting, and incident response"
      }
    ]
  },

  'SC-300': {
    id: 'SC-300',
    name: 'SC-300',
    fullName: 'Microsoft Identity and Access Administrator Associate',
    level: 'Associate',
    provider: 'Microsoft',
    category: 'Identity & Access',
    color: 'red',
    examCode: 'SC-300',
    status: 'Active',
    averageSalary: '$100,000 - $135,000',
    marketDemand: 'High',
    examCost: '$165',
    validityPeriod: '12 months',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/identity-and-access-administrator/',
    description: 'For identity and access administrators managing Azure AD and identity solutions',
    domains: [
      {
        name: "Implement identities in Azure AD",
        weight: "20-25%",
        description: "User and group management, device registration"
      },
      {
        name: "Implement authentication and access management",
        weight: "25-30%",
        description: "Authentication methods, conditional access, and identity protection"
      },
      {
        name: "Implement access management for applications",
        weight: "15-20%",
        description: "Enterprise applications, app registrations, and consent"
      },
      {
        name: "Plan and implement identity governance in Azure AD",
        weight: "25-30%",
        description: "Entitlement management, access reviews, and PIM"
      }
    ]
  },

  'DP-900': {
    id: 'DP-900',
    name: 'DP-900',
    fullName: 'Microsoft Azure Data Fundamentals',
    level: 'Fundamentals',
    provider: 'Microsoft',
    category: 'Data & Analytics',
    color: 'purple',
    examCode: 'DP-900',
    status: 'Active',
    averageSalary: '$60,000 - $80,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: 'Does not expire',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-fundamentals/',
    description: 'Entry-level certification covering core data concepts and Azure data services',
    domains: [
      {
        name: "Describe core data concepts",
        weight: "25-30%",
        description: "Data types, storage, and processing concepts"
      },
      {
        name: "Identify considerations for relational data on Azure",
        weight: "20-25%",
        description: "Relational databases and Azure SQL services"
      },
      {
        name: "Describe considerations for working with non-relational data on Azure",
        weight: "15-20%",
        description: "NoSQL databases and Azure Cosmos DB"
      },
      {
        name: "Describe an analytics workload on Azure",
        weight: "25-30%",
        description: "Data analytics, Power BI, and Azure Synapse"
      }
    ]
  },

  'AI-900': {
    id: 'AI-900',
    name: 'AI-900',
    fullName: 'Microsoft Azure AI Fundamentals',
    level: 'Fundamentals',
    provider: 'Microsoft',
    category: 'Artificial Intelligence',
    color: 'purple',
    examCode: 'AI-900',
    status: 'Active',
    averageSalary: '$65,000 - $85,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: 'Does not expire',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
    description: 'Entry-level certification covering fundamental AI and machine learning concepts',
    domains: [
      {
        name: "Describe Artificial Intelligence workloads and considerations",
        weight: "15-20%",
        description: "AI concepts, responsible AI, and common workloads"
      },
      {
        name: "Describe fundamental principles of machine learning on Azure",
        weight: "20-25%",
        description: "Machine learning concepts and Azure ML services"
      },
      {
        name: "Describe features of computer vision workloads on Azure",
        weight: "15-20%",
        description: "Computer vision services and capabilities"
      },
      {
        name: "Describe features of Natural Language Processing (NLP) workloads on Azure",
        weight: "15-20%",
        description: "NLP services and language understanding"
      },
      {
        name: "Describe features of generative AI workloads on Azure",
        weight: "15-20%",
        description: "Generative AI, Azure OpenAI Service, and responsible AI"
      }
    ]
  },

  // ========================================
  // AWS CERTIFICATIONS
  // ========================================
  'CLF-C02': {
    id: 'CLF-C02',
    name: 'AWS CLF-C02',
    fullName: 'AWS Certified Cloud Practitioner',
    level: 'Foundational',
    provider: 'AWS',
    category: 'Cloud Fundamentals',
    color: 'orange',
    examCode: 'CLF-C02',
    status: 'Active',
    averageSalary: '$65,000 - $85,000',
    marketDemand: 'High',
    examCost: '$100',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    description: 'Entry-level certification validating overall understanding of AWS Cloud',
    domains: [
      {
        name: "Cloud concepts",
        weight: "24%",
        description: "Benefits and considerations of cloud computing"
      },
      {
        name: "Security and compliance",
        weight: "30%",
        description: "AWS security and compliance concepts"
      },
      {
        name: "Cloud technology and services",
        weight: "34%",
        description: "AWS services and their use cases"
      },
      {
        name: "Billing, pricing, and support",
        weight: "12%",
        description: "AWS pricing models and support plans"
      }
    ]
  },

  'AIF-C01': {
    id: 'AIF-C01',
    name: 'AWS AIF-C01',
    fullName: 'AWS Certified AI Practitioner',
    level: 'Foundational',
    provider: 'AWS',
    category: 'Artificial Intelligence',
    color: 'purple',
    examCode: 'AIF-C01',
    status: 'New',
    averageSalary: '$70,000 - $90,000',
    marketDemand: 'High',
    examCost: '$100',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-ai-practitioner/',
    description: 'Foundational AI certification focusing on AI/ML fundamentals and AWS AI services',
    domains: [
      {
        name: "Fundamentals of AI and ML",
        weight: "20%",
        description: "AI concepts, machine learning basics, and responsible AI"
      },
      {
        name: "Fundamentals of generative AI",
        weight: "24%",
        description: "Generative AI concepts and applications"
      },
      {
        name: "Applications of foundation models",
        weight: "28%",
        description: "Foundation models and their business applications"
      },
      {
        name: "Guidelines for responsible AI",
        weight: "14%",
        description: "Responsible AI principles and governance"
      },
      {
        name: "Security, compliance, and governance for AI solutions",
        weight: "14%",
        description: "AI security, compliance, and risk management"
      }
    ]
  },

  'SAA-C03': {
    id: 'SAA-C03',
    name: 'AWS SAA-C03',
    fullName: 'AWS Certified Solutions Architect - Associate',
    level: 'Associate',
    provider: 'AWS',
    category: 'Cloud Architecture',
    color: 'orange',
    examCode: 'SAA-C03',
    status: 'Active',
    averageSalary: '$110,000 - $145,000',
    marketDemand: 'High',
    examCost: '$150',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    description: 'For solutions architects designing distributed systems on AWS',
    domains: [
      {
        name: "Design resilient architectures",
        weight: "26%",
        description: "Multi-tier architectures, disaster recovery, and scalability"
      },
      {
        name: "Design high-performing architectures",
        weight: "24%",
        description: "Storage, databases, networking, and compute solutions"
      },
      {
        name: "Design secure applications and architectures",
        weight: "30%",
        description: "Identity management, data protection, and infrastructure security"
      },
      {
        name: "Design cost-optimized architectures",
        weight: "20%",
        description: "Cost-effective storage, compute, and monitoring solutions"
      }
    ]
  },

  'DVA-C02': {
    id: 'DVA-C02',
    name: 'AWS DVA-C02',
    fullName: 'AWS Certified Developer - Associate',
    level: 'Associate',
    provider: 'AWS',
    category: 'Application Development',
    color: 'orange',
    examCode: 'DVA-C02',
    status: 'Active',
    averageSalary: '$105,000 - $135,000',
    marketDemand: 'High',
    examCost: '$150',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-developer-associate/',
    description: 'For developers building and maintaining applications on AWS',
    domains: [
      {
        name: "Development with AWS services",
        weight: "32%",
        description: "Core AWS services for application development"
      },
      {
        name: "Security",
        weight: "26%",
        description: "Authentication, authorization, and encryption"
      },
      {
        name: "Deployment",
        weight: "24%",
        description: "CI/CD, infrastructure as code, and containerization"
      },
      {
        name: "Troubleshooting and optimization",
        weight: "18%",
        description: "Monitoring, logging, and performance optimization"
      }
    ]
  },

  'SAP-C02': {
    id: 'SAP-C02',
    name: 'AWS SAP-C02',
    fullName: 'AWS Certified Solutions Architect - Professional',
    level: 'Professional',
    provider: 'AWS',
    category: 'Cloud Architecture',
    color: 'orange',
    examCode: 'SAP-C02',
    prerequisites: ['Associate-level certification recommended'],
    status: 'Active',
    averageSalary: '$150,000 - $200,000',
    marketDemand: 'High',
    examCost: '$300',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-solutions-architect-professional/',
    description: 'Advanced certification for experienced solutions architects',
    domains: [
      {
        name: "Design solutions for organizational complexity",
        weight: "26%",
        description: "Multi-account strategies and organizational design"
      },
      {
        name: "Design for new solutions",
        weight: "29%",
        description: "Solution design, architecture patterns, and migration"
      },
      {
        name: "Continuous improvement for existing solutions",
        weight: "25%",
        description: "Optimization, troubleshooting, and evolution"
      },
      {
        name: "Accelerate workload migration and modernization",
        weight: "20%",
        description: "Migration strategies and modernization approaches"
      }
    ]
  },

  'MLS-C01': {
    id: 'MLS-C01',
    name: 'AWS MLS-C01',
    fullName: 'AWS Certified Machine Learning - Specialty',
    level: 'Specialty',
    provider: 'AWS',
    category: 'Machine Learning',
    color: 'purple',
    examCode: 'MLS-C01',
    status: 'Active',
    averageSalary: '$140,000 - $180,000',
    marketDemand: 'High',
    examCost: '$300',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/',
    description: 'For ML engineers building and deploying machine learning solutions on AWS',
    domains: [
      {
        name: "Data engineering",
        weight: "20%",
        description: "Data repositories, ingestion, and transformation"
      },
      {
        name: "Exploratory data analysis",
        weight: "24%",
        description: "Data analysis, visualization, and feature engineering"
      },
      {
        name: "Modeling",
        weight: "36%",
        description: "Model training, evaluation, and hyperparameter tuning"
      },
      {
        name: "Machine learning implementation and operations",
        weight: "20%",
        description: "ML model deployment, monitoring, and maintenance"
      }
    ]
  },

  // ========================================
  // GOOGLE CLOUD PLATFORM (GCP) CERTIFICATIONS
  // ========================================
  'GCDL': {
    id: 'GCDL',
    name: 'GCP CDL',
    fullName: 'Google Cloud Digital Leader',
    level: 'Foundational',
    provider: 'GCP',
    category: 'Cloud Fundamentals',
    color: 'green',
    examCode: 'Cloud Digital Leader',
    status: 'Active',
    averageSalary: '$65,000 - $85,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: '3 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-digital-leader',
    description: 'Foundational certification for understanding Google Cloud and digital transformation',
    domains: [
      {
        name: "Digital transformation with Google Cloud",
        weight: "~10%",
        description: "Cloud adoption, innovation, and business transformation"
      },
      {
        name: "Innovating with data and Google Cloud",
        weight: "~30%",
        description: "Data lifecycle, analytics, and ML/AI solutions"
      },
      {
        name: "Infrastructure and application modernization",
        weight: "~30%",
        description: "Compute, containers, applications, and API management"
      },
      {
        name: "Understanding Google Cloud security and operations",
        weight: "~30%",
        description: "Shared responsibility, compliance, and security controls"
      }
    ]
  },

  'ACE': {
    id: 'ACE',
    name: 'GCP ACE',
    fullName: 'Google Cloud Associate Cloud Engineer',
    level: 'Associate',
    provider: 'GCP',
    category: 'Cloud Engineering',
    color: 'green',
    examCode: 'Associate Cloud Engineer',
    status: 'Active',
    averageSalary: '$95,000 - $125,000',
    marketDemand: 'High',
    examCost: '$125',
    validityPeriod: '3 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-engineer',
    description: 'For cloud engineers deploying and managing Google Cloud solutions',
    domains: [
      {
        name: "Setting up a cloud solution environment",
        weight: "17.5%",
        description: "Projects, billing, and initial setup"
      },
      {
        name: "Planning and configuring a cloud solution",
        weight: "17.5%",
        description: "Compute, data storage, and network resources"
      },
      {
        name: "Deploying and implementing a cloud solution",
        weight: "25%",
        description: "Application deployment and infrastructure implementation"
      },
      {
        name: "Ensuring successful operation of a cloud solution",
        weight: "25%",
        description: "Monitoring, logging, and managing resources"
      },
      {
        name: "Configuring access and security",
        weight: "15%",
        description: "IAM, security, and compliance"
      }
    ]
  },

  'PCA': {
    id: 'PCA',
    name: 'GCP PCA',
    fullName: 'Google Cloud Professional Cloud Architect',
    level: 'Professional',
    provider: 'GCP',
    category: 'Cloud Architecture',
    color: 'green',
    examCode: 'Professional Cloud Architect',
    status: 'Active',
    averageSalary: '$140,000 - $175,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-architect',
    description: 'For architects designing and managing robust, secure, scalable cloud solutions',
    domains: [
      {
        name: "Designing and planning a cloud solution architecture",
        weight: "24%",
        description: "Business and technical requirements, architecture design"
      },
      {
        name: "Managing and provisioning solution infrastructure",
        weight: "20%",
        description: "Network topology, compute resources, and security"
      },
      {
        name: "Designing for security and compliance",
        weight: "18%",
        description: "Identity management, security controls, and compliance"
      },
      {
        name: "Analyzing and optimizing technical and business processes",
        weight: "18%",
        description: "Process optimization and stakeholder management"
      },
      {
        name: "Managing implementation",
        weight: "10%",
        description: "Development lifecycle and quality assurance"
      },
      {
        name: "Ensuring solution and operations reliability",
        weight: "10%",
        description: "Monitoring, incident response, and disaster recovery"
      }
    ]
  },

  'PDE': {
    id: 'PDE',
    name: 'GCP PDE',
    fullName: 'Google Cloud Professional Data Engineer',
    level: 'Professional',
    provider: 'GCP',
    category: 'Data Engineering',
    color: 'purple',
    examCode: 'Professional Data Engineer',
    status: 'Active',
    averageSalary: '$125,000 - $160,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/data-engineer',
    description: 'For data engineers designing and building data processing systems',
    domains: [
      {
        name: "Designing data processing systems",
        weight: "22%",
        description: "Data architecture and processing system design"
      },
      {
        name: "Ingesting and processing the data",
        weight: "25%",
        description: "Data ingestion, transformation, and processing"
      },
      {
        name: "Storing the data",
        weight: "20%",
        description: "Data storage solutions and optimization"
      },
      {
        name: "Preparing and using data for analysis",
        weight: "23%",
        description: "Data preparation, analytics, and machine learning"
      },
      {
        name: "Maintaining and automating data workloads",
        weight: "10%",
        description: "Monitoring, troubleshooting, and automation"
      }
    ]
  },

  'PMLE': {
    id: 'PMLE',
    name: 'GCP PMLE',
    fullName: 'Google Cloud Professional Machine Learning Engineer',
    level: 'Professional',
    provider: 'GCP',
    category: 'Machine Learning',
    color: 'purple',
    examCode: 'Professional Machine Learning Engineer',
    status: 'Active',
    averageSalary: '$130,000 - $170,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/machine-learning-engineer',
    description: 'For ML engineers designing and implementing ML solutions on Google Cloud',
    domains: [
      {
        name: "Architecting low-code ML solutions",
        weight: "26%",
        description: "AutoML and low-code ML solutions"
      },
      {
        name: "Collaborating within and across teams to manage data and models",
        weight: "21%",
        description: "Data management, model versioning, and collaboration"
      },
      {
        name: "Scaling ML models",
        weight: "23%",
        description: "Model serving, scaling, and optimization"
      },
      {
        name: "Serving and scaling models",
        weight: "30%",
        description: "Model deployment, monitoring, and maintenance"
      }
    ]
  }
}

// Export utility functions
export const getCertificationsByProvider = (provider: 'Microsoft' | 'AWS' | 'GCP') => {
  return Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).filter(cert => cert.provider === provider)
}

export const getCertificationsByCategory = (category: string) => {
  return Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).filter(cert => cert.category === category)
}

export const getCertificationsByLevel = (level: string) => {
  return Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).filter(cert => cert.level === level)
}

export const getHighDemandCertifications = () => {
  return Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).filter(cert => cert.marketDemand === 'High')
}

export const getHighSalaryCertifications = () => {
  return Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).filter(cert => {
    const salary = cert.averageSalary.match(/\$(\d+),(\d+)/)?.[0]
    if (salary) {
      const numericSalary = parseInt(salary.replace(/[$,]/g, ''))
      return numericSalary >= 130000
    }
    return false
  })
}

// Summary Statistics
export const MULTI_CLOUD_STATS = {
  totalCertifications: Object.keys(MULTI_CLOUD_CERTIFICATIONS_2025).length,
  byProvider: {
    'Microsoft': getCertificationsByProvider('Microsoft').length,
    'AWS': getCertificationsByProvider('AWS').length,
    'GCP': getCertificationsByProvider('GCP').length
  },
  byLevel: {
    'Foundational/Fundamentals': Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).filter(cert => 
      cert.level === 'Foundational' || cert.level === 'Fundamentals'
    ).length,
    'Associate': getCertificationsByLevel('Associate').length,
    'Professional': getCertificationsByLevel('Professional').length,
    'Expert': getCertificationsByLevel('Expert').length,
    'Specialty': getCertificationsByLevel('Specialty').length
  },
  highDemandCertifications: getHighDemandCertifications().length,
  highSalaryCertifications: getHighSalaryCertifications().length,
  totalMarketValue: '$1.5M+ in combined salary potential',
  industries: ['Technology', 'Finance', 'Healthcare', 'Government', 'Retail', 'Manufacturing']
}