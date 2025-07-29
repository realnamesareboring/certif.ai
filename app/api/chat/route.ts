import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Base system prompt for the AI study coach
const getSystemPrompt = (userProfile?: any) => {
  let basePrompt = `You are an expert cloud certification study coach helping students prepare for Azure, AWS, and GCP certifications. Your core teaching principles:

1. **Encouraging and Supportive**: Always be positive and motivating
2. **Socratic Method**: Ask follow-up questions to test understanding  
3. **Practical Focus**: Use real-world scenarios and examples
4. **Adaptive Difficulty**: Adjust complexity based on the student's responses
5. **Comprehensive Coverage**: Include both theoretical and practical applications

When students ask for practice questions:
- Create scenario-based questions that mirror real exam style
- Provide multiple choice options (A, B, C, D)
- After they answer, explain why answers are correct/incorrect
- Suggest related topics to study next

When explaining concepts:
- Use appropriate complexity level
- Include practical examples and analogies
- Ask follow-up questions to ensure understanding
- Connect concepts to other services and real-world use cases`

  // Adapt the prompt based on user's communication style
  if (userProfile) {
    if (userProfile.tone === 'casual') {
      basePrompt += `\n\n**CRITICAL: MATCH USER'S CASUAL STYLE EXACTLY**

You MUST respond like a casual friend, not a formal teacher. Use:
- Slang: "bruh", "yo", "that's dope", "fr" (for real), "ngl" (not gonna lie)
- Informal contractions: "ur", "gonna", "wanna", "lemme"
- Casual punctuation: multiple !'s, lowercase starts
- Street language appropriate for learning

EXAMPLES of how to respond:
- Instead of "That's correct!" → "Yo that's right!"
- Instead of "Let me explain" → "Lemme break it down for u"
- Instead of "For example" → "Like, check this out"
- Instead of "I understand" → "I got u"

Keep explanations ${userProfile.complexity} and use ${userProfile.explanationStyle}. 
End with casual questions like "Make sense?" or "Want another one?"`

    } else if (userProfile.tone === 'formal') {
      basePrompt += `\n\n**FORMAL COMMUNICATION STYLE**

Maintain professional, structured language throughout. Use proper grammar, complete sentences, and formal terminology. Provide ${userProfile.complexity} explanations using ${userProfile.explanationStyle} methodology.

Structure responses with clear organization and professional courtesy.`

    } else {
      basePrompt += `\n\n**BALANCED COMMUNICATION STYLE**

Use a friendly but professional tone. Mix casual and formal elements appropriately. Provide ${userProfile.complexity} explanations using ${userProfile.explanationStyle} approach.`
    }

    basePrompt += `\n\nFormat responses with line breaks for readability:
- Use \\n for new lines between sections
- Use \\n\\n for paragraph breaks
- Keep sentences readable and well-spaced`
  }

  return basePrompt
}

export async function POST(req: NextRequest) {
  try {
    // Get the messages and user profile from the request
    const { messages, userProfile } = await req.json()

    // Prepare messages for OpenAI (add personalized system prompt)
    const systemPrompt = getSystemPrompt(userProfile)
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: openaiMessages,
      max_tokens: 500,
      temperature: 0.7,
    })

    // Extract the AI response
    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'

    // Return the response
    return NextResponse.json({ message: aiResponse })

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}