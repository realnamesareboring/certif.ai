// app/api/generate-quiz/route.ts - ENHANCED VERSION
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 🎯 ENHANCED MICROSOFT LEARN CONTENT MAPPING
const AZ900_TOPIC_SPECIFICATIONS = {
  // Module 1: Cloud Concepts
  "What is cloud computing?": {
    focus: "Cloud computing fundamentals, characteristics, and benefits vs traditional IT",
    keyTerms: ["on-demand self-service", "broad network access", "resource pooling", "rapid elasticity", "measured service"],
    scenarios: ["Cost comparison", "Scalability requirements", "Global access needs"],
    examStyle: "Definition-based and benefit comparison questions"
  },
  "Shared responsibility model": {
    focus: "Division of responsibilities between cloud provider and customer across service types",
    keyTerms: ["IaaS responsibilities", "PaaS responsibilities", "SaaS responsibilities", "customer vs Microsoft responsibilities"],
    scenarios: ["Security incident response", "Compliance requirements", "Data protection responsibilities"],
    examStyle: "Responsibility matrix and security scenario questions"
  },
  "Cloud deployment models": {
    focus: "Public, private, hybrid, and multi-cloud deployment strategies",
    keyTerms: ["public cloud", "private cloud", "hybrid cloud", "multi-cloud", "community cloud"],
    scenarios: ["Regulatory compliance", "Cost optimization", "Performance requirements"],
    examStyle: "Deployment strategy selection based on business requirements"
  },
  "Cloud service types (IaaS, PaaS, SaaS)": {
    focus: "Service model characteristics, examples, and appropriate use cases",
    keyTerms: ["Infrastructure as a Service", "Platform as a Service", "Software as a Service", "control levels", "management responsibilities"],
    scenarios: ["Application development needs", "Infrastructure management", "Software delivery models"],
    examStyle: "Service type identification and use case matching"
  },

  // Module 2: Azure Architecture and Services  
  "Azure global infrastructure": {
    focus: "Regions, availability zones, region pairs, and global presence",
    keyTerms: ["Azure regions", "availability zones", "region pairs", "geographies", "sovereign clouds"],
    scenarios: ["Disaster recovery planning", "Latency optimization", "Compliance requirements"],
    examStyle: "Infrastructure planning and availability design questions"
  },
  "Azure compute services": {
    focus: "Virtual machines, App Service, Functions, Container Instances, AKS",
    keyTerms: ["Azure Virtual Machines", "Azure App Service", "Azure Functions", "Azure Container Instances", "Azure Kubernetes Service"],
    scenarios: ["Application hosting decisions", "Serverless vs container choices", "Scalability requirements"],
    examStyle: "Service selection based on application requirements"
  },
  "Azure networking services": {
    focus: "Virtual networks, VPN Gateway, ExpressRoute, DNS, load balancing",
    keyTerms: ["Virtual Network", "VPN Gateway", "ExpressRoute", "Azure DNS", "Load Balancer", "Application Gateway"],
    scenarios: ["Hybrid connectivity", "Network security", "Traffic distribution"],
    examStyle: "Network architecture and connectivity solution questions"
  },
  "Azure storage services": {
    focus: "Blob, Files, Queues, Tables, and storage tiers",
    keyTerms: ["Blob storage", "Azure Files", "Queue storage", "Table storage", "storage tiers", "replication options"],
    scenarios: ["Data archival", "Application storage needs", "Performance requirements"],
    examStyle: "Storage solution selection and configuration questions"
  },
  "Azure database services": {
    focus: "SQL Database, Cosmos DB, MySQL, PostgreSQL, analytics services",
    keyTerms: ["Azure SQL Database", "Azure Cosmos DB", "Azure Database for MySQL", "Azure Database for PostgreSQL", "Azure Synapse Analytics"],
    scenarios: ["Database migration", "Global distribution", "Analytics requirements"],
    examStyle: "Database service selection and scalability questions"
  },

  // Module 3: Management and Governance
  "Cost management in Azure": {
    focus: "Pricing models, cost optimization, and financial management tools",
    keyTerms: ["pay-as-you-go", "reserved instances", "Azure Pricing Calculator", "TCO Calculator", "Cost Management"],
    scenarios: ["Budget planning", "Cost optimization", "Financial forecasting"],
    examStyle: "Cost calculation and optimization strategy questions"
  },
  "Features and tools for governance and compliance": {
    focus: "Azure Policy, Blueprints, compliance offerings, and governance tools",
    keyTerms: ["Azure Policy", "Azure Blueprints", "compliance offerings", "resource locks", "management groups"],
    scenarios: ["Regulatory compliance", "Resource governance", "Standards enforcement"],
    examStyle: "Governance implementation and compliance questions"
  },
  "Tools for managing and deploying Azure resources": {
    focus: "Portal, CLI, PowerShell, ARM templates, and mobile app",
    keyTerms: ["Azure Portal", "Azure CLI", "Azure PowerShell", "ARM templates", "Azure mobile app"],
    scenarios: ["Automation requirements", "Deployment consistency", "Management preferences"],
    examStyle: "Tool selection and automation scenario questions"
  },
  "Monitoring tools in Azure": {
    focus: "Azure Monitor, Service Health, Advisor, and Application Insights",
    keyTerms: ["Azure Monitor", "Azure Service Health", "Azure Advisor", "Application Insights", "Log Analytics"],
    scenarios: ["Performance monitoring", "Health tracking", "Optimization recommendations"],
    examStyle: "Monitoring solution design and troubleshooting questions"
  }
}

