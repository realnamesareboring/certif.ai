// app/api/generate-quiz/route.ts - COMPLETE VERSION WITH ALL AZ-900 TOPICS
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { AZ900_TOPIC_SPECIFICATIONS } from '../../data/quiz-topics/az900-specifications'


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

// 🎯 COMPREHENSIVE TOPIC-SPECIFIC FALLBACK QUESTIONS
const TOPIC_SPECIFIC_FALLBACKS = {
  "Describe cloud computing": [
    {
      question: "A startup wants to avoid large upfront infrastructure costs and scale resources based on demand. Which cloud computing characteristic best addresses this need?",
      options: ["A) Broad network access", "B) Rapid elasticity", "C) Resource pooling", "D) Measured service"],
      correct: 1,
      explanation: "Rapid elasticity allows automatic scaling of resources up or down based on demand, avoiding upfront costs."
    },
    {
      question: "In the shared responsibility model, which security aspect is always the customer's responsibility regardless of service type?",
      options: ["A) Physical security", "B) Network controls", "C) Data classification", "D) Host infrastructure"],
      correct: 2,
      explanation: "Data classification is always the customer's responsibility across IaaS, PaaS, and SaaS."
    }
  ],
  "Describe the benefits of using cloud services": [
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
  ],
  "Describe cloud service types": [
    {
      question: "A development team wants to focus on coding without managing operating systems or runtime environments. Which service type best meets this need?",
      options: ["A) Infrastructure as a Service (IaaS)", "B) Platform as a Service (PaaS)", "C) Software as a Service (SaaS)", "D) Function as a Service (FaaS)"],
      correct: 1,
      explanation: "PaaS provides a platform for development without requiring management of underlying infrastructure or operating systems."
    }
  ],
  "Describe the core architectural components of Azure": [
    {
      question: "A company needs to ensure their application remains available even if an entire Azure datacenter becomes unavailable. Which Azure feature should they use?",
      options: ["A) Azure regions", "B) Availability zones", "C) Resource groups", "D) Management groups"],
      correct: 1,
      explanation: "Availability zones are physically separate locations within an Azure region that protect against datacenter failures."
    },
    {
      question: "An enterprise wants to apply governance policies across multiple Azure subscriptions. Which Azure feature provides this capability?",
      options: ["A) Resource groups", "B) Azure regions", "C) Management groups", "D) Availability zones"],
      correct: 2,
      explanation: "Management groups allow you to organize subscriptions and apply governance policies across multiple subscriptions."
    }
  ],
  "Describe Azure compute and networking services": [
    {
      question: "A company needs to provide remote desktop access to applications for employees working from home. Which Azure service should they use?",
      options: ["A) Azure Virtual Machines", "B) Azure Functions", "C) Azure Virtual Desktop", "D) Azure Container Instances"],
      correct: 2,
      explanation: "Azure Virtual Desktop provides virtualized desktop and application access for remote workers."
    },
    {
      question: "An organization wants to establish a private, dedicated connection to Azure that doesn't go over the public internet. Which service should they use?",
      options: ["A) VPN Gateway", "B) ExpressRoute", "C) Virtual Network", "D) Azure DNS"],
      correct: 1,
      explanation: "ExpressRoute provides private connectivity to Azure that doesn't traverse the public internet."
    }
  ],
  "Describe Azure storage services": [
    {
      question: "A company needs to store large amounts of unstructured data that is accessed infrequently and can tolerate several hours of retrieval time. Which storage tier should they use?",
      options: ["A) Hot tier", "B) Cool tier", "C) Archive tier", "D) Premium tier"],
      correct: 2,
      explanation: "Archive tier is designed for data that is rarely accessed and can tolerate several hours of retrieval latency."
    },
    {
      question: "An organization needs to migrate 80 TB of data to Azure but has limited internet bandwidth. Which Azure service should they use?",
      options: ["A) AzCopy", "B) Azure Storage Explorer", "C) Azure Data Box", "D) Azure File Sync"],
      correct: 2,
      explanation: "Azure Data Box is designed for large-scale data migration when network bandwidth is limited."
    }
  ],
  "Describe Azure identity, access, and security": [
    {
      question: "A company wants to implement a security model where access is never trusted and always verified. Which security concept should they adopt?",
      options: ["A) Defense in depth", "B) Zero Trust", "C) Role-based access control", "D) Conditional Access"],
      correct: 1,
      explanation: "Zero Trust is a security model that assumes no implicit trust and continuously validates every transaction."
    },
    {
      question: "An organization wants to allow external partners to access specific Azure resources without creating accounts in their Azure AD. Which feature should they use?",
      options: ["A) Multi-factor authentication", "B) Single sign-on", "C) Azure AD B2B", "D) Azure AD B2C"],
      correct: 2,
      explanation: "Azure AD B2B allows external users to access your resources using their own credentials."
    }
  ],
  "Describe cost management in Azure": [
    {
      question: "A company wants to estimate the cost of migrating their on-premises servers to Azure. Which tool should they use?",
      options: ["A) Azure Pricing Calculator", "B) TCO Calculator", "C) Azure Cost Management", "D) Azure Advisor"],
      correct: 1,
      explanation: "The TCO Calculator helps estimate the cost savings of migrating workloads to Azure."
    },
    {
      question: "An organization wants to categorize and track costs across different departments. Which Azure feature should they implement?",
      options: ["A) Resource groups", "B) Management groups", "C) Tags", "D) Subscriptions"],
      correct: 2,
      explanation: "Tags allow you to categorize resources and track costs across different dimensions like departments or projects."
    }
  ],
  "Describe features and tools in Azure for governance and compliance": [
    {
      question: "A company needs to ensure all virtual machines in their subscription have specific security configurations. Which Azure service should they use?",
      options: ["A) Azure Blueprints", "B) Azure Policy", "C) Azure Advisor", "D) Azure Monitor"],
      correct: 1,
      explanation: "Azure Policy allows you to create, assign, and manage policies that enforce rules and effects over your resources."
    },
    {
      question: "An organization wants to prevent accidental deletion of critical resources. Which Azure feature should they implement?",
      options: ["A) Azure Policy", "B) Resource locks", "C) Azure Blueprints", "D) Management groups"],
      correct: 1,
      explanation: "Resource locks prevent users from accidentally deleting or modifying critical resources."
    }
  ],
  "Describe features and tools for managing and deploying Azure resources": [
    {
      question: "A DevOps team wants to deploy the same infrastructure configuration consistently across multiple environments. Which approach should they use?",
      options: ["A) Azure Portal", "B) Azure CLI", "C) ARM templates", "D) Azure Cloud Shell"],
      correct: 2,
      explanation: "ARM templates enable Infrastructure as Code and ensure consistent deployments across environments."
    },
    {
      question: "An organization wants to manage both on-premises and Azure resources from a single control plane. Which service should they use?",
      options: ["A) Azure Resource Manager", "B) Azure Arc", "C) Azure Monitor", "D) Azure Advisor"],
      correct: 1,
      explanation: "Azure Arc extends Azure management capabilities to on-premises and multi-cloud resources."
    }
  ],
  "Describe monitoring tools in Azure": [
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
  ]
}

