// app/api/generate-quiz/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 🎯 STANDARDIZED QUIZ GENERATION PROMPT
const QUIZ_GENERATION_PROMPT = `You are a cloud certification expert. Generate quiz questions that mirror real certification exams.

CRITICAL: Return ONLY this JSON structure with NO other text:

{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Brief explanation"
    }
  ]
}

RULES:
- No newlines inside question text
- No quotes inside options or explanations  
- Use simple punctuation only
- Keep explanations under 100 characters
- Return exactly the requested number of questions`

// 🎯 UNIFIED MODEL CONFIGURATION
const MODEL_CONFIG = {
  model: 'gpt-4o-mini', // Consistent, cost-effective model
  max_tokens: 3500,
  temperature: 0.7,
  presence_penalty: 0.1,
  frequency_penalty: 0.3,
}

// 🛠️ ENHANCED JSON PARSING WITH BETTER ERROR RECOVERY
function parseAIResponse(aiResponse: string): any {
  if (!aiResponse?.trim()) {
    throw new Error('Empty AI response')
  }

  console.log('🔍 Full AI Response:')
  console.log(aiResponse) // <-- This will show us exactly what's wrong

  // Step 1: Clean the response
  let cleanResponse = aiResponse
    .replace(/```json\s*|\s*```/g, '') // Remove markdown
    .replace(/^\s*Here.*?:\s*/i, '')   // Remove intro text
    .replace(/\n\s*\/\/.*$/gm, '')     // Remove comments
    .trim()

  console.log('🔍 Cleaned Response:')
  console.log(cleanResponse.substring(0, 1000)) // First 1000 chars

  // Step 2: Try direct JSON parse (most common case)
  try {
    const parsed = JSON.parse(cleanResponse)
    console.log('✅ Direct JSON parse successful')
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed
    }
  } catch (parseError) {
    console.log('❌ Direct JSON parse failed:', parseError.message)
    console.log('🔍 Problem area around character:', parseError.message.match(/\d+/)?.[0] || 'unknown')
  }

  // Step 3: Simple fallback - just try to find and extract the questions array
  try {
    // Look for the questions array specifically
    const questionsMatch = cleanResponse.match(/"questions"\s*:\s*\[([\s\S]*?)\]/);
    if (questionsMatch) {
      console.log('🔍 Found questions array, attempting to parse...')
      
      // Try to parse just the questions array portion
      const questionsArrayStr = `[${questionsMatch[1]}]`
      const questionsArray = JSON.parse(questionsArrayStr)
      
      console.log('✅ Successfully parsed questions array:', questionsArray.length, 'questions')
      return { questions: questionsArray }
    }
  } catch (extractError) {
    console.log('❌ Questions array extraction failed:', extractError.message)
  }

  // Step 4: Last resort - character by character scan to find the JSON issue
  console.log('🔍 Scanning for JSON syntax errors...')
  let bracketCount = 0
  let inString = false
  let escapeNext = false
  
  for (let i = 0; i < cleanResponse.length; i++) {
    const char = cleanResponse[i]
    const prevChar = cleanResponse[i - 1]
    
    if (escapeNext) {
      escapeNext = false
      continue
    }
    
    if (char === '\\') {
      escapeNext = true
      continue
    }
    
    if (char === '"' && prevChar !== '\\') {
      inString = !inString
      continue
    }
    
    if (!inString) {
      if (char === '{' || char === '[') {
        bracketCount++
      } else if (char === '}' || char === ']') {
        bracketCount--
        if (bracketCount < 0) {
          console.log(`🔍 Bracket mismatch at position ${i}:`, cleanResponse.substring(Math.max(0, i-50), i+50))
          break
        }
      }
    }
  }
  
  console.log('🔍 Final bracket count:', bracketCount, '(should be 0)')

  throw new Error('Unable to parse AI response as JSON')
}

// // 🔧 ALSO ADD this temporary function to your route to bypass parsing issues:
// // Add this right after your OpenAI API call, before the parsing:

// console.log('🔍 Raw AI Response Length:', aiResponse.length)
// console.log('🔍 First 200 characters:', aiResponse.substring(0, 200))
// console.log('🔍 Last 200 characters:', aiResponse.substring(aiResponse.length - 200))

// // Check if it starts and ends like valid JSON
// const startsLikeJSON = aiResponse.trim().startsWith('{')
// const endsLikeJSON = aiResponse.trim().endsWith('}')
// console.log('🔍 Looks like JSON?', { startsLikeJSON, endsLikeJSON })