// 🎯 DYNAMIC PROMPT GENERATOR BASED ON MICROSOFT LEARN CONTENT
function generateTopicSpecificPrompt(topic: string, certification: string, questionCount: number) {
  const topicSpec = AZ900_TOPIC_SPECIFICATIONS[topic] || {
    focus: "General Azure and cloud concepts",
    keyTerms: ["Azure", "cloud computing", "Microsoft Azure"],
    scenarios: ["Basic cloud scenarios"],
    examStyle: "Fundamental knowledge questions"
  }

  return `You are a Microsoft Azure certification expert creating ${certification} exam questions.

TOPIC FOCUS: ${topic}
LEARNING OBJECTIVES: ${topicSpec.focus}

KEY TERMS TO INCLUDE: ${topicSpec.keyTerms.join(", ")}
SCENARIO TYPES: ${topicSpec.scenarios.join(", ")}
QUESTION STYLE: ${topicSpec.examStyle}

EXAM REQUIREMENTS:
- Questions must be specific to "${topic}" - NOT generic Azure questions
- Use real-world scenarios that test understanding of this specific topic
- Include terminology and concepts specific to this learning objective
- Mirror actual ${certification} exam difficulty and style
- Focus on practical application, not just definitions

QUESTION TYPES TO INCLUDE:
- Scenario-based: "A company needs to..." situations
- Comparison: "Which option best addresses..." questions  
- Implementation: "To achieve X, you should..." questions
- Troubleshooting: "When Y occurs, the cause is..." questions

CRITICAL: Generate questions that someone studying ONLY "${topic}" would expect to see.
Do NOT generate generic Azure questions that could apply to any section.

Return exactly ${questionCount} questions in this JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Scenario-based question specific to ${topic}",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Detailed explanation with topic-specific reasoning"
    }
  ]
}`
}

