// 🚀 REFACTORED MULTI-CERTIFICATION QUIZ ROUTE
// app/api/generate-quiz/route.ts

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { 
  TopicSpecificationLoader, 
  UniversalPromptGenerator, 
  FallbackManager,
  CERTIFICATION_REGISTRY 
} from './certification-system'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 🎯 UNIVERSAL QUIZ GENERATION HANDLER
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

    // Validate certification is supported
    if (!CERTIFICATION_REGISTRY[certification]) {
      return NextResponse.json(
        { 
          error: `Unsupported certification: ${certification}`,
          supportedCertifications: Object.keys(CERTIFICATION_REGISTRY)
        },
        { status: 400 }
      )
    }

    // Determine the specific topic
    const specificTopic = topicDetails?.topicTitle || domain
    console.log(`🎯 Generating ${questionCount} questions for ${certification}: "${specificTopic}"`)

    try {
      // 1. Load certification-specific topic specifications
      const specifications = await TopicSpecificationLoader.loadSpecifications(certification)
      const topicSpec = specifications[specificTopic]

      if (!topicSpec) {
        console.log(`⚠️ No specifications found for topic: "${specificTopic}" in ${certification}`)
        console.log(`Available topics:`, Object.keys(specifications))
        
        // Use fallback system
        const fallbackQuestions = await FallbackManager.getFallbackQuestions(
          certification, 
          specificTopic, 
          questionCount
        )

        return NextResponse.json({ 
          questions: fallbackQuestions.map((q, index) => ({
            ...q,
            id: index + 1,
            domain: specificTopic,
            certification,
            isFallback: true,
            topicSpecific: false
          })),
          metadata: {
            certification,
            domain: specificTopic,
            questionCount: fallbackQuestions.length,
            source: 'Fallback System',
            topicFocus: specificTopic,
            isFallback: true,
            warning: `Topic specifications not found for ${certification}, using fallback questions`
          }
        })
      }

      // 2. Generate certification-specific prompt
      const dynamicPrompt = UniversalPromptGenerator.generateTopicPrompt(
        specificTopic, 
        certification, 
        questionCount, 
        topicSpec
      )
      
      console.log(`📝 Using ${certification}-specific prompt for: ${specificTopic}`)

      // 3. Generate questions using OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: "json_object" },
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          { 
            role: 'system', 
            content: `You are a certification expert. Create exam questions specific to the requested topic and certification.

            Focus on ${CERTIFICATION_REGISTRY[certification].name} exam standards.
            Provider: ${CERTIFICATION_REGISTRY[certification].provider}
            Level: ${CERTIFICATION_REGISTRY[certification].level}
            
            Generate questions that match the exact exam format and difficulty for this certification.`
          },
          { 
            role: 'user', 
            content: dynamicPrompt
          }
        ],
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('No response from OpenAI')
      }

      const quizData = JSON.parse(response)
      
      // 4. Validate and format response
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid response format from OpenAI')
      }

      // Enhance questions with metadata
      const enhancedQuestions = quizData.questions.map((q: any, index: number) => ({
        ...q,
        id: index + 1,
        domain: specificTopic,
        certification,
        provider: CERTIFICATION_REGISTRY[certification].provider,
        level: CERTIFICATION_REGISTRY[certification].level,
        topicSpecific: true,
        isFallback: false,
        metadata: {
          keyTerms: topicSpec.keyTerms,
          scenarios: topicSpec.scenarios,
          examStyle: topicSpec.examStyle,
          difficulty: topicSpec.difficulty || 'fundamental'
        }
      }))

      return NextResponse.json({
        questions: enhancedQuestions,
        metadata: {
          certification,
          certificationName: CERTIFICATION_REGISTRY[certification].name,
          provider: CERTIFICATION_REGISTRY[certification].provider,
          level: CERTIFICATION_REGISTRY[certification].level,
          domain: specificTopic,
          questionCount: enhancedQuestions.length,
          source: 'AI Generated',
          topicFocus: specificTopic,
          isFallback: false,
          topicSpecification: {
            focus: topicSpec.focus,
            keyTerms: topicSpec.keyTerms,
            scenarios: topicSpec.scenarios,
            examStyle: topicSpec.examStyle
          }
        }
      })

    } catch (specError) {
      console.error(`Error loading specifications for ${certification}:`, specError)
      
      // Fallback to generic questions for this certification
      const fallbackQuestions = await FallbackManager.getFallbackQuestions(
        certification, 
        specificTopic, 
        questionCount
      )

      return NextResponse.json({ 
        questions: fallbackQuestions.map((q, index) => ({
          ...q,
          id: index + 1,
          domain: specificTopic,
          certification,
          isFallback: true,
          topicSpecific: false
        })),
        metadata: {
          certification,
          domain: specificTopic,
          questionCount: fallbackQuestions.length,
          source: 'Emergency Fallback',
          topicFocus: specificTopic,
          isFallback: true,
          error: `Could not load ${certification} specifications: ${specError.message}`
        }
      })
    }

  } catch (error) {
    console.error('Quiz generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate quiz',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// 🎯 HELPER ENDPOINT: Get available certifications and topics
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const certification = searchParams.get('certification')

  try {
    if (certification) {
      // Return topics for specific certification
      if (!CERTIFICATION_REGISTRY[certification]) {
        return NextResponse.json(
          { error: `Unsupported certification: ${certification}` },
          { status: 400 }
        )
      }

      const specifications = await TopicSpecificationLoader.loadSpecifications(certification)
      
      return NextResponse.json({
        certification,
        certificationName: CERTIFICATION_REGISTRY[certification].name,
        provider: CERTIFICATION_REGISTRY[certification].provider,
        level: CERTIFICATION_REGISTRY[certification].level,
        topics: Object.keys(specifications),
        topicCount: Object.keys(specifications).length,
        sampleTopic: specifications[Object.keys(specifications)[0]]
      })
    } else {
      // Return all available certifications
      return NextResponse.json({
        supportedCertifications: Object.values(CERTIFICATION_REGISTRY).map(cert => ({
          code: cert.code,
          name: cert.name,
          provider: cert.provider,
          level: cert.level
        })),
        totalCertifications: Object.keys(CERTIFICATION_REGISTRY).length,
        providers: [...new Set(Object.values(CERTIFICATION_REGISTRY).map(c => c.provider))],
        levels: [...new Set(Object.values(CERTIFICATION_REGISTRY).map(c => c.level))]
      })
    }
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to retrieve certification information',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// 🎯 EXAMPLE USAGE:
/*
POST /api/generate-quiz
{
  "certification": "AZ-104",
  "domain": "Manage Azure identities and governance",
  "questionCount": 10
}

GET /api/generate-quiz?certification=AWS-CLF
Returns topics available for AWS Cloud Practitioner

GET /api/generate-quiz
Returns all supported certifications
*/