function getTopicSpecificFallbacks(topic: string, count: number): any[] {
  const fallbacks = TOPIC_SPECIFIC_FALLBACKS[topic] || TOPIC_SPECIFIC_FALLBACKS["Describe cloud computing"]
  return fallbacks.slice(0, count).map((q, index) => ({
    ...q,
    id: index + 1,
    domain: topic,
    certification: 'AZ-900',
    isFallback: true,
    topicSpecific: true
  }))
}

// 🎯 MAIN API HANDLER WITH COMPLETE TOPIC AWARENESS
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

    // Validate that we have specifications for this topic
    if (!AZ900_TOPIC_SPECIFICATIONS[specificTopic]) {
      console.log(`⚠️ No specifications found for topic: "${specificTopic}". Available topics:`, Object.keys(AZ900_TOPIC_SPECIFICATIONS))
      const fallbacks = getTopicSpecificFallbacks(specificTopic, questionCount)
      return NextResponse.json({ 
        questions: fallbacks,
        metadata: {
          certification,
          domain: specificTopic,
          questionCount: fallbacks.length,
          source: 'Topic-Specific Fallback',
          topicFocus: specificTopic,
          isFallback: true,
          warning: 'Topic specifications not found, using fallback questions'
        }
      })
    }

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
        highAlignmentCount: enhancedQuestions.filter(q => q.topicAlignment === 'high').length,
        hasTopicSpecifications: true
      }
    })

  } catch (error) {
    console.error('❌ Enhanced quiz generation error:', error)
    
    // Enhanced fallback with topic awareness
    const body = await req.json().catch(() => ({}))
    const specificTopic = body.topicDetails?.topicTitle || body.domain || 'Describe cloud computing'
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