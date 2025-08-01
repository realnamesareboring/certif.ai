// REPLACE your app/api/load-certification-content/route.ts with this enhanced version

import { NextRequest, NextResponse } from 'next/server'

// Enhanced Microsoft Learn Content with Official Course Structure
const AZ_900_ENHANCED_CONTENT = {
  examCode: 'AZ-900',
  name: 'Microsoft Azure Fundamentals',
  officialUrl: 'https://learn.microsoft.com/en-us/training/courses/az-900t00',
  courseCode: 'AZ-900T00',
  
  modules: [
    {
      moduleId: 'az900-module1',
      title: 'Describe cloud concepts',
      weight: '25-30%',
      estimatedTime: '65 minutes',
      description: 'Learn cloud computing basics and foundational concepts',
      topics: [
        {
          id: 'cloud-computing-intro',
          title: 'What is cloud computing?',
          description: 'Define cloud computing and understand its key characteristics',
          keyPoints: [
            'Definition of cloud computing and its key characteristics',
            'On-demand self-service and broad network access',
            'Resource pooling and rapid elasticity',
            'Measured service and pay-as-you-go pricing model',
            'Benefits over traditional on-premises infrastructure'
          ]
        },
        {
          id: 'shared-responsibility',
          title: 'Shared responsibility model',
          description: 'Understand how responsibilities are divided between cloud provider and customer',
          keyPoints: [
            'Cloud provider responsibilities (physical security, host infrastructure)',
            'Customer responsibilities (data classification, identity and access management)',
            'Shared responsibilities (operating system, network controls, applications)',
            'How responsibility changes by service type (IaaS, PaaS, SaaS)',
            'Security implications of each responsibility layer'
          ]
        },
        {
          id: 'cloud-models',
          title: 'Cloud deployment models',
          description: 'Compare public, private, and hybrid cloud deployment models',
          keyPoints: [
            'Public cloud: services over public internet, shared infrastructure',
            'Private cloud: dedicated environment for single organization',
            'Hybrid cloud: combination of public and private clouds',
            'Multi-cloud: using multiple cloud providers',
            'Use cases and benefits of each deployment model'
          ]
        },
        {
          id: 'service-types',
          title: 'Cloud service types (IaaS, PaaS, SaaS)',
          description: 'Understand Infrastructure, Platform, and Software as a Service models',
          keyPoints: [
            'IaaS: Virtual machines, storage, networks (maximum control and flexibility)',
            'PaaS: Development platform, runtime environment, databases',
            'SaaS: Complete applications delivered over internet (minimal management)',
            'Examples of each service type in Azure',
            'Choosing the right service type for different scenarios'
          ]
        },
        {
          id: 'cloud-benefits',
          title: 'Benefits of using cloud services',
          description: 'Identify the benefits and considerations of cloud services',
          keyPoints: [
            'High availability and scalability benefits',
            'Reliability and predictability in cloud solutions',
            'Security and governance in the cloud',
            'Manageability and monitoring capabilities',
            'Cost optimization and CapEx vs OpEx models'
          ]
        }
      ]
    },
    {
      moduleId: 'az900-module2',
      title: 'Describe Azure architecture and services',
      weight: '35-40%',
      estimatedTime: '180 minutes',
      description: 'Explore Azure global infrastructure and core services',
      topics: [
        {
          id: 'azure-global-infrastructure',
          title: 'Azure global infrastructure',
          description: 'Understand Azure regions, availability zones, and global presence',
          keyPoints: [
            'Azure regions and regional pairs for disaster recovery',
            'Availability zones for high availability within regions',
            'Azure datacenters and physical infrastructure',
            'Sovereign regions for government and compliance',
            'Choosing regions based on proximity, compliance, and features'
          ]
        },
        {
          id: 'azure-compute-services',
          title: 'Azure compute services',
          description: 'Compare Azure compute options for different workloads',
          keyPoints: [
            'Azure Virtual Machines for IaaS compute',
            'Azure App Service for web applications and APIs',
            'Azure Container Instances and Azure Kubernetes Service',
            'Azure Functions for serverless computing',
            'Windows Virtual Desktop for virtual desktop infrastructure'
          ]
        },
        {
          id: 'azure-networking-services',
          title: 'Azure networking services',
          description: 'Explore Azure networking components and connectivity options',
          keyPoints: [
            'Azure Virtual Network for network isolation',
            'VPN Gateway for secure connections',
            'Azure ExpressRoute for private connectivity',
            'Azure DNS for domain name resolution',
            'Network Security Groups and Azure Firewall'
          ]
        },
        {
          id: 'azure-storage-services',
          title: 'Azure storage services',
          description: 'Compare Azure storage options and use cases',
          keyPoints: [
            'Azure Blob Storage for object storage',
            'Azure Files for fully managed file shares',
            'Azure Queue Storage for message queuing',
            'Azure Table Storage for NoSQL data',
            'Storage tiers and replication options'
          ]
        },
        {
          id: 'azure-database-services',
          title: 'Azure database services',
          description: 'Explore Azure database options for different data needs',
          keyPoints: [
            'Azure SQL Database for relational databases',
            'Azure Database for MySQL and PostgreSQL',
            'Azure Cosmos DB for globally distributed databases',
            'Azure Synapse Analytics for data warehousing',
            'Choosing the right database service for applications'
          ]
        }
      ]
    },
    {
      moduleId: 'az900-module3',
      title: 'Describe Azure management and governance',
      weight: '30-35%',
      estimatedTime: '150 minutes',
      description: 'Learn about managing and governing Azure resources',
      topics: [
        {
          id: 'cost-management',
          title: 'Cost management in Azure',
          description: 'Understand Azure pricing models and cost optimization',
          keyPoints: [
            'Factors affecting costs (resource types, consumption, maintenance)',
            'Azure pricing calculator for cost estimation',
            'Total Cost of Ownership (TCO) calculator',
            'Azure Cost Management for monitoring and optimization',
            'Cost-saving recommendations and best practices'
          ]
        },
        {
          id: 'azure-governance',
          title: 'Features and tools for governance and compliance',
          description: 'Explore Azure tools for governance, compliance, and resource management',
          keyPoints: [
            'Azure Blueprints for environment setup',
            'Azure Policy for resource governance',
            'Resource locks to prevent accidental changes',
            'Service Trust Portal for compliance information',
            'Azure compliance offerings and certifications'
          ]
        },
        {
          id: 'azure-resource-management',
          title: 'Tools for managing and deploying Azure resources',
          description: 'Compare Azure management tools and deployment options',
          keyPoints: [
            'Azure Portal for web-based management',
            'Azure PowerShell and Azure CLI for automation',
            'Azure Cloud Shell for browser-based CLI',
            'Azure Resource Manager (ARM) templates',
            'Azure mobile app for on-the-go management'
          ]
        },
        {
          id: 'monitoring-tools',
          title: 'Monitoring tools in Azure',
          description: 'Understand Azure monitoring and alerting capabilities',
          keyPoints: [
            'Azure Advisor for optimization recommendations',
            'Azure Monitor and Application Insights for telemetry',
            'Azure Service Health for service status',
            'Log Analytics for centralized logging',
            'Setting up alerts and automated responses'
          ]
        }
      ]
    }
  ],

  studyResources: {
    officialDocs: 'https://docs.microsoft.com/en-us/azure/',
    learningPath: 'https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/',
    practiceExams: 'Microsoft Learn Practice Assessments',
    timeToStudy: '2-3 weeks for beginners, 1 week for IT professionals'
  }
}