// 🎯 TOPIC-SPECIFIC QUESTION VALIDATION
function validateTopicSpecificity(questions: any[], topic: string): any[] {
  const topicSpec = AZ900_TOPIC_SPECIFICATIONS[topic]
  if (!topicSpec) return questions

  // Score questions based on topic relevance
  return questions.map(q => {
    let relevanceScore = 0
    const questionText = (q.question + ' ' + q.options.join(' ')).toLowerCase()
    
    // Check for topic-specific terms
    topicSpec.keyTerms.forEach(term => {
      if (questionText.includes(term.toLowerCase())) {
        relevanceScore += 2
      }
    })
    
    // Prefer scenario-based questions
    if (questionText.includes('company') || questionText.includes('organization') || questionText.includes('scenario')) {
      relevanceScore += 1
    }
    
    return {
      ...q,
      relevanceScore,
      topicAlignment: relevanceScore >= 2 ? 'high' : relevanceScore >= 1 ? 'medium' : 'low'
    }
  }).sort((a, b) => b.relevanceScore - a.relevanceScore)
}

// 🎯 ENHANCED FALLBACK QUESTIONS BY TOPIC
const TOPIC_SPECIFIC_FALLBACKS = {
  "What is cloud computing?": [
    {
      question: "A startup wants to avoid large upfront infrastructure costs and scale resources based on demand. Which cloud computing characteristic best addresses this need?",
      options: ["A) Broad network access", "B) Rapid elasticity", "C) Resource pooling", "D) Measured service"],
      correct: 1,
      explanation: "Rapid elasticity allows automatic scaling of resources up or down based on demand, avoiding upfront costs."
    },
    {
      question: "An organization wants to access applications from any device with internet connectivity. Which cloud characteristic enables this capability?",
      options: ["A) On-demand self-service", "B) Broad network access", "C) Resource pooling", "D) Measured service"],
      correct: 1,
      explanation: "Broad network access ensures services are available over the network through standard mechanisms."
    }
  ],
  "Monitoring tools in Azure": [
    {
      question: "A company needs to track the performance of their Azure web application and identify slow-performing pages. Which Azure service should they implement?",
      options: ["A) Azure Monitor", "B) Azure Service Health", "C) Application Insights", "D) Azure Advisor"],
      correct: 2,
      explanation: "Application Insights provides detailed application performance monitoring and can identify performance bottlenecks."
    },
    {
      question: "An administrator wants to receive recommendations for optimizing Azure resource costs and performance. Which tool provides these capabilities?",
      options: ["A) Azure Monitor", "B) Azure Advisor", "C) Azure Service Health", "D) Log Analytics"],
      correct: 1,
      explanation: "Azure Advisor provides personalized recommendations for cost optimization, performance, and security."
    }
  ],
  "Benefits of using cloud services": [
    {
      question: "A company experiences seasonal traffic spikes and wants to automatically adjust computing resources. Which cloud benefit addresses this requirement?",
      options: ["A) High availability", "B) Scalability", "C) Security", "D) Predictability"],
      correct: 1,
      explanation: "Scalability allows resources to be increased or decreased automatically based on demand."
    },
    {
      question: "An organization wants to ensure their services remain available even if one datacenter fails. Which cloud benefit provides this capability?",
      options: ["A) Scalability", "B) Elasticity", "C) High availability", "D) Agility"],
      correct: 2,
      explanation: "High availability ensures services continue operating even when individual components or datacenters fail."
    }
  ]
}

function getTopicSpecificFallbacks(topic: string, count: number): any[] {
  const fallbacks = TOPIC_SPECIFIC_FALLBACKS[topic] || TOPIC_SPECIFIC_FALLBACKS["What is cloud computing?"]
  return fallbacks.slice(0, count).map((q, index) => ({
    ...q,
    id: index + 1,
    domain: topic,
    certification: 'AZ-900',
    isFallback: true,
    topicSpecific: true
  }))
}

