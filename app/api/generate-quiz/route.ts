import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Expanded certification content database
const CERTIFICATION_CONTENT = {
  "AZ-900": {
    "Cloud Concepts": {
      topics: [
        "Benefits of cloud computing (high availability, scalability, elasticity, agility, fault tolerance)",
        "Cloud service models: IaaS (Infrastructure as a Service), PaaS (Platform as a Service), SaaS (Software as a Service)",
        "Cloud deployment models: Public cloud, Private cloud, Hybrid cloud, Community cloud",
        "Capital expenditure (CapEx) vs operational expenditure (OpEx)",
        "Consumption-based model and pricing"
      ],
      scenarios: [
        "A company wants to reduce upfront costs and pay only for resources used",
        "An organization needs to scale resources automatically during peak times",
        "A business requires global presence with minimal latency"
      ]
    },
    "Core Azure Services": {
      topics: [
        "Azure regions, availability zones, and region pairs",
        "Azure compute services: Virtual Machines, App Service, Container Instances, Azure Kubernetes Service",
        "Azure networking: Virtual Networks, Load Balancer, VPN Gateway, Application Gateway",
        "Azure storage: Blob storage, File storage, Queue storage, Table storage, Disk storage",
        "Azure databases: Cosmos DB, SQL Database, Database for MySQL/PostgreSQL"
      ],
      scenarios: [
        "A web application needs highly available compute resources across multiple regions",
        "A company requires secure connectivity between on-premises and Azure",
        "An application needs to store unstructured data with global distribution"
      ]
    },
    "Security and Compliance": {
      topics: [
        "Azure Active Directory (AAD) and identity management",
        "Multi-factor authentication (MFA) and conditional access",
        "Role-based access control (RBAC) and Azure AD roles",
        "Azure Security Center and Azure Sentinel",
        "Azure Key Vault for secrets management",
        "Network Security Groups (NSGs) and Azure Firewall",
        "Azure compliance offerings and trust center"
      ],
      scenarios: [
        "A company needs to enforce MFA for all administrative accounts",
        "An organization requires centralized identity management for cloud and on-premises",
        "A business must comply with GDPR and needs audit trails"
      ]
    },
    "Azure Pricing and Support": {
      topics: [
        "Azure subscription types and management groups",
        "Azure pricing calculator and Total Cost of Ownership (TCO) calculator", 
        "Azure Cost Management and billing",
        "Azure support plans: Basic, Developer, Standard, Professional Direct, Premier",
        "Service Level Agreements (SLAs) and composite SLAs",
        "Azure Service Health and Azure Status"
      ],
      scenarios: [
        "A startup needs cost-effective support for development environments",
        "An enterprise requires 24/7 support with guaranteed response times",
        "A company wants to estimate costs before migrating to Azure"
      ]
    }
  },
  "SC-200": {
    "Mitigate threats using Microsoft Defender XDR": {
      topics: [
        "Microsoft Defender for Endpoint threat detection and response",
        "Microsoft Defender for Office 365 email and collaboration protection",
        "Microsoft Defender for Identity on-premises identity protection",
        "Microsoft Defender for Cloud Apps cloud application security",
        "Incident investigation and response in Microsoft Defender XDR",
        "Threat hunting and advanced hunting queries (KQL)",
        "Automated investigation and response (AIR) capabilities"
      ],
      scenarios: [
        "A SOC analyst needs to investigate a potential malware infection across endpoints",
        "An organization wants to protect against phishing attacks in Office 365",
        "A company needs to detect suspicious activities in cloud applications"
      ]
    },
    "Mitigate threats using Microsoft Defender for Cloud": {
      topics: [
        "Microsoft Defender for Cloud security posture management",
        "Workload protection plans for Azure, AWS, and GCP",
        "Security recommendations and secure score improvement",
        "Just-in-time (JIT) VM access and adaptive application controls",
        "File integrity monitoring and adaptive network hardening",
        "Vulnerability assessment and management",
        "Regulatory compliance dashboard and policies"
      ],
      scenarios: [
        "A cloud security team needs to improve their overall security posture",
        "An organization wants to protect multi-cloud workloads consistently",
        "A company needs to demonstrate compliance with industry standards"
      ]
    },
    "Mitigate threats using Microsoft Sentinel": {
      topics: [
        "Microsoft Sentinel architecture and data connectors",
        "Kusto Query Language (KQL) for log analysis and hunting",
        "Analytics rules for threat detection and alerting",
        "Incident management and investigation workflows",
        "Threat hunting techniques and hunting queries",
        "Workbooks and visualization for security monitoring",
        "Automation rules and playbooks for incident response",
        "User and Entity Behavior Analytics (UEBA)"
      ],
      scenarios: [
        "A SOC needs to correlate security events from multiple data sources",
        "An analyst wants to hunt for advanced persistent threats (APTs)",
        "An organization needs to automate incident response workflows"
      ]
    }
  },
  "AWS-SAA": {
    "Design Resilient Architectures": {
      topics: [
        "Multi-tier architecture design patterns",
        "High availability and fault tolerance strategies",
        "Disaster recovery planning and implementation",
        "Auto Scaling and Elastic Load Balancing",
        "Amazon RDS Multi-AZ and read replicas",
        "Amazon S3 cross-region replication",
        "AWS Backup and recovery solutions"
      ],
      scenarios: [
        "A company needs to design a web application that can handle traffic spikes",
        "An organization requires 99.99% uptime for their critical application",
        "A business needs disaster recovery with 4-hour RTO and 1-hour RPO"
      ]
    },
    "Design High-Performing Architectures": {
      topics: [
        "Amazon EC2 instance types and sizing strategies",
        "Amazon EBS volume types and performance optimization",
        "Amazon S3 storage classes and lifecycle policies",
        "Amazon CloudFront content delivery network",
        "Amazon RDS and DynamoDB performance tuning",
        "Amazon ElastiCache for caching strategies",
        "AWS Lambda serverless architecture patterns"
      ],
      scenarios: [
        "An application needs to serve millions of users globally with low latency",
        "A database workload requires consistent sub-millisecond response times",
        "A media company needs to optimize storage costs for archival data"
      ]
    },
    "Design Secure Applications": {
      topics: [
        "AWS Identity and Access Management (IAM) best practices",
        "Amazon VPC security groups and network ACLs",
        "AWS WAF and Shield for DDoS protection",
        "AWS KMS for encryption key management",
        "Amazon Cognito for user identity and authentication",
        "AWS CloudTrail for audit logging",
        "AWS Config for compliance monitoring"
      ],
      scenarios: [
        "A financial services company needs to implement least privilege access",
        "An e-commerce site requires protection against web application attacks",
        "A healthcare organization must comply with HIPAA requirements"
      ]
    },
    "Design Cost-Optimized Architectures": {
      topics: [
        "AWS Cost Explorer and cost allocation tags",
        "Amazon EC2 Reserved Instances and Spot Instances",
        "AWS Lambda cost optimization strategies",
        "Amazon S3 Intelligent Tiering and Glacier storage",
        "AWS Trusted Advisor cost optimization recommendations",
        "Right-sizing recommendations and instance optimization",
        "AWS Budgets and cost alerting"
      ],
      scenarios: [
        "A startup needs to minimize cloud costs while maintaining performance",
        "An enterprise wants to optimize their monthly AWS spend by 30%",
        "A development team needs cost-effective environments for testing"
      ]
    }
  },
  "GCP-CDL": {
    "Digital Transformation with Google Cloud": {
      topics: [
        "Cloud adoption framework and migration strategies",
        "Digital transformation business drivers and benefits",
        "Google Cloud's approach to innovation and sustainability",
        "Hybrid and multi-cloud strategies",
        "Change management for cloud adoption",
        "Cloud economics and total cost of ownership",
        "Google Cloud customer success stories"
      ],
      scenarios: [
        "A traditional enterprise wants to modernize their IT infrastructure",
        "A company needs to accelerate time-to-market for new products",
        "An organization wants to reduce their carbon footprint through cloud adoption"
      ]
    },
    "Innovating with Data and Google Cloud": {
      topics: [
        "Google Cloud data lifecycle management",
        "BigQuery for data warehousing and analytics",
        "Cloud Storage for object storage and data lakes",
        "Dataflow for stream and batch processing",
        "Cloud AI and Machine Learning services",
        "Vertex AI for ML model development and deployment",
        "Data governance and security best practices"
      ],
      scenarios: [
        "A retail company wants to analyze customer behavior for personalization",
        "A healthcare organization needs to process and analyze medical imaging data",
        "A financial services firm wants to detect fraudulent transactions in real-time"
      ]
    },
    "Infrastructure and Application Modernization": {
      topics: [
        "Google Compute Engine for virtual machines",
        "Google Kubernetes Engine (GKE) for container orchestration",
        "Cloud Functions for serverless computing",
        "Cloud Run for containerized applications",
        "Anthos for hybrid and multi-cloud management",
        "Application modernization patterns and strategies",
        "API management with Cloud Endpoints and Apigee"
      ],
      scenarios: [
        "A company wants to containerize their monolithic applications",
        "An organization needs to manage applications across multiple cloud providers",
        "A development team wants to adopt serverless architecture patterns"
      ]
    },
    "Understanding Google Cloud Security": {
      topics: [
        "Shared responsibility model in Google Cloud",
        "Identity and Access Management (IAM) and Cloud Identity",
        "Google Cloud security foundation and best practices",
        "Data protection and encryption at rest and in transit",
        "Network security and VPC security controls",
        "Compliance frameworks and certifications",
        "Security monitoring and incident response"
      ],
      scenarios: [
        "A financial institution needs to meet regulatory compliance requirements",
        "A company wants to implement zero-trust security architecture",
        "An organization needs to protect sensitive customer data in the cloud"
      ]
    }
  }
}

