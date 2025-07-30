// components/SessionManager.tsx
// UI Components for Session & Usage Management

import React, { useState, useEffect } from 'react'
import { Clock, AlertTriangle, Activity, MessageSquare, FileQuestion, X, Shield } from 'lucide-react'
import { 
  sessionManager, 
  BUSINESS_LIMITS, 
  getTimeRemaining, 
  getDailyUsage, 
  getSessionStats,
  endCurrentSession 
} from '../lib/sessionManager'

// Format time in MM:SS format
const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Session Status Bar Component
export const SessionStatusBar: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [sessionStats, setSessionStats] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      setTimeRemaining(getTimeRemaining())
      setSessionStats(getSessionStats())
    }

    updateStats()
    const interval = setInterval(updateStats, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!sessionStats) return null

  const timePercentage = (timeRemaining / BUSINESS_LIMITS.MAX_SESSION_DURATION) * 100
  const isWarningTime = timeRemaining <= BUSINESS_LIMITS.SESSION_WARNING_TIME
  
  return (
    <div className={`fixed top-4 right-4 z-50 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
    } border rounded-lg shadow-lg transition-all duration-300 ${
      isExpanded ? 'w-80' : 'w-48'
    }`}>
      <div 
        className="p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${
              isWarningTime ? 'text-red-500' : 'text-green-500'
            }`} />
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <div className={`w-16 h-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isWarningTime ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.max(timePercentage, 5)}%` }}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2 rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Messages</span>
                </div>
                <div className="font-medium">{sessionStats.messageCount}</div>
              </div>
              
              <div className={`p-2 rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-1">
                  <FileQuestion className="w-3 h-3" />
                  <span>Quizzes</span>
                </div>
                <div className="font-medium">{sessionStats.quizCount}</div>
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                endCurrentSession('manual')
              }}
              className="w-full px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            >
              End Session
            </button>
          </div>
        )}
      </div>
      
      {isWarningTime && (
        <div className="px-3 pb-2">
          <div className="flex items-center space-x-1 text-xs text-red-500">
            <AlertTriangle className="w-3 h-3" />
            <span>Session ending soon!</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Daily Usage Dashboard Component
export const UsageDashboard: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
  const [dailyUsage, setDailyUsage] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateUsage = () => {
      setDailyUsage(getDailyUsage())
    }

    updateUsage()
    const interval = setInterval(updateUsage, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  if (!dailyUsage) return null

  const usageItems = [
    {
      icon: MessageSquare,
      label: 'Messages',
      used: dailyUsage.messagesUsed,
      limit: BUSINESS_LIMITS.MAX_DAILY_MESSAGES,
      color: 'blue'
    },
    {
      icon: FileQuestion,
      label: 'Quizzes',
      used: dailyUsage.quizzesGenerated,
      limit: BUSINESS_LIMITS.MAX_DAILY_QUIZZES,
      color: 'purple'
    },
    {
      icon: Activity,
      label: 'AI Calls',
      used: dailyUsage.aiInteractions,
      limit: BUSINESS_LIMITS.MAX_DAILY_AI_CALLS,
      color: 'green'
    }
  ]

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-colors ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
            : 'bg-white hover:bg-gray-50 text-gray-700'
        } border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
        title="View Daily Usage"
      >
        <Shield className="w-5 h-5" />
      </button>

      {/* Usage Dashboard Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-96 rounded-lg shadow-xl ${
            theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Daily Usage Limits</h3>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {usageItems.map((item, index) => {
                const Icon = item.icon
                const percentage = (item.used / item.limit) * 100
                const isNearLimit = percentage > 80
                const isAtLimit = percentage >= 100
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${
                        item.color === 'blue' ? 'text-blue-500' :
                        item.color === 'purple' ? 'text-purple-500' :
                        'text-green-500'
                      }`} />
                      <span className="text-sm font-medium">{item.label}</span>
                      <div className="ml-auto text-sm">
                        <span className={isAtLimit ? 'text-red-500' : ''}>{item.used}</span>
                        <span className="text-gray-400">/{item.limit}</span>
                      </div>
                    </div>
                    
                    <div className={`w-full h-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isAtLimit ? 'bg-red-500' :
                          isNearLimit ? 'bg-yellow-500' :
                          item.color === 'blue' ? 'bg-blue-500' :
                          item.color === 'purple' ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    {isAtLimit && (
                      <p className="text-xs text-red-500">Daily limit reached. Resets at midnight.</p>
                    )}
                  </div>
                )
              })}
              
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className="text-xs text-gray-500">
                  Usage limits reset at midnight. These limits help ensure fair usage and prevent abuse.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Session Warning Modal Component
export const SessionWarningModal: React.FC<{ 
  theme: 'light' | 'dark'
  onExtend: () => void
}> = ({ theme, onExtend }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const handleSessionWarning = (event: CustomEvent) => {
      setTimeLeft(event.detail.timeRemaining)
      setIsVisible(true)
    }

    const handleSessionEnded = () => {
      setIsVisible(false)
    }

    window.addEventListener('sessionWarning', handleSessionWarning as EventListener)
    window.addEventListener('sessionEnded', handleSessionEnded)

    return () => {
      window.removeEventListener('sessionWarning', handleSessionWarning as EventListener)
      window.removeEventListener('sessionEnded', handleSessionEnded)
    }
  }, [])

  useEffect(() => {
    if (isVisible && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            setIsVisible(false)
            return 0
          }
          return prev - 1000
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isVisible, timeLeft])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-96 rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
      }`}>
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Session Ending Soon</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your study session will end in {formatTime(timeLeft)}. 
            To continue learning, please start a new session.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsVisible(false)
                onExtend()
              }}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Start New Session
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Continue for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Session Ended Modal Component
export const SessionEndedModal: React.FC<{ 
  theme: 'light' | 'dark'
  onRestart: () => void
}> = ({ theme, onRestart }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [endReason, setEndReason] = useState<string>('')

  useEffect(() => {
    const handleSessionEnded = (event: CustomEvent) => {
      setEndReason(event.detail.reason)
      setIsVisible(true)
    }

    window.addEventListener('sessionEnded', handleSessionEnded as EventListener)

    return () => {
      window.removeEventListener('sessionEnded', handleSessionEnded as EventListener)
    }
  }, [])

  if (!isVisible) return null

  const getEndMessage = () => {
    switch (endReason) {
      case 'expired':
        return 'Your 45-minute study session has ended. Ready for another productive session?'
      case 'idle':
        return 'Your session ended due to inactivity. Take a break or start a fresh session!'
      case 'manual':
        return 'Session ended. Thanks for studying with us today!'
      default:
        return 'Your session has ended.'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-96 rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
      }`}>
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Session Complete</h3>
          <p className="text-sm text-gray-500 mb-6">
            {getEndMessage()}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsVisible(false)
                onRestart()
              }}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Start New Session
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className={`w-full px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Browse Without Session
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}