// SC-900 Enhanced Content
const SC_900_ENHANCED_CONTENT = {
  examCode: 'SC-900',
  name: 'Microsoft Security, Compliance, and Identity Fundamentals',
  officialUrl: 'https://learn.microsoft.com/en-us/training/courses/sc-900t00',
  courseCode: 'SC-900T00',
  
  modules: [
    {
      moduleId: 'sc900-module1',
      title: 'Describe security, compliance, and identity concepts',
      weight: '5-10%',
      estimatedTime: '60 minutes',
      description: 'Learn fundamental security and compliance concepts',
      topics: [
        {
          id: 'security-concepts',
          title: 'Security and compliance concepts',
          description: 'Understand fundamental security principles and methodologies',
          keyPoints: [
            'Confidentiality, Integrity, Availability (CIA triad)',
            'Defense in depth security strategy',
            'Zero Trust security model principles',
            'Encryption at rest and in transit',
            'Hashing and digital signatures'
          ]
        },
        {
          id: 'identity-concepts',
          title: 'Identity concepts',
          description: 'Define identity and access management fundamentals',
          keyPoints: [
            'Authentication vs authorization concepts',
            'Identity as the security perimeter',
            'Role-based access control (RBAC)',
            'Single sign-on (SSO) and federation',
            'Modern authentication protocols'
          ]
        }
      ]
    },
    {
      moduleId: 'sc900-module2',
      title: 'Describe the capabilities of Microsoft identity and access management solutions',
      weight: '25-30%',
      estimatedTime: '120 minutes',
      description: 'Explore Azure Active Directory and identity management',
      topics: [
        {
          id: 'azure-ad-services',
          title: 'Azure Active Directory services',
          description: 'Understand Azure AD features and capabilities',
          keyPoints: [
            'Azure AD editions and licensing',
            'User and group management',
            'Device management and conditional access',
            'Multi-factor authentication (MFA)',
            'Self-service password reset and identity protection'
          ]
        },
        {
          id: 'authentication-methods',
          title: 'Authentication capabilities of Azure AD',
          description: 'Compare authentication methods and security features',
          keyPoints: [
            'Password-based and passwordless authentication',
            'Multi-factor authentication methods',
            'Windows Hello for Business',
            'FIDO2 security keys and Microsoft Authenticator',
            'Conditional access policies'
          ]
        }
      ]
    }
  ],

  studyResources: {
    officialDocs: 'https://docs.microsoft.com/en-us/security/',
    learningPath: 'https://learn.microsoft.com/en-us/training/paths/describe-concepts-of-security-compliance-identity/',
    practiceExams: 'Microsoft Learn Practice Assessments',
    timeToStudy: '1-2 weeks for IT professionals'
  }
}

