// lib/sessionManager.ts
// STEP 1: Just create this file, don't change anything else yet

interface SessionData {
  sessionId: string
  startTime: number
  lastActivity: number
  messageCount: number
  quizCount: number
}

interface DailyUsageData {
  date: string
  messagesUsed: number
  quizzesGenerated: number
}

export const BUSINESS_LIMITS = {
  MAX_DAILY_MESSAGES: 50,
  MAX_DAILY_QUIZZES: 20,
  MESSAGE_COOLDOWN: 2000, // 2 seconds
  QUIZ_COOLDOWN: 10000,   // 10 seconds
}

class SessionManager {
  private static instance: SessionManager
  private currentSession: SessionData | null = null

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  // Start a simple session
  startSession(): string {
    const sessionId = `session_${Date.now()}`
    
    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      messageCount: 0,
      quizCount: 0,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('currentSession', JSON.stringify(this.currentSession))
    }
    
    console.log('🟢 Session started:', sessionId)
    return sessionId
  }

  // Simple message check
  canSendMessage(): { allowed: boolean, reason?: string } {
    if (typeof window === 'undefined') return { allowed: true }

    // Check daily limit
    const dailyUsage = this.getDailyUsage()
    if (dailyUsage.messagesUsed >= BUSINESS_LIMITS.MAX_DAILY_MESSAGES) {
      return { 
        allowed: false, 
        reason: `Daily message limit reached (${BUSINESS_LIMITS.MAX_DAILY_MESSAGES}). Try again tomorrow.` 
      }
    }

    // Check cooldown
    const lastMessage = localStorage.getItem('lastMessageTime')
    if (lastMessage) {
      const timeSinceLastMessage = Date.now() - parseInt(lastMessage)
      if (timeSinceLastMessage < BUSINESS_LIMITS.MESSAGE_COOLDOWN) {
        return { 
          allowed: false, 
          reason: 'Please wait a moment before sending another message'
        }
      }
    }

    return { allowed: true }
  }

  // Record a message
  recordMessage(): void {
    if (typeof window === 'undefined') return

    if (this.currentSession) {
      this.currentSession.messageCount++
      this.currentSession.lastActivity = Date.now()
      localStorage.setItem('currentSession', JSON.stringify(this.currentSession))
    }
    
    localStorage.setItem('lastMessageTime', Date.now().toString())
    this.updateDailyUsage('messagesUsed', 1)
  }

  // Simple quiz check
  canGenerateQuiz(): { allowed: boolean, reason?: string } {
    if (typeof window === 'undefined') return { allowed: true }

    const dailyUsage = this.getDailyUsage()
    if (dailyUsage.quizzesGenerated >= BUSINESS_LIMITS.MAX_DAILY_QUIZZES) {
      return { 
        allowed: false, 
        reason: `Daily quiz limit reached (${BUSINESS_LIMITS.MAX_DAILY_QUIZZES}). Try again tomorrow.` 
      }
    }

    const lastQuiz = localStorage.getItem('lastQuizTime')
    if (lastQuiz) {
      const timeSinceLastQuiz = Date.now() - parseInt(lastQuiz)
      if (timeSinceLastQuiz < BUSINESS_LIMITS.QUIZ_COOLDOWN) {
        return { 
          allowed: false, 
          reason: 'Please wait before generating another quiz' 
        }
      }
    }

    return { allowed: true }
  }

  // Record a quiz
  recordQuiz(): void {
    if (typeof window === 'undefined') return

    if (this.currentSession) {
      this.currentSession.quizCount++
      this.currentSession.lastActivity = Date.now()
      localStorage.setItem('currentSession', JSON.stringify(this.currentSession))
    }
    
    localStorage.setItem('lastQuizTime', Date.now().toString())
    this.updateDailyUsage('quizzesGenerated', 1)
  }

  // Get daily usage
  getDailyUsage(): DailyUsageData {
    if (typeof window === 'undefined') {
      return { date: new Date().toDateString(), messagesUsed: 0, quizzesGenerated: 0 }
    }

    const today = new Date().toDateString()
    const savedUsage = localStorage.getItem(`dailyUsage_${today}`)
    
    if (savedUsage) {
      return JSON.parse(savedUsage)
    }
    
    return { date: today, messagesUsed: 0, quizzesGenerated: 0 }
  }

  private updateDailyUsage(field: 'messagesUsed' | 'quizzesGenerated', increment: number): void {
    if (typeof window === 'undefined') return

    const today = new Date().toDateString()
    const usage = this.getDailyUsage()
    
    usage[field] += increment
    localStorage.setItem(`dailyUsage_${today}`, JSON.stringify(usage))
  }
}

// Add to end of lib/sessionManager.ts (before the exports)

/**
 * Load user profile from localStorage with validation
 * Moved from session-utils.ts
 */
export const loadUserProfile = (): any => {
  if (typeof window === 'undefined') return null
  
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
 * Moved from session-utils.ts
 */
export const saveUserProfile = (profile: any): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('userProfile', JSON.stringify(profile))
    console.log('✅ User profile saved')
  } catch (error) {
    console.error('Error saving user profile:', error)
  }
}

/**
 * Reset user profile and clear session data
 * Moved from session-utils.ts
 */
export const resetUserProfile = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('userProfile')
  localStorage.removeItem('currentSession')
  console.log('🔄 User profile and session cleared')
}

// Export simple functions
export const sessionManager = SessionManager.getInstance()
export const startNewSession = () => sessionManager.startSession()
export const canSendMessage = () => sessionManager.canSendMessage()
export const recordMessage = () => sessionManager.recordMessage()
export const canGenerateQuiz = () => sessionManager.canGenerateQuiz()
export const recordQuiz = () => sessionManager.recordQuiz()
export const getDailyUsage = () => sessionManager.getDailyUsage()

