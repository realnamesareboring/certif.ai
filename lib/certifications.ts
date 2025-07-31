// lib/certifications.ts
// Complete Multi-Cloud Certifications Database (2025) - Updated with ALL Missing Certifications

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
  salarySource: string
  salarySourceUrl: string
  marketDemand: 'High' | 'Medium' | 'Low'
  description: string
  officialLink: string
  examCost: string
  validityPeriod: string
}

export const MULTI_CLOUD_CERTIFICATIONS_2025: Record<string, Certification> = {
  // ========================================
  // MICROSOFT AZURE & SECURITY CERTIFICATIONS
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
    averageSalary: '$101,526 - $126,653',
    salarySource: 'ZipRecruiter & Global Knowledge Survey',
    salarySourceUrl: 'https://www.ziprecruiter.com/Salaries/Azure-Fundamentals-Salary',
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
    averageSalary: '$107,683 - $121,420',
    salarySource: 'ZipRecruiter & Global Knowledge Survey',
    salarySourceUrl: 'https://www.ziprecruiter.com/Salaries/Microsoft-Azure-Administrator-Salary',
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

  // *** NEW ADDITION ***
  'AZ-204': {
    id: 'AZ-204',
    name: 'AZ-204',
    fullName: 'Microsoft Azure Developer Associate',
    level: 'Associate',
    provider: 'Microsoft',
    category: 'Application Development',
    color: 'blue',
    examCode: 'AZ-204',
    status: 'Active',
    averageSalary: '$95,000 - $125,000',
    salarySource: 'Glassdoor & PayScale',
    salarySourceUrl: 'https://www.glassdoor.com/Salaries/azure-developer-salary-SRCH_KO0,15.htm',
    marketDemand: 'High',
    examCost: '$165',
    validityPeriod: '12 months',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/',
    description: 'For developers building cloud applications and services on Microsoft Azure',
    domains: [
      {
        name: "Develop Azure compute solutions",
        weight: "25-30%",
        description: "Azure App Service, Azure Functions, and container solutions"
      },
      {
        name: "Develop for Azure storage",
        weight: "15-20%",
        description: "Cosmos DB, blob storage, and Azure SQL Database solutions"
      },
      {
        name: "Implement Azure security",
        weight: "20-25%",
        description: "Authentication, authorization, and secure cloud solutions"
      },
      {
        name: "Monitor, troubleshoot, and optimize Azure solutions",
        weight: "15-20%",
        description: "Application Insights, caching, and content delivery"
      },
      {
        name: "Connect to and consume Azure services and third-party services",
        weight: "15-20%",
        description: "API Management, Event Grid, Service Bus, and messaging solutions"
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

  // *** NEW ADDITION ***
  'AZ-400': {
    id: 'AZ-400',
    name: 'AZ-400',
    fullName: 'Microsoft Azure DevOps Engineer Expert',
    level: 'Expert',
    provider: 'Microsoft',
    category: 'DevOps',
    color: 'blue',
    examCode: 'AZ-400',
    prerequisites: ['AZ-104 or AZ-204 recommended'],
    status: 'Active',
    averageSalary: '$120,000 - $160,000',
    marketDemand: 'High',
    examCost: '$165',
    validityPeriod: '12 months',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/',
    description: 'For DevOps engineers combining people, processes, and technologies to deliver valuable products',
    domains: [
      {
        name: "Configure processes and communications",
        weight: "10-15%",
        description: "Team collaboration and communication strategies"
      },
      {
        name: "Design and implement source control",
        weight: "15-20%",
        description: "Git workflows, branching strategies, and code management"
      },
      {
        name: "Design and implement build and release pipelines",
        weight: "40-45%",
        description: "CI/CD pipelines, Azure DevOps, and deployment strategies"
      },
      {
        name: "Develop a security and compliance plan",
        weight: "10-15%",
        description: "Security integration and compliance automation"
      },
      {
        name: "Implement an instrumentation strategy",
        weight: "10-15%",
        description: "Monitoring, logging, and feedback loops"
      }
    ]
  },

  // *** NEW ADDITION ***
  'MS-900': {
    id: 'MS-900',
    name: 'MS-900',
    fullName: 'Microsoft 365 Fundamentals',
    level: 'Fundamentals',
    provider: 'Microsoft',
    category: 'Productivity & Collaboration',
    color: 'blue',
    examCode: 'MS-900',
    status: 'Active',
    averageSalary: '$55,000 - $75,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: 'Does not expire',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/microsoft-365-fundamentals/',
    description: 'Foundational knowledge of Microsoft 365 services and concepts',
    domains: [
      {
        name: "Describe Microsoft 365 apps and services",
        weight: "45-50%",
        description: "Core Microsoft 365 services and applications"
      },
      {
        name: "Describe Microsoft 365 security and compliance capabilities",
        weight: "25-30%",
        description: "Security features and compliance solutions"
      },
      {
        name: "Describe Microsoft 365 pricing, licensing, and support",
        weight: "20-25%",
        description: "Licensing models and support options"
      }
    ]
  },

  // *** NEW ADDITION ***
  'PL-900': {
    id: 'PL-900',
    name: 'PL-900',
    fullName: 'Microsoft Power Platform Fundamentals',
    level: 'Fundamentals',
    provider: 'Microsoft',
    category: 'Low-Code/No-Code',
    color: 'blue',
    examCode: 'PL-900',
    status: 'Active',
    averageSalary: '$60,000 - $80,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: 'Does not expire',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/power-platform-fundamentals/',
    description: 'Entry-level certification for Power Platform citizen developers and business users',
    domains: [
      {
        name: "Describe the business value of Microsoft Power Platform",
        weight: "15-20%",
        description: "Power Platform overview and business value"
      },
      {
        name: "Identify foundational components of Microsoft Power Platform",
        weight: "15-20%",
        description: "Common Data Service, connectors, and AI Builder"
      },
      {
        name: "Demonstrate the capabilities of Power BI",
        weight: "15-20%",
        description: "Power BI dashboards, reports, and analytics"
      },
      {
        name: "Describe the capabilities of Power Apps",
        weight: "15-20%",
        description: "Canvas and model-driven apps"
      },
      {
        name: "Demonstrate the capabilities of Power Automate",
        weight: "15-20%",
        description: "Workflow automation and business processes"
      },
      {
        name: "Demonstrate the capabilities of Power Virtual Agents",
        weight: "10-15%",
        description: "Chatbot creation and management"
      }
    ]
  },

  // *** NEW ADDITION ***
  'SC-900': {
    id: 'SC-900',
    name: 'SC-900',
    fullName: 'Microsoft Security, Compliance, and Identity Fundamentals',
    level: 'Fundamentals',
    provider: 'Microsoft',
    category: 'Security & Compliance',
    color: 'red',
    examCode: 'SC-900',
    status: 'Active',
    averageSalary: '$65,000 - $85,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: 'Does not expire',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/security-compliance-and-identity-fundamentals/',
    description: 'Foundational certification covering security, compliance, and identity concepts',
    domains: [
      {
        name: "Describe the concepts of security, compliance, and identity",
        weight: "5-10%",
        description: "Fundamental security concepts and methodologies"
      },
      {
        name: "Describe the capabilities of Microsoft Entra",
        weight: "25-30%",
        description: "Azure Active Directory and identity management"
      },
      {
        name: "Describe the capabilities of Microsoft security solutions",
        weight: "35-40%",
        description: "Microsoft Defender suite and security tools"
      },
      {
        name: "Describe the capabilities of Microsoft compliance solutions",
        weight: "25-30%",
        description: "Compliance management and data governance"
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
        description: "Threat detection, investigation, and response"
      },
      {
        name: "Mitigate threats using Microsoft Defender for Cloud",
        weight: "25-30%",
        description: "Cloud security posture and workload protection"
      },
      {
        name: "Mitigate threats using Microsoft Sentinel",
        weight: "40-45%",
        description: "SIEM/SOAR capabilities and security orchestration"
      }
    ]
  },

  // *** NEW ADDITION ***
  'SC-300': {
    id: 'SC-300',
    name: 'SC-300',
    fullName: 'Microsoft Identity and Access Administrator Associate',
    level: 'Associate',
    provider: 'Microsoft',
    category: 'Identity & Access Management',
    color: 'red',
    examCode: 'SC-300',
    status: 'Active',
    averageSalary: '$90,000 - $120,000',
    marketDemand: 'High',
    examCost: '$165',
    validityPeriod: '12 months',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/identity-and-access-administrator/',
    description: 'For identity administrators managing Microsoft Entra ID and identity solutions',
    domains: [
      {
        name: "Implement identities in Microsoft Entra ID",
        weight: "20-25%",
        description: "Users, groups, and identity lifecycle management"
      },
      {
        name: "Implement authentication and access management",
        weight: "25-30%",
        description: "Authentication methods and access policies"
      },
      {
        name: "Implement access management for applications",
        weight: "15-20%",
        description: "Application registration and access management"
      },
      {
        name: "Plan and implement identity governance",
        weight: "25-30%",
        description: "Privileged identity management and governance"
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
    color: 'blue',
    examCode: 'DP-900',
    status: 'Active',
    averageSalary: '$65,000 - $85,000',
    marketDemand: 'High',
    examCost: '$99',
    validityPeriod: 'Does not expire',
    officialLink: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-fundamentals/',
    description: 'Entry-level certification for data concepts on Microsoft Azure',
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

  // *** NEW ADDITION ***
  'SOA-C02': {
    id: 'SOA-C02',
    name: 'AWS SOA-C02',
    fullName: 'AWS Certified SysOps Administrator - Associate',
    level: 'Associate',
    provider: 'AWS',
    category: 'Systems Operations',
    color: 'orange',
    examCode: 'SOA-C02',
    status: 'Active',
    averageSalary: '$100,000 - $130,000',
    marketDemand: 'High',
    examCost: '$150',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-sysops-admin-associate/',
    description: 'For system administrators deploying, managing, and operating systems on AWS',
    domains: [
      {
        name: "Monitoring, logging, and remediation",
        weight: "20%",
        description: "CloudWatch, logging, and automated remediation"
      },
      {
        name: "Reliability and business continuity",
        weight: "16%",
        description: "Backup, disaster recovery, and fault tolerance"
      },
      {
        name: "Deployment, provisioning, and automation",
        weight: "18%",
        description: "Infrastructure as code and deployment automation"
      },
      {
        name: "Security and compliance",
        weight: "16%",
        description: "Security monitoring and compliance validation"
      },
      {
        name: "Networking and content delivery",
        weight: "18%",
        description: "VPC, DNS, and content delivery configuration"
      },
      {
        name: "Cost and performance optimization",
        weight: "12%",
        description: "Cost monitoring and performance optimization"
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

  // *** NEW ADDITION ***
  'DOP-C02': {
    id: 'DOP-C02',
    name: 'AWS DOP-C02',
    fullName: 'AWS Certified DevOps Engineer - Professional',
    level: 'Professional',
    provider: 'AWS',
    category: 'DevOps',
    color: 'orange',
    examCode: 'DOP-C02',
    prerequisites: ['Associate-level certification recommended'],
    status: 'Active',
    averageSalary: '$130,000 - $170,000',
    marketDemand: 'High',
    examCost: '$300',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/',
    description: 'For DevOps engineers automating, operating, and managing distributed systems',
    domains: [
      {
        name: "SDLC automation",
        weight: "22%",
        description: "CI/CD pipelines and automation workflows"
      },
      {
        name: "Configuration management and infrastructure as code",
        weight: "17%",
        description: "Infrastructure automation and configuration management"
      },
      {
        name: "Resilient cloud solutions",
        weight: "15%",
        description: "High availability and disaster recovery"
      },
      {
        name: "Monitoring and logging",
        weight: "15%",
        description: "Observability and performance monitoring"
      },
      {
        name: "Incident and event response",
        weight: "14%",
        description: "Automated incident response and remediation"
      },
      {
        name: "Security and compliance",
        weight: "17%",
        description: "Security automation and compliance monitoring"
      }
    ]
  },

  // *** NEW ADDITION ***
  'ANS-C01': {
    id: 'ANS-C01',
    name: 'AWS ANS-C01',
    fullName: 'AWS Certified Advanced Networking - Specialty',
    level: 'Specialty',
    provider: 'AWS',
    category: 'Networking',
    color: 'orange',
    examCode: 'ANS-C01',
    prerequisites: ['Associate-level certification recommended'],
    status: 'Active',
    averageSalary: '$125,000 - $160,000',
    marketDemand: 'Medium',
    examCost: '$300',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-advanced-networking-specialty/',
    description: 'For network architects designing and implementing AWS and hybrid networking',
    domains: [
      {
        name: "Design and implement hybrid IT network architectures at scale",
        weight: "23%",
        description: "Hybrid connectivity and multi-region architectures"
      },
      {
        name: "Design and implement AWS networks",
        weight: "29%",
        description: "VPC design, subnetting, and network optimization"
      },
      {
        name: "Automate AWS tasks",
        weight: "8%",
        description: "Network automation and infrastructure as code"
      },
      {
        name: "Configure network integration with application services",
        weight: "15%",
        description: "Load balancing, API Gateway, and application integration"
      },
      {
        name: "Design and implement for security and compliance",
        weight: "12%",
        description: "Network security and compliance requirements"
      },
      {
        name: "Manage, optimize, and troubleshoot the network",
        weight: "13%",
        description: "Network monitoring, optimization, and troubleshooting"
      }
    ]
  },

  // *** NEW ADDITION ***
  'SCS-C02': {
    id: 'SCS-C02',
    name: 'AWS SCS-C02',
    fullName: 'AWS Certified Security - Specialty',
    level: 'Specialty',
    provider: 'AWS',
    category: 'Security',
    color: 'red',
    examCode: 'SCS-C02',
    prerequisites: ['Associate-level certification recommended'],
    status: 'Active',
    averageSalary: '$130,000 - $170,000',
    marketDemand: 'High',
    examCost: '$300',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-security-specialty/',
    description: 'For security professionals securing AWS workloads and applications',
    domains: [
      {
        name: "Threat detection and incident response",
        weight: "14%",
        description: "Security monitoring and incident response"
      },
      {
        name: "Security logging and monitoring",
        weight: "18%",
        description: "CloudTrail, GuardDuty, and security analytics"
      },
      {
        name: "Infrastructure security",
        weight: "20%",
        description: "Network security and infrastructure protection"
      },
      {
        name: "Identity and access management",
        weight: "22%",
        description: "IAM policies, roles, and access management"
      },
      {
        name: "Data protection",
        weight: "26%",
        description: "Encryption, key management, and data security"
      }
    ]
  },

  // *** NEW ADDITION ***
  'DBS-C01': {
    id: 'DBS-C01',
    name: 'AWS DBS-C01',
    fullName: 'AWS Certified Database - Specialty',
    level: 'Specialty',
    provider: 'AWS',
    category: 'Database',
    color: 'orange',
    examCode: 'DBS-C01',
    prerequisites: ['Associate-level certification recommended'],
    status: 'Active',
    averageSalary: '$120,000 - $155,000',
    marketDemand: 'Medium',
    examCost: '$300',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-database-specialty/',
    description: 'For database professionals designing and maintaining AWS database solutions',
    domains: [
      {
        name: "Workload-specific database design",
        weight: "26%",
        description: "Database selection and design patterns"
      },
      {
        name: "Database deployment and migration",
        weight: "20%",
        description: "Database migration and deployment strategies"
      },
      {
        name: "Database management and operations",
        weight: "18%",
        description: "Database administration and maintenance"
      },
      {
        name: "Database monitoring and troubleshooting",
        weight: "18%",
        description: "Performance monitoring and issue resolution"
      },
      {
        name: "Database security",
        weight: "18%",
        description: "Database security and access control"
      }
    ]
  },

  // *** NEW ADDITION ***
  'DAS-C01': {
    id: 'DAS-C01',
    name: 'AWS DAS-C01',
    fullName: 'AWS Certified Data Analytics - Specialty',
    level: 'Specialty',
    provider: 'AWS',
    category: 'Data & Analytics',
    color: 'purple',
    examCode: 'DAS-C01',
    prerequisites: ['Associate-level certification recommended'],
    status: 'Active',
    averageSalary: '$125,000 - $165,000',
    marketDemand: 'High',
    examCost: '$300',
    validityPeriod: '3 years',
    officialLink: 'https://aws.amazon.com/certification/certified-data-analytics-specialty/',
    description: 'For data analytics professionals implementing AWS data analytics solutions',
    domains: [
      {
        name: "Data collection systems",
        weight: "18%",
        description: "Data ingestion and collection architecture"
      },
      {
        name: "Storage and data management",
        weight: "22%",
        description: "Data storage solutions and data lifecycle management"
      },
      {
        name: "Data processing systems",
        weight: "24%",
        description: "Batch and real-time data processing"
      },
      {
        name: "Analysis and visualization",
        weight: "18%",
        description: "Data analysis and visualization tools"
      },
      {
        name: "Data security",
        weight: "18%",
        description: "Data protection and access control"
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
    averageSalary: '$130,000 - $170,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-architect',
    description: 'For architects designing and managing Google Cloud solutions',
    domains: [
      {
        name: "Designing and planning a cloud solution architecture",
        weight: "24%",
        description: "Business requirements analysis and solution design"
      },
      {
        name: "Managing and provisioning solution infrastructure",
        weight: "20%",
        description: "Infrastructure automation and resource management"
      },
      {
        name: "Designing for security and compliance",
        weight: "18%",
        description: "Security architecture and compliance design"
      },
      {
        name: "Analyzing and optimizing technical and business processes",
        weight: "18%",
        description: "Process improvement and optimization strategies"
      },
      {
        name: "Managing implementation",
        weight: "10%",
        description: "Implementation planning and execution"
      },
      {
        name: "Ensuring solution and operations reliability",
        weight: "10%",
        description: "Monitoring, maintenance, and reliability engineering"
      }
    ]
  },

  // *** NEW ADDITION ***
  'PCDE': {
    id: 'PCDE',
    name: 'GCP PCDE',
    fullName: 'Google Cloud Professional Cloud Developer',
    level: 'Professional',
    provider: 'GCP',
    category: 'Application Development',
    color: 'green',
    examCode: 'Professional Cloud Developer',
    status: 'Active',
    averageSalary: '$115,000 - $150,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-developer',
    description: 'For developers building scalable and highly available applications on Google Cloud',
    domains: [
      {
        name: "Designing highly scalable, available, and reliable cloud-native applications",
        weight: "29%",
        description: "Application architecture and design patterns"
      },
      {
        name: "Building and testing applications",
        weight: "23%",
        description: "Development practices and testing strategies"
      },
      {
        name: "Deploying applications",
        weight: "21%",
        description: "CI/CD and deployment strategies"
      },
      {
        name: "Integrating Google Cloud services",
        weight: "19%",
        description: "Service integration and API management"
      },
      {
        name: "Managing application performance monitoring",
        weight: "8%",
        description: "Monitoring, logging, and performance optimization"
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
    color: 'green',
    examCode: 'Professional Data Engineer',
    status: 'Active',
    averageSalary: '$125,000 - $165,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/data-engineer',
    description: 'For data engineers designing and building data processing systems',
    domains: [
      {
        name: "Designing data processing systems",
        weight: "22%",
        description: "Data processing architecture and system design"
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

  // *** NEW ADDITION ***
  'PCSE': {
    id: 'PCSE',
    name: 'GCP PCSE',
    fullName: 'Google Cloud Professional Cloud Security Engineer',
    level: 'Professional',
    provider: 'GCP',
    category: 'Cloud Security',
    color: 'red',
    examCode: 'Professional Cloud Security Engineer',
    status: 'Active',
    averageSalary: '$130,000 - $170,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-security-engineer',
    description: 'For security engineers implementing and managing security on Google Cloud',
    domains: [
      {
        name: "Configuring access within a cloud solution environment",
        weight: "18%",
        description: "Identity and access management configuration"
      },
      {
        name: "Configuring network security",
        weight: "18%",
        description: "Network security architecture and implementation"
      },
      {
        name: "Ensuring data protection",
        weight: "18%",
        description: "Data encryption, classification, and protection"
      },
      {
        name: "Managing operations within a cloud solution environment",
        weight: "15%",
        description: "Security operations and incident response"
      },
      {
        name: "Supporting compliance requirements",
        weight: "16%",
        description: "Compliance frameworks and audit support"
      },
      {
        name: "Ensuring data protection",
        weight: "15%",
        description: "Additional data protection measures and governance"
      }
    ]
  },

  // *** NEW ADDITION ***
  'PCNE': {
    id: 'PCNE',
    name: 'GCP PCNE',
    fullName: 'Google Cloud Professional Cloud Network Engineer',
    level: 'Professional',
    provider: 'GCP',
    category: 'Cloud Networking',
    color: 'green',
    examCode: 'Professional Cloud Network Engineer',
    status: 'Active',
    averageSalary: '$120,000 - $160,000',
    marketDemand: 'Medium',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-network-engineer',
    description: 'For network engineers implementing and managing Google Cloud networking',
    domains: [
      {
        name: "Designing, planning, and prototyping a Google Cloud network",
        weight: "26%",
        description: "Network architecture design and planning"
      },
      {
        name: "Implementing a Google Cloud Virtual Private Cloud (VPC)",
        weight: "21%",
        description: "VPC implementation and configuration"
      },
      {
        name: "Configuring network services",
        weight: "23%",
        description: "Load balancing, DNS, and CDN configuration"
      },
      {
        name: "Implementing hybrid interconnectivity",
        weight: "14%",
        description: "Hybrid and multi-cloud connectivity"
      },
      {
        name: "Implementing network security",
        weight: "16%",
        description: "Network security implementation and management"
      }
    ]
  },

  // *** NEW ADDITION ***
  'PCDOE': {
    id: 'PCDOE',
    name: 'GCP PCDOE',
    fullName: 'Google Cloud Professional Cloud DevOps Engineer',
    level: 'Professional',
    provider: 'GCP',
    category: 'DevOps',
    color: 'green',
    examCode: 'Professional Cloud DevOps Engineer',
    status: 'Active',
    averageSalary: '$125,000 - $165,000',
    marketDemand: 'High',
    examCost: '$200',
    validityPeriod: '2 years',
    officialLink: 'https://cloud.google.com/learn/certification/cloud-devops-engineer',
    description: 'For DevOps engineers implementing DevOps practices on Google Cloud',
    domains: [
      {
        name: "Applying site reliability engineering principles to a service",
        weight: "18%",
        description: "SRE practices and service reliability"
      },
      {
        name: "Building and implementing CI/CD pipelines",
        weight: "21%",
        description: "Continuous integration and deployment pipelines"
      },
      {
        name: "Implementing service monitoring strategies",
        weight: "21%",
        description: "Monitoring, alerting, and observability"
      },
      {
        name: "Optimizing service performance",
        weight: "19%",
        description: "Performance monitoring and optimization"
      },
      {
        name: "Managing service incidents",
        weight: "21%",
        description: "Incident response and management"
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
  totalMarketValue: '$2.5M+ in combined salary potential',
  industries: ['Technology', 'Finance', 'Healthcare', 'Government', 'Retail', 'Manufacturing']
}