const QUIZ_GENERATION_PROMPT = `You are an expert certification exam question writer. Create realistic, scenario-based questions that mirror actual certification exams.

REQUIREMENTS:
1. Questions must be scenario-based (not just definitions)
2. Use realistic business situations
3. Include distractors that are plausible but incorrect
4. Match the cognitive level of actual certification questions
5. Provide clear, educational explanations
6. Focus on practical application of concepts

QUESTION FORMAT:
{
  "id": 1,
  "question": "A detailed scenario-based question...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "Clear explanation of why the correct answer is right and why others are wrong",
  "domain": "Domain name"
}

GUIDELINES:
- Focus on understanding, not memorization
- Use real service names and features
- Include cost, compliance, and architectural considerations
- Make distractors believable but clearly incorrect to experts
- Keep questions practical and job-relevant
- Test decision-making abilities in realistic scenarios`

export async function POST(req: NextRequest) {
  try {
    const { certification, domain, questionCount } = await req.json()

    if (!certification || !domain || !questionCount) {
      return NextResponse.json(
        { error: 'Missing required parameters: certification, domain, questionCount' },
        { status: 400 }
      )
    }

    // Get domain-specific content
    const certContent = CERTIFICATION_CONTENT[certification as keyof typeof CERTIFICATION_CONTENT]
    if (!certContent) {
      return NextResponse.json(
        { error: `Invalid certification: ${certification}. Supported: ${Object.keys(CERTIFICATION_CONTENT).join(', ')}` },
        { status: 400 }
      )
    }

    const domainContent = certContent[domain as keyof typeof certContent]
    if (!domainContent) {
      return NextResponse.json(
        { error: `Invalid domain: ${domain} for certification ${certification}` },
        { status: 400 }
      )
    }

    // Create certification-specific expert persona
    const getExpertPersona = (cert: string) => {
      switch (cert) {
        case 'AZ-900':
          return 'You are a Microsoft Certified Azure Fundamentals expert specializing in cloud concepts and Azure services.'
        case 'SC-200':
          return 'You are a Microsoft Certified Security Operations Analyst expert specializing in threat detection, investigation, and response.'
        case 'AWS-SAA':
          return 'You are an AWS Certified Solutions Architect Associate expert specializing in designing resilient and high-performing architectures.'
        case 'GCP-CDL':
          return 'You are a Google Cloud Digital Leader expert specializing in digital transformation and cloud innovation.'
        default:
          return 'You are a cloud certification expert.'
      }
    }

    // Create enhanced prompt with domain context
    const enhancedPrompt = `
${QUIZ_GENERATION_PROMPT}

CERTIFICATION: ${certification}
DOMAIN: ${domain}
TOPICS TO COVER: ${domainContent.topics.join(', ')}
EXAMPLE SCENARIOS: ${domainContent.scenarios.join('; ')}

Generate exactly ${questionCount} questions for the "${domain}" domain of ${certification}.
Each question should test different aspects of this domain and reflect real-world scenarios.

Return ONLY a valid JSON object with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "A company is planning a cloud migration...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Detailed explanation with reasoning...",
      "domain": "${domain}"
    }
  ]
}
`

    // Call OpenAI API with enhanced prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getExpertPersona(certification) },
        { role: 'user', content: enhancedPrompt }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let quizData
    try {
      // Clean up the response (remove any markdown formatting)
      const cleanResponse = aiResponse.replace(/```json\s*|\s*```/g, '').trim()
      quizData = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      throw new Error('Invalid JSON response from AI')
    }

    // Validate the response structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error('Invalid quiz data structure')
    }

    // Add additional metadata to questions
    const enhancedQuestions = quizData.questions.map((q: any, index: number) => ({
      ...q,
      id: index + 1,
      domain: domain,
      certification: certification,
      generatedAt: new Date().toISOString()
    }))

    return NextResponse.json({ 
      questions: enhancedQuestions,
      metadata: {
        certification,
        domain,
        questionCount: enhancedQuestions.length,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Quiz generation error:', error)
    
    // Return fallback questions if AI fails
    const fallbackQuestions = generateFallbackQuestions(
      req.body?.certification || 'AZ-900',
      req.body?.domain || 'Cloud Concepts',
      req.body?.questionCount || 5
    )

    return NextResponse.json({ 
      questions: fallbackQuestions,
      fallback: true,
      error: 'AI generation failed, using fallback questions'
    })
  }
}

// Enhanced fallback questions with multi-certification support
function generateFallbackQuestions(certification: string, domain: string, count: number) {
  const fallbackQuestionBanks: Record<string, any[]> = {
    'AZ-900': [
      {
        id: 1,
        question: "A company wants to reduce their IT infrastructure costs and eliminate the need for physical servers. Which cloud deployment model would be most appropriate?",
        options: [
          "Public cloud",
          "Private cloud", 
          "Hybrid cloud",
          "On-premises infrastructure"
        ],
        correct: 0,
        explanation: "Public cloud is the most cost-effective option for eliminating physical servers and reducing infrastructure costs, as the cloud provider manages all hardware and infrastructure.",
        domain: domain,
        certification: certification
      },
      {
        id: 2,
        question: "Which Azure service provides a platform for building, testing, and deploying web applications without managing the underlying infrastructure?",
        options: [
          "Azure Virtual Machines",
          "Azure App Service",
          "Azure Container Instances", 
          "Azure Functions"
        ],
        correct: 1,
        explanation: "Azure App Service is a Platform-as-a-Service (PaaS) offering that allows developers to build and deploy web applications without managing servers or infrastructure.",
        domain: domain,
        certification: certification
      }
    ],
    'SC-200': [
      {
        id: 1,
        question: "A SOC analyst notices unusual login patterns for a user account. Which Microsoft Defender XDR capability should they use to investigate this incident thoroughly?",
        options: [
          "Automated investigation and response (AIR)",
          "Advanced hunting with KQL queries",
          "Threat analytics dashboard",
          "Custom detection rules"
        ],
        correct: 1,
        explanation: "Advanced hunting with KQL queries allows SOC analysts to proactively search through raw data to investigate unusual patterns and potential threats across the environment.",
        domain: domain,
        certification: certification
      }
    ],
    'AWS-SAA': [
      {
        id: 1,
        question: "A company needs to ensure their web application can handle sudden traffic spikes while maintaining cost efficiency. Which combination of AWS services would best meet this requirement?",
        options: [
          "Application Load Balancer + Auto Scaling + EC2 Spot Instances",
          "Network Load Balancer + Reserved Instances + CloudWatch",
          "Classic Load Balancer + On-Demand Instances + CloudTrail",
          "Gateway Load Balancer + Dedicated Hosts + X-Ray"
        ],
        correct: 0,
        explanation: "Application Load Balancer distributes traffic, Auto Scaling adjusts capacity based on demand, and Spot Instances provide cost-effective compute resources for variable workloads.",
        domain: domain,
        certification: certification
      }
    ],
    'GCP-CDL': [
      {
        id: 1,
        question: "A retail company wants to analyze customer purchase patterns to improve product recommendations. Which Google Cloud solution would be most appropriate for this use case?",
        options: [
          "Cloud Storage + Dataflow + BigQuery",
          "Compute Engine + Cloud SQL + Cloud CDN",
          "Cloud Functions + Firestore + Cloud Run",
          "Kubernetes Engine + Cloud Spanner + Anthos"
        ],
        correct: 0,
        explanation: "Cloud Storage can store customer data, Dataflow processes and transforms the data, and BigQuery provides analytics capabilities for analyzing purchase patterns and generating insights.",
        domain: domain,
        certification: certification
      }
    ]
  }

  const fallbackBank = fallbackQuestionBanks[certification] || fallbackQuestionBanks['AZ-900']
  return fallbackBank.slice(0, Math.min(count, fallbackBank.length))
}