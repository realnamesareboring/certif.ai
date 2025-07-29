import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ENHANCED_STYLE_ANALYSIS_PROMPT = `You are an expert communication analyst. Analyze this text sample to understand the person's natural communication style and learning preferences.

Focus on these aspects:

**TONE** - How do they naturally communicate?
• casual: informal language, slang, contractions, relaxed grammar
• formal: professional language, proper grammar, structured sentences  
• mixed: blend of casual and formal depending on context

**COMPLEXITY** - What depth of explanation do they prefer?
• simple: straightforward, no jargon, easy to understand
• detailed: comprehensive explanations with context
• technical: comfortable with technical terms and deep analysis

**EXPLANATION STYLE** - How do they best learn concepts?
• examples: real-world scenarios and concrete cases
• step-by-step: methodical, sequential breakdown
• analogies: comparisons to familiar concepts
• direct: straight facts without elaboration

**LEARNING PREFERENCE** - How do they process information?
• visual: mentions seeing, showing, visual elements
• conversational: prefers dialogue and back-and-forth
• structured: likes organized, hierarchical presentation

IMPORTANT: Base your analysis on the ACTUAL language patterns, not just keywords. Look at:
- Grammar and sentence structure
- Word choice and vocabulary 
- Punctuation and formatting
- Overall communication energy and style

Return ONLY this JSON structure:
{
  "style": {
    "tone": "casual" | "formal" | "mixed",
    "complexity": "simple" | "detailed" | "technical",
    "explanationStyle": "examples" | "step-by-step" | "analogies" | "direct", 
    "learningPreference": "visual" | "conversational" | "structured"
  },
  "confidence": "high" | "medium" | "low",
  "reasoning": "Brief explanation of key indicators that led to this analysis"
}`

export async function POST(req: NextRequest) {
  try {
    const { textSample } = await req.json()

    if (!textSample || typeof textSample !== 'string' || textSample.trim().length < 15) {
      return NextResponse.json(
        { error: 'Text sample is required (minimum 15 characters)' },
        { status: 400 }
      )
    }

    console.log('Analyzing text sample:', textSample)

    // Enhanced prompt with the actual text
    const fullPrompt = `${ENHANCED_STYLE_ANALYSIS_PROMPT}

TEXT SAMPLE TO ANALYZE:
"${textSample}"

Analyze the communication style and return the JSON response:`

    // Call OpenAI with enhanced prompt and better parameters
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert communication analyst. Return only valid JSON with your analysis.' 
        },
        { role: 'user', content: fullPrompt }
      ],
      max_tokens: 600,
      temperature: 0.1, // Very low temperature for consistent analysis
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim()
    if (!aiResponse) {
      throw new Error('Empty response from AI')
    }

    console.log('Raw AI response:', aiResponse)

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
    if (!isValidAnalysisResult(analysisResult)) {
      console.error('Invalid structure:', analysisResult)
      throw new Error('Invalid analysis structure')
    }

    console.log('Successfully parsed analysis:', analysisResult)
    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('Style analysis failed:', error)
    
    // Simple fallback - just reasonable defaults based on text length and basic characteristics
    const fallback = createSimpleFallback(req.body?.textSample || '')
    console.log('Using fallback analysis:', fallback)
    
    return NextResponse.json(fallback)
  }
}

// Validate that the AI response has the correct structure
function isValidAnalysisResult(result: any): boolean {
  if (!result || typeof result !== 'object') return false
  if (!result.style || typeof result.style !== 'object') return false
  
  const style = result.style
  const validTones = ['casual', 'formal', 'mixed']
  const validComplexity = ['simple', 'detailed', 'technical']
  const validExplanation = ['examples', 'step-by-step', 'analogies', 'direct']
  const validLearning = ['visual', 'conversational', 'structured']
  
  return validTones.includes(style.tone) &&
         validComplexity.includes(style.complexity) &&
         validExplanation.includes(style.explanationStyle) &&
         validLearning.includes(style.learningPreference)
}

// Minimal fallback with NO text analysis rules
function createSimpleFallback(textSample: string) {
  console.log('AI analysis failed, using neutral defaults')
  
  // If AI can't analyze it, we won't try to outsmart it
  // Just return reasonable defaults that work for most people
  return {
    style: {
      tone: 'mixed',           // Safe default
      complexity: 'simple',    // Most people prefer simple explanations
      explanationStyle: 'examples',  // Examples work for most learners
      learningPreference: 'conversational'  // Default to dialogue
    },
    confidence: 'low',
    reasoning: 'AI analysis unavailable. Using neutral defaults that work for most users.',
    fallback: true
  }
}