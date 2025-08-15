// lib/utils/session-utils.ts
// Session management utilities extracted from page.tsx
// Phase 1 consolidation - targeting ~30 lines saved

import { canSendMessage, canGenerateQuiz } from '../sessionManager'
import type { UserProfile } from './message-utils'

/**
 * Initialize a new session with tracking data
 * Extracted from page.tsx initializeSession function - ~15 lines saved
 */
export const initializeNewSession = (): void => {
  console.log('🔍 initializeSession called')
  const sessionId = `session_${Date.now()}`
  const session = {
    sessionId,
    startTime: Date.now(),
    lastActivity: Date.now(),
    messageCount: 0,
    quizCount: 0
  }
  localStorage.setItem('currentSession', JSON.stringify(session))
  console.log('🟢 Session created:', session)
  console.log('🔍 localStorage now has:', localStorage.getItem('currentSession'))
}

/**
 * Test session limits for debugging
 * Extracted from page.tsx testSessionLimits function - ~5 lines saved
 */
export const testSessionLimits = (): void => {
  console.log('Message check:', canSendMessage())
  console.log('Quiz check:', canGenerateQuiz())
}

/**
 * Reset user profile and clear session data
 * Extracted functionality for profile reset - ~10 lines saved
 */
export const resetUserProfile = (): void => {
  localStorage.removeItem('userProfile')
  localStorage.removeItem('currentSession')
  console.log('🔄 User profile and session cleared')
}

/**
 * Load user profile from localStorage with validation
 * Helper function for profile management
 */
export const loadUserProfile = (): UserProfile | null => {
  try {
    const savedProfile = localStorage.getItem('userProfile')
    return savedProfile ? JSON.parse(savedProfile) : null
  } catch (error) {
    console.error('Error loading user profile:', error)
    return null
  }
}

/**
 * Save user profile to localStorage
 * Helper function for profile management
 */
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    console.log('✅ User profile saved')
  } catch (error) {
    console.error('Error saving user profile:', error)
  }
}