// 🎯 MAIN API HANDLER WITH ENHANCED TOPIC AWARENESS
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      certification = 'AZ-900', 
      domain = 'Cloud Concepts', 
      questionCount = 10,
      topicDetails = null,
      moduleContent = []
    } = body

    // Determine the specific topic
    const specificTopic = topicDetails?.topicTitle || domain
    console.log(`🎯 Generating ${questionCount} TOPIC-SPECIFIC questions for: "${specificTopic}"`)

    // Generate topic-specific prompt
    const dynamicPrompt = generateTopicSpecificPrompt(specificTopic, certification, questionCount)
    
    console.log(`📝 Using topic-specific prompt for: ${specificTopic}`)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        { 
          role: 'system', 
          content: `You are a Microsoft certification expert. Create exam questions specific to the requested topic. Always respond with valid JSON.` 
        },
        { 
          role: 'user', 
          content: dynamicPrompt
        }
      ],
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim()
    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    console.log(`📝 AI Response received for "${specificTopic}" (${aiResponse.length} chars)`)

    // Parse response
    let parsedData
    try {
      parsedData = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error(`❌ Parse error for topic "${specificTopic}":`, parseError.message)
      const fallbacks = getTopicSpecificFallbacks(specificTopic, questionCount)
      return NextResponse.json({ 
        questions: fallbacks,
        metadata: {
          certification,
          domain: specificTopic,
          questionCount: fallbacks.length,
          source: 'Topic-Specific Fallback',
          topicFocus: specificTopic,
          isFallback: true
        }
      })
    }

    const questions = parsedData.questions || []
    
    if (!Array.isArray(questions) || questions.length === 0) {
      const fallbacks = getTopicSpecificFallbacks(specificTopic, questionCount)
      return NextResponse.json({ 
        questions: fallbacks,
        metadata: {
          certification,
          domain: specificTopic,
          questionCount: fallbacks.length,
          source: 'Topic-Specific Fallback',
          topicFocus: specificTopic,
          isFallback: true
        }
      })
    }

    // Validate topic specificity
    const topicValidatedQuestions = validateTopicSpecificity(questions, specificTopic)
    
    // Enhance questions with metadata
    const enhancedQuestions = topicValidatedQuestions.slice(0, questionCount).map((q, index) => ({
      id: index + 1,
      question: q.question?.trim() || `Question ${index + 1}`,
      options: Array.isArray(q.options) ? q.options.map(opt => opt.trim()) : [`A) Option 1`, `B) Option 2`, `C) Option 3`, `D) Option 4`],
      correct: typeof q.correct === 'number' ? q.correct : 0,
      explanation: q.explanation?.trim() || 'Explanation not provided',
      domain: specificTopic,
      certification: certification,
      topicAlignment: q.topicAlignment || 'medium',
      relevanceScore: q.relevanceScore || 0,
      generatedAt: new Date().toISOString()
    }))

    console.log(`✅ Generated ${enhancedQuestions.length} topic-specific questions for "${specificTopic}"`)
    console.log(`🎯 Topic alignment scores:`, enhancedQuestions.map(q => ({ id: q.id, score: q.relevanceScore, alignment: q.topicAlignment })))

    return NextResponse.json({
      questions: enhancedQuestions,
      metadata: {
        certification,
        domain: specificTopic,
        questionCount: enhancedQuestions.length,
        generatedAt: new Date().toISOString(),
        source: 'Microsoft Learn Topic-Specific',
        topicFocus: specificTopic,
        averageRelevanceScore: enhancedQuestions.reduce((sum, q) => sum + q.relevanceScore, 0) / enhancedQuestions.length,
        highAlignmentCount: enhancedQuestions.filter(q => q.topicAlignment === 'high').length
      }
    })

  } catch (error) {
    console.error('❌ Enhanced quiz generation error:', error)
    
    // Enhanced fallback with topic awareness
    const body = await req.json().catch(() => ({}))
    const specificTopic = body.topicDetails?.topicTitle || body.domain || 'Cloud Concepts'
    const fallbacks = getTopicSpecificFallbacks(specificTopic, body.questionCount || 5)
    
    return NextResponse.json({ 
      questions: fallbacks,
      metadata: {
        certification: body.certification || 'AZ-900',
        domain: specificTopic,
        questionCount: fallbacks.length,
        source: 'Error Recovery Fallback',
        topicFocus: specificTopic,
        isFallback: true,
        error: 'Enhanced system error, using topic-specific backup questions'
      }
    })
  }
}