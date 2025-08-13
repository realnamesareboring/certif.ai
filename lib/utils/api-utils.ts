// lib/utils/api-utils.ts
// API utility functions extracted from page.tsx
// Phase 1 consolidation - targeting ~60 lines saved

import { UserProfile } from './message-utils'
import type { QuizQuestion, ChatMessage } from '../../types'

// Type alias for consistency with existing code
type Message = ChatMessage

/**
 * Send message to chat API with user profile context
 * Extracted from page.tsx sendMessage function - ~25 lines saved
 */
export const sendMessageToAPI = async (
  messages: Message[],
  userProfile: UserProfile | null
): Promise<string> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      messages,
      userProfile: userProfile?.communicationStyle 
    }),
  })

  if (!response.ok) throw new Error('Failed to get response')
  const data = await response.json()
  return data.message
}

/**
 * Generate topic-specific quiz via API
 * Extracted from page.tsx generateTopicQuiz function - ~35 lines saved
 */
export const generateTopicQuizAPI = async (
  certification: string,
  topicDetails: any
): Promise<QuizQuestion[]> => {
  const response = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      certification,
      domain: topicDetails.title, // Using topic title as domain for compatibility
      questionCount: 10,
      topicDetails: {
        topicTitle: topicDetails.title,
        moduleTitle: topicDetails.moduleTitle,
        topicId: topicDetails.id,
        moduleId: topicDetails.moduleId
      },
      moduleContent: topicDetails.keyPoints || []
    }),
  })

  if (!response.ok) throw new Error('Failed to generate topic quiz')
  const data = await response.json()
  return data.questions
}

/**
 * Load certification content via API
 * Extracted from page.tsx loadCertificationContent function - ~15 lines saved
 */
export const loadCertificationContentAPI = async (certificationId: string) => {
  const response = await fetch('/api/load-certification-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ certificationId }),
  })

  if (!response.ok) throw new Error('Failed to load content')
  const result = await response.json()
  
  return {
    content: result.content,
    allTopics: result.content.modules.flatMap(module => 
      module.topics.map(topic => ({
        ...topic,
        moduleTitle: module.title,
        moduleId: module.moduleId,
        estimatedTime: module.estimatedTime,
        weight: module.weight
      }))
    )
  }
}

/**
 * Generate error message based on user communication style
 * Helper function for API error handling
 */
export const getAPIErrorMessage = (userProfile: UserProfile | null): string => {
  const tone = userProfile?.communicationStyle?.tone
  
  if (tone === 'casual') {
    return 'Oops! Something went wrong. Try again?'
  } else if (tone === 'formal') {
    return 'I apologize, but I encountered an error. Please try again.'
  } else {
    return 'Sorry, there was an issue processing your request. Please try again.'
  }
}