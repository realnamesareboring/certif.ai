// 🎯 IDEAL MAIN PAGE.TSX STRUCTURE (200-300 lines max)

'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { 
  getWelcomeBackMessage,
  getCertificationWelcomeMessage 
} from '../lib/utils/message-utils'
import type { UserProfile, ChatMessage, Theme } from '../types'

// Component imports - all the extracted components
import OnboardingComponent from '../components/OnboardingComponent'
import ChatInterface from '../components/ChatInterface'
import QuizInterface from '../components/QuizInterface' 
import TabNavigation from '../components/TabNavigation'
import SmartSuggestionBanner from '../components/SmartSuggestionBanner'
import RoadmapComponent from '../components/RoadmapComponent'

export default function EnhancedPersonalizedCoach() {
  // 🏗️ GLOBAL STATE MANAGEMENT
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [theme, setTheme] = useState<Theme>('light')
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'roadmap'>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [suggestedCertification, setSuggestedCertification] = useState<string>('')

  // 🎨 THEME MANAGEMENT
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  // 👤 USER PROFILE MANAGEMENT  
  const resetProfile = () => {
    localStorage.removeItem('userProfile')
    setUserProfile(null)
    setMessages([])
    setIsOnboarding(true)
  }

  // 📱 TAB SWITCHING LOGIC
  const handleTabSwitch = async (tab: 'chat' | 'quiz' | 'roadmap') => {
    // Smart suggestion logic could go here
    setActiveTab(tab)
  }

  // 🚀 INITIAL SETUP
  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as Theme || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    
    // Load saved profile
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      if (profile.isOnboarded) {
        setMessages([{
          role: 'assistant',
          content: getWelcomeBackMessage(profile)
        }])
      }
    } else {
      setIsOnboarding(true)
    }
  }, [])

  // 🎉 ONBOARDING COMPLETION
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setIsOnboarding(false)
    setMessages([{
      role: 'assistant',
      content: getCertificationWelcomeMessage(profile, profile.certificationContent)
    }])
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      
      {/* 🎨 Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
              : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
          }`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* 🎓 ONBOARDING FLOW */}
        {isOnboarding && (
          <OnboardingComponent
            theme={theme}
            onComplete={handleOnboardingComplete}
            onThemeToggle={toggleTheme}
          />
        )}

        {/* 🏠 MAIN INTERFACE */}
        {userProfile?.isOnboarded && (
          <div className="space-y-6">
            
            {/* 💡 Smart Suggestion Banner */}
            <SmartSuggestionBanner
              theme={theme}
              suggestedCertification={suggestedCertification}
              activeTab={activeTab}
            />

            {/* 📑 Tab Navigation */}
            <TabNavigation
              theme={theme}
              activeTab={activeTab}
              onTabSwitch={handleTabSwitch}
            />

            {/* 💬 Chat Interface */}
            {activeTab === 'chat' && (
              <ChatInterface
                theme={theme}
                userProfile={userProfile}
                messages={messages}
                onMessagesUpdate={setMessages}
              />
            )}

            {/* 🧠 Quiz Interface */}
            {activeTab === 'quiz' && (
              <QuizInterface
                theme={theme}
                userProfile={userProfile}
                onQuizComplete={(session) => {
                  console.log('Quiz completed:', session)
                }}
              />
            )}

            {/* 🗺️ Roadmap Interface */}
            {activeTab === 'roadmap' && (
              <RoadmapComponent
                theme={theme}
                userProfile={userProfile}
              />
            )}

            {/* 🔄 Reset Profile Button */}
            {userProfile?.isOnboarded && (
              <div className="text-center mt-8">
                <button
                  onClick={resetProfile}
                  className={`text-sm px-4 py-2 rounded transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Reset Learning Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}