// 🎯 QUESTION VALIDATION WITH DETAILED LOGGING
function validateAndEnhanceQuestions(questions: any[], certification: string, domain: string, questionCount: number): any[] {
  if (!Array.isArray(questions)) {
    console.log('❌ Questions is not an array:', typeof questions)
    return []
  }

  const validatedQuestions = questions
    .filter((q, index) => {
      // Check all required fields
      const isValid = 
        q &&
        typeof q.question === 'string' && q.question.length > 10 &&
        Array.isArray(q.options) && q.options.length === 4 &&
        typeof q.correct === 'number' && q.correct >= 0 && q.correct < 4 &&
        q.options.every((option: any) => typeof option === 'string' && option.length > 1)

      if (!isValid) {
        console.log(`❌ Invalid question ${index + 1}:`, {
          hasQuestion: !!q?.question,
          questionLength: q?.question?.length || 0,
          hasOptions: Array.isArray(q?.options),
          optionsLength: q?.options?.length || 0,
          correctType: typeof q?.correct,
          correctValue: q?.correct
        })
        return false
      }
      
      return true
    })
    .slice(0, questionCount)
    .map((q, index) => ({
      id: index + 1,
      question: q.question.trim(),
      options: q.options.map((opt: string) => opt.trim()),
      correct: q.correct,
      explanation: q.explanation?.trim() || 'Explanation not provided',
      domain: domain,
      certification: certification,
      generatedAt: new Date().toISOString(),
      difficulty: 'intermediate', // Could be enhanced based on analysis
    }))

  console.log(`✅ Validated ${validatedQuestions.length}/${questions.length} questions`)
  return validatedQuestions
}

// 🎯 IMPROVED FALLBACK QUESTIONS
function generateFallbackQuestions(certification: string, domain: string, count: number): any[] {
  const fallbackTemplates = {
    'AZ-900': [
      {
        question: "A company wants to migrate their on-premises infrastructure to reduce capital expenditure. Which cloud deployment model best addresses this requirement?",
        options: ["A) Private cloud", "B) Public cloud", "C) Hybrid cloud", "D) Community cloud"],
        correct: 1,
        explanation: "Public cloud eliminates the need for upfront capital expenditure as you pay only for what you use (OpEx model)."
      },
      {
        question: "Which Azure service provides identity and access management capabilities?",
        options: ["A) Azure Monitor", "B) Azure Active Directory", "C) Azure Security Center", "D) Azure Key Vault"],
        correct: 1,
        explanation: "Azure Active Directory (Azure AD) is Microsoft's cloud-based identity and access management service."
      },
      {
        question: "What is the primary benefit of using availability zones in Azure?",
        options: ["A) Cost reduction", "B) Performance improvement", "C) High availability", "D) Network security"],
        correct: 2,
        explanation: "Availability zones provide high availability by distributing resources across separate data centers within a region."
      }
    ]
    // Add more templates for other certifications as needed
  }

  const templates = fallbackTemplates[certification as keyof typeof fallbackTemplates] || fallbackTemplates['AZ-900']
  const selectedQuestions = templates.slice(0, count)

  return selectedQuestions.map((q, index) => ({
    ...q,
    id: index + 1,
    domain: domain,
    certification: certification,
    generatedAt: new Date().toISOString(),
    isFallback: true
  }))
}

// 🚀 MAIN API HANDLER
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      certification = 'AZ-900', 
      domain = 'Cloud Concepts', 
      questionCount = 10,
      topicDetails = null 
    } = body

    console.log(`🎯 Generating ${questionCount} questions for ${certification} - ${domain}`)

    // Determine if this is a topic-specific request
    const isTopicSpecific = !!topicDetails
    const contextTitle = isTopicSpecific ? topicDetails.topicTitle : domain

    // 🎯 BUILD DYNAMIC PROMPT
    const dynamicPrompt = `${QUIZ_GENERATION_PROMPT}

CERTIFICATION: ${certification}
DOMAIN/TOPIC: ${contextTitle}
QUESTION COUNT: ${questionCount}

${isTopicSpecific ? `
SPECIFIC TOPIC CONTEXT:
- Module: ${topicDetails.moduleTitle}
- Topic: ${topicDetails.topicTitle}
- Focus on specific concepts within this topic
` : `
DOMAIN FOCUS: ${domain}
- Create questions covering various aspects of this domain
- Include real-world scenarios and practical applications
`}

Generate exactly ${questionCount} unique, scenario-based questions.`

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  response_format: { type: "json_object" }, // ← ADD THIS LINE
  max_tokens: 3500,
  temperature: 0.7,
  messages: [
    { 
      role: 'system', 
      content: `You are a certification expert. Always respond with valid JSON containing questions array.` 
    },
    { 
      role: 'user', 
      content: `Generate exactly ${questionCount} quiz questions for ${certification} certification.

Return ONLY this JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "Simple question text",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct": 0,
      "explanation": "Simple explanation"
    }
  ]
}

Keep all text simple without special characters.`
    }
  ],
})

    const aiResponse = completion.choices[0]?.message?.content?.trim()
    if (!aiResponse) {
      throw new Error('No response from OpenAI')
    }

    console.log(`📝 AI Response received (${aiResponse.length} chars)`)
    console.log('🔍 First 500 characters:')
    console.log(aiResponse.substring(0, 500))
    console.log('🔍 Last 500 characters:')  
    console.log(aiResponse.substring(aiResponse.length - 500))

    const startsLikeJSON = aiResponse.trim().startsWith('{')
    const endsLikeJSON = aiResponse.trim().endsWith('}')
    console.log('🔍 Looks like JSON?', { startsLikeJSON, endsLikeJSON })

    console.log(`📝 AI Response received (${aiResponse.length} chars)`)

    // 🔍 PARSE AND VALIDATE
    let parsedData
    try {
      parsedData = parseAIResponse(aiResponse)
    } catch (parseError) {
      console.error('❌ Parse error:', parseError.message)
      console.log('📄 Raw response preview:', aiResponse.substring(0, 300))
      
      // Use fallback questions
      const fallbackQuestions = generateFallbackQuestions(certification, domain, questionCount)
      return NextResponse.json({ 
        questions: fallbackQuestions,
        metadata: {
          certification,
          domain: contextTitle,
          questionCount: fallbackQuestions.length,
          generatedAt: new Date().toISOString(),
          source: 'Fallback',
          isFallback: true,
          error: 'AI response parsing failed'
        }
      })
    }

    // Extract questions array
    const questions = Array.isArray(parsedData) ? parsedData : parsedData.questions || []
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No valid questions in response')
    }

    // 🛡️ VALIDATE AND ENHANCE QUESTIONS
    const validatedQuestions = validateAndEnhanceQuestions(questions, certification, contextTitle, questionCount)

    if (validatedQuestions.length === 0) {
      console.log('⚠️ No valid questions after validation, using fallback')
      const fallbackQuestions = generateFallbackQuestions(certification, domain, questionCount)
      return NextResponse.json({ 
        questions: fallbackQuestions,
        metadata: {
          certification,
          domain: contextTitle,
          questionCount: fallbackQuestions.length,
          generatedAt: new Date().toISOString(),
          source: 'Fallback',
          isFallback: true,
          error: 'Question validation failed'
        }
      })
    }

    // ✅ SUCCESS RESPONSE
    const response = {
      questions: validatedQuestions,
      metadata: {
        certification,
        domain: contextTitle,
        questionCount: validatedQuestions.length,
        generatedAt: new Date().toISOString(),
        source: isTopicSpecific ? 'Microsoft Learn Topic' : 'Comprehensive Content',
        isTopicSpecific,
        model: MODEL_CONFIG.model
      }
    }

    console.log(`✅ Successfully generated ${validatedQuestions.length} questions`)
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Quiz generation error:', error)

    // 🚨 ERROR HANDLING
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    // Final fallback
    try {
      const body = await req.json()
      const fallbackQuestions = generateFallbackQuestions(
        body.certification || 'AZ-900',
        body.domain || 'Cloud Concepts',
        body.questionCount || 5
      )
      return NextResponse.json({ 
        questions: fallbackQuestions,
        metadata: {
          certification: body.certification || 'AZ-900',
          domain: body.domain || 'Cloud Concepts',
          questionCount: fallbackQuestions.length,
          generatedAt: new Date().toISOString(),
          source: 'Emergency Fallback',
          isFallback: true,
          error: 'System error, using backup questions'
        }
      })
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to generate quiz questions. Please try again later.' },
        { status: 500 }
      )
    }
  }
}