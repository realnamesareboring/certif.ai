import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Domain-specific content for better quiz generation
const AZ900_DOMAIN_CONTENT = {
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
}

const QUIZ_GENERATION_PROMPT = `You are an expert AZ-900 exam question writer. Create realistic, scenario-based questions that mirror the actual Microsoft Azure Fundamentals exam.

REQUIREMENTS:
1. Questions must be scenario-based (not just definitions)
2. Use realistic business situations
3. Include distractors that are plausible but incorrect
4. Match the cognitive level of actual AZ-900 questions
5. Provide clear, educational explanations

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
- Use real Azure service names and features
- Include cost, compliance, and architectural considerations
- Make distractors believable but clearly incorrect to experts
- Keep questions practical and job-relevant`

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
    const domainContent = AZ900_DOMAIN_CONTENT[domain as keyof typeof AZ900_DOMAIN_CONTENT]
    if (!domainContent) {
      return NextResponse.json(
        { error: 'Invalid domain specified' },
        { status: 400 }
      )
    }

    // Create enhanced prompt with domain context
    const enhancedPrompt = `
${QUIZ_GENERATION_PROMPT}

DOMAIN: ${domain}
TOPICS TO COVER: ${domainContent.topics.join(', ')}
EXAMPLE SCENARIOS: ${domainContent.scenarios.join('; ')}

Generate exactly ${questionCount} questions for the "${domain}" domain of AZ-900.
Each question should test different aspects of this domain.

Return ONLY a valid JSON object with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "A company is planning to move their on-premises web application to Azure. They want to minimize upfront costs and only pay for the compute resources they actually use. The application has variable traffic patterns with significant spikes during business hours. Which cloud computing benefit best addresses their requirements?",
      "options": [
        "Elasticity - the ability to scale resources up and down automatically",
        "High availability - ensuring 99.99% uptime",
        "Fault tolerance - automatic failover capabilities", 
        "Global reach - deploying across multiple geographic regions"
      ],
      "correct": 0,
      "explanation": "Elasticity is the correct answer because it allows automatic scaling of resources based on demand, which directly addresses variable traffic patterns and the pay-for-what-you-use model. High availability is about uptime, fault tolerance is about failover, and global reach is about geographic distribution - none directly address the cost and scaling requirements mentioned.",
      "domain": "${domain}"
    }
  ]
}
`

    // Call OpenAI API with enhanced prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert Microsoft Azure certification exam writer specializing in AZ-900 questions.' },
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
      quizData = JSON.parse(aiResponse)
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
        domain,
        certification,
        questionCount: enhancedQuestions.length,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Quiz generation error:', error)
    
    // Return fallback questions if AI fails
    const fallbackQuestions = generateFallbackQuestions(
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

// Fallback questions in case AI generation fails
function generateFallbackQuestions(domain: string, count: number) {
  const fallbackQuestionBank = [
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
      domain: domain
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
      domain: domain
    },
    {
      id: 3,
      question: "A company needs to ensure that only authorized users can access their Azure resources. Which security feature should they implement first?",
      options: [
        "Network Security Groups",
        "Azure Firewall",
        "Multi-factor authentication (MFA)",
        "Azure Key Vault"
      ],
      correct: 2,
      explanation: "Multi-factor authentication (MFA) is the foundational security control that should be implemented first to ensure only authorized users can access resources.",
      domain: domain
    }
  ]

  return fallbackQuestionBank.slice(0, Math.min(count, fallbackQuestionBank.length))
}