// Updated certification content database
const ENHANCED_CERTIFICATION_CONTENT = {
  'AZ-900': AZ_900_ENHANCED_CONTENT,
  'SC-900': SC_900_ENHANCED_CONTENT,
  // Add more certifications as needed
}

export async function POST(req: NextRequest) {
  try {
    const { certificationId, communicationStyle } = await req.json()

    if (!certificationId) {
      return NextResponse.json(
        { error: 'Missing certification ID' },
        { status: 400 }
      )
    }

    console.log(`🔄 Loading enhanced content for ${certificationId}...`)

    const certContent = ENHANCED_CERTIFICATION_CONTENT[certificationId as keyof typeof ENHANCED_CERTIFICATION_CONTENT]
    
    if (!certContent) {
      return NextResponse.json(
        { error: `Certification ${certificationId} not found. Available: ${Object.keys(ENHANCED_CERTIFICATION_CONTENT).join(', ')}` },
        { status: 404 }
      )
    }

    // Count total topics across all modules
    const totalTopics = certContent.modules.reduce((count, module) => count + module.topics.length, 0)
    const totalModules = certContent.modules.length

    console.log(`✅ Successfully loaded ${certificationId} content:`)
    console.log(`   📚 ${totalModules} modules`)
    console.log(`   📖 ${totalTopics} specific topics`)
    console.log(`   🎯 Aligned with official ${certContent.courseCode} course`)

    return NextResponse.json({
      success: true,
      message: `Loaded ${totalTopics} Microsoft Learn topics across ${totalModules} modules for ${certificationId}`,
      content: certContent,
      metadata: {
        certification: certificationId,
        totalModules,
        totalTopics,
        courseCode: certContent.courseCode,
        officialUrl: certContent.officialUrl,
        loadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Failed to load certification content:', error)
    
    return NextResponse.json(
      { error: 'Failed to load certification content' },
      { status: 500 }
    )
  }
}