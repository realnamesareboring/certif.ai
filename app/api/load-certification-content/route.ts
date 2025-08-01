// ENHANCED Microsoft Learn Content with Detailed Modules
// UPDATE your app/api/load-certification-content/route.ts with this enhanced structure

const AZ_900_ENHANCED_CONTENT = {
  examCode: 'AZ-900',
  name: 'Microsoft Azure Fundamentals',
  officialUrl: 'https://learn.microsoft.com/en-us/training/courses/az-900t00',
  courseCode: 'AZ-900T00',
  
  // DETAILED MODULES from official Microsoft Learn course
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
            'Definition of cloud computing',
            'Key characteristics: on-demand self-service, broad network access',
            'Resource pooling and rapid elasticity',
            'Measured service and pay-as-you-go pricing'
          ]
        },
        {
          id: 'shared-responsibility',
          title: 'Shared responsibility model',
          description: 'Understand how responsibilities are divided between cloud provider and customer',
          keyPoints: [
            'Cloud provider responsibilities (physical security, infrastructure)',
            'Customer responsibilities (data, identity, access management)',
            'Shared responsibilities (operating system, network controls)',
            'How responsibility changes by service type (IaaS, PaaS, SaaS)'
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
            'Multi-cloud: using multiple cloud providers'
          ]
        },
        {
          id: 'service-types',
          title: 'Cloud service types',
          description: 'Understand Infrastructure, Platform, and Software as a Service',
          keyPoints: [
            'IaaS: Virtual machines, storage, networks (most control)',
            'PaaS: Development platform, runtime environment',
            'SaaS: Complete applications delivered over internet (least control)',
            'Examples of each service type'
          ]
        }
      ]
    },
    {
      moduleId: 'az900-module2',
      title: 'Describe Azure architecture and services',
      weight: '35-40%',
      estimatedTime: '150 minutes',
      description: 'Explore Azure global infrastructure and core services',
      topics: [
        {
          id: 'azure-architecture',
          title: 'Azure global infrastructure',
          description: 'Understand Azure regions, availability zones, and data centers',
          keyPoints: [
            'Azure regions and region pairs',
            'Availability zones for high availability',
            'Azure data centers and edge locations',
            'Selecting appropriate regions for resources'
          ]
        },
        {
          id: 'azure-compute',
          title: 'Azure compute services',
          description: 'Learn about virtual machines, containers, and serverless computing',
          keyPoints: [
            'Azure Virtual Machines (VMs) and VM Scale Sets',
            'Azure App Service for web applications',
            'Azure Container Instances and Azure Kubernetes Service',
            'Azure Functions for serverless computing'
          ]
        },
        {
          id: 'azure-networking',
          title: 'Azure networking services', 
          description: 'Understand virtual networks, load balancers, and connectivity',
          keyPoints: [
            'Azure Virtual Network (VNet) and subnets',
            'Network Security Groups (NSGs) and firewalls',
            'Azure Load Balancer and Application Gateway',
            'Azure VPN Gateway and ExpressRoute'
          ]
        },
        {
          id: 'azure-storage',
          title: 'Azure storage services',
          description: 'Compare different storage options and use cases',
          keyPoints: [
            'Azure Blob Storage for unstructured data',
            'Azure Files for file shares',
            'Azure Queue Storage for messaging',
            'Azure Table Storage for NoSQL data'
          ]
        },
        {
          id: 'azure-databases',
          title: 'Azure database services',
          description: 'Understand relational and NoSQL database options',
          keyPoints: [
            'Azure SQL Database and SQL Managed Instance',
            'Azure Database for MySQL, PostgreSQL, MariaDB',
            'Azure Cosmos DB for globally distributed NoSQL',
            'When to use each database service'
          ]
        }
      ]
    },
    {
      moduleId: 'az900-module3',
      title: 'Describe Azure management and governance',
      weight: '30-35%',
      estimatedTime: '125 minutes', 
      description: 'Learn about cost management, governance, and compliance tools',
      topics: [
        {
          id: 'cost-management',
          title: 'Cost management in Azure',
          description: 'Understand Azure pricing and cost optimization',
          keyPoints: [
            'Azure pricing calculator and TCO calculator',
            'Azure Cost Management and Billing',
            'Cost optimization techniques and best practices',
            'Understanding different pricing models'
          ]
        },
        {
          id: 'governance-compliance',
          title: 'Governance and compliance features',
          description: 'Learn about Azure Policy, blueprints, and compliance',
          keyPoints: [
            'Azure Policy for enforcing organizational standards',
            'Azure Blueprints for repeatable deployments',
            'Resource locks to prevent accidental changes',
            'Compliance offerings and certifications'
          ]
        },
        {
          id: 'resource-management',
          title: 'Managing and deploying Azure resources',
          description: 'Understand tools for resource management and deployment',
          keyPoints: [
            'Azure Portal, Azure mobile app, and command line tools',
            'Azure Resource Manager (ARM) templates',
            'Azure PowerShell and Azure CLI',
            'Azure Cloud Shell and Azure Arc'
          ]
        },
        {
          id: 'monitoring-tools',
          title: 'Monitoring and reporting tools',
          description: 'Learn about Azure monitoring and health services',
          keyPoints: [
            'Azure Advisor for optimization recommendations',
            'Azure Monitor and Application Insights',
            'Azure Service Health for service issues',
            'Azure Monitor Logs and metrics'
          ]
        }
      ]
    }
  ],

  // Additional study resources
  studyResources: {
    officialDocs: 'https://docs.microsoft.com/en-us/azure/',
    learningPath: 'https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/',
    practiceExams: 'Microsoft Learn Practice Assessments',
    timeToStudy: '2-3 weeks for beginners, 1 week for IT professionals'
  }
}

// SC-900 Enhanced Content (for comparison)
const SC_900_ENHANCED_CONTENT = {
  examCode: 'SC-900',
  name: 'Microsoft Security, Compliance, and Identity Fundamentals',
  officialUrl: 'https://learn.microsoft.com/en-us/training/courses/sc-900t00',
  courseCode: 'SC-900T00',
  
  modules: [
    {
      moduleId: 'sc900-module1',
      title: 'Security, compliance, and identity concepts',
      weight: '5-10%',
      topics: [
        {
          id: 'security-concepts',
          title: 'Security and compliance concepts',
          description: 'Fundamental security principles and methodologies',
          keyPoints: [
            'Confidentiality, Integrity, Availability (CIA triad)',
            'Defense in depth strategy',
            'Zero Trust security model',
            'Encryption and hashing'
          ]
        },
        {
          id: 'identity-concepts',
          title: 'Identity concepts',
          description: 'Authentication, authorization, and identity management',
          keyPoints: [
            'Authentication vs authorization',
            'Identity as security perimeter',
            'Role-based access control (RBAC)',
            'Single sign-on (SSO) concepts'
          ]
        }
      ]
    }
    // ... more SC-900 modules
  ]
}

// Updated certification content database
const ENHANCED_CERTIFICATION_CONTENT = {
  'AZ-900': AZ_900_ENHANCED_CONTENT,
  'SC-900': SC_900_ENHANCED_CONTENT,
  // ... other certifications
}