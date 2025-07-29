import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const CONTEXT_ANALYSIS_PROMPT = `You are an expert at analyzing conversations to identify which cloud certification the user is most interested in or discussing.

Based on the conversation content, determine which certification track would be most relevant:

**Available Certifications:**
- AZ-900: Microsoft Azure Fundamentals (cloud basics, Azure services, pricing)
- SC-200: Microsoft Security Operations Analyst (security, threat detection, Sentinel, Defender)
- AWS-SAA: AWS Solutions Architect Associate (AWS services, architecture, cost optimization)
- GCP-CDL: Google Cloud Digital Leader (Google Cloud, data analytics, ML, digital transformation)

**Analysis Guidelines:**
- Look for specific service names, concepts, and terminology
- Consider the context and type of questions being asked
- Pay attention to security-focused discussions for SC-200
- Notice architecture and design patterns for AWS-SAA
- Identify data/ML/transformation topics for GCP-CDL
- Default to AZ-900 for general cloud discussions

Return ONLY a JSON object with this structure:
{
  "suggestedCertification": "AZ-900" | "SC-200" | "AWS-SAA" | "GCP-CDL",
  "confidence": "high" | "medium" | "low",
  "reasoning": "Brief explanation of why this certification was suggested",
  "topics": ["topic1", "topic2", "topic3"]
}`

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Extract conversation text for analysis
    const conversationText = messages
      .map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`)
      .join('\n')

    console.log('Analyzing conversation context:', conversationText.substring(0, 500))

    // Enhanced prompt with the actual conversation
    const fullPrompt = `${CONTEXT_ANALYSIS_PROMPT}

CONVERSATION TO ANALYZE:
${conversationText}

Analyze this conversation and suggest the most appropriate certification track:`

    // Call OpenAI with context analysis prompt
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert at analyzing conversations to suggest relevant cloud certifications. Return only valid JSON.'
        },
        { role: 'user', content: fullPrompt }
      ],
      max_tokens: 300,
      temperature: 0.1, // Low temperature for consistent analysis
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim()
    if (!aiResponse) {
      throw new Error('Empty response from AI')
    }

    console.log('Raw AI context analysis response:', aiResponse)

    // Try to parse JSON response
    let analysisResult
    try {
      // Clean up the response (remove any markdown formatting)
      const cleanResponse = aiResponse.replace(/```json\s*|\s*```/g, '').trim()
      analysisResult = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw response was:', aiResponse)
      throw new Error('Invalid JSON response from AI')
    }

    // Validate the structure
    if (!isValidContextAnalysis(analysisResult)) {
      console.error('Invalid structure:', analysisResult)
      throw new Error('Invalid analysis structure')
    }

    console.log('Successfully parsed context analysis:', analysisResult)
    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('Context analysis failed:', error)
    
    // Fallback to simple keyword-based analysis
    const fallbackAnalysis = performSimpleKeywordAnalysis(req.body?.messages || [])
    console.log('Using fallback context analysis:', fallbackAnalysis)
    
    return NextResponse.json(fallbackAnalysis)
  }
}

// Validate that the AI response has the correct structure
function isValidContextAnalysis(result: any): boolean {
  if (!result || typeof result !== 'object') return false
  
  const validCertifications = ['AZ-900', 'SC-200', 'AWS-SAA', 'GCP-CDL']
  const validConfidence = ['high', 'medium', 'low']
  
  return validCertifications.includes(result.suggestedCertification) &&
         validConfidence.includes(result.confidence) &&
         typeof result.reasoning === 'string' &&
         Array.isArray(result.topics)
}

// Simple keyword-based fallback analysis
function performSimpleKeywordAnalysis(messages: ConversationMessage[]) {
  const conversationText = messages
    .map(msg => msg.content)
    .join(' ')
    .toLowerCase()

  // Keyword mappings for different certifications
  const certificationKeywords = {
    'SC-200': {
      keywords: ['security', 'sentinel', 'defender', 'xdr', 'threat', 'incident', 'soc', 'analyst', 'hunting', 'kql', 'malware', 'phishing', 'vulnerability'],
      weight: 0
    },
    'AWS-SAA': {
      keywords: ['aws', 'ec2', 's3', 'lambda', 'cloudformation', 'vpc', 'route53', 'elb', 'auto scaling', 'rds', 'dynamodb', 'solutions architect'],
      weight: 0
    },
    'GCP-CDL': {
      keywords: ['gcp', 'google cloud', 'bigquery', 'compute engine', 'cloud storage', 'kubernetes engine', 'ml', 'machine learning', 'dataflow'],
      weight: 0
    },
    'AZ-900': {
      keywords: ['azure', 'cloud', 'fundamentals', 'paas', 'iaas', 'saas', 'subscription', 'resource group', 'vm', 'app service'],
      weight: 0
    }
  }

  // Calculate weights based on keyword matches
  Object.entries(certificationKeywords).forEach(([cert, data]) => {
    data.weight = data.keywords.reduce((count, keyword) => {
      const matches = (conversationText.match(new RegExp(keyword, 'gi')) || []).length
      return count + matches
    }, 0)
  })

  // Find the certification with the highest weight
  const sortedCerts = Object.entries(certificationKeywords)
    .sort(([, a], [, b]) => b.weight - a.weight)

  const topCert = sortedCerts[0]
  const confidence = topCert[1].weight > 3 ? 'high' : topCert[1].weight > 1 ? 'medium' : 'low'

  // Extract detected topics
  const detectedTopics = topCert[1].keywords.filter(keyword => 
    conversationText.includes(keyword)
  ).slice(0, 5)

  return {
    suggestedCertification: topCert[0],
    confidence,
    reasoning: `Detected ${topCert[1].weight} relevant keywords for ${topCert[0]}. ${confidence} confidence based on keyword frequency.`,
    topics: detectedTopics,
    fallback: true
  }
}