import React, { useState } from 'react'
import { ChevronRight, User, Target, Brain, Award, Sun, Moon } from 'lucide-react'
import { MULTI_CLOUD_CERTIFICATIONS_2025 } from '../lib/certifications'
import type { UserProfile, Theme } from '../types'
import { getColorClasses, getProviderIcon } from '../lib/utils/ui-utils'
import { getCertificationWelcomeMessage } from '../lib/utils/message-utils'
import { loadCertificationContentAPI } from '../lib/utils/api-utils'

interface OnboardingProps {
  theme: Theme
  onComplete: (profile: UserProfile) => void
  onThemeToggle: () => void
}

const OnboardingComponent: React.FC<OnboardingProps> = ({ 
  theme, 
  onComplete, 
  onThemeToggle 
}) => {
  // State management
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [textSample, setTextSample] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedCertification, setSelectedCertification] = useState('AZ-900')
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({})

  // Step 1: Analyze communication style
  const analyzeStyleAndContinue = async () => {
    if (!textSample || textSample.length < 15) return

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textSample }),
      })

      if (!response.ok) throw new Error('Analysis failed')
      const result = await response.json()

      // Store the communication style temporarily
      setUserProfile(prev => ({
        ...prev,
        communicationStyle: result.style,
        rawText: textSample
      }))

      // Move to certification selection
      setOnboardingStep(2)
      
    } catch (error) {
      console.error('Style analysis failed:', error)
      // Still continue to cert selection with defaults
      setOnboardingStep(2)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Step 3: Finalize certification choice
  const finalizeCertificationChoice = async () => {
    setOnboardingStep(3)
    
    try {
      // Use existing API utility instead of duplicate fetch
      console.log(`🔄 Loading content for ${selectedCertification}...`)
      
      const result = await loadCertificationContentAPI(selectedCertification)
      console.log('✅ Content loaded successfully')

      // Complete onboarding with certification-specific profile + official content
      const finalProfile: UserProfile = {
        name: 'User',
        targetCertification: selectedCertification,
        certificationContent: result.content,
        communicationStyle: userProfile?.communicationStyle || {
          tone: 'mixed',
          complexity: 'detailed',
          explanationStyle: 'examples',
          learningPreference: 'conversational'
        },
        rawText: textSample,
        isOnboarded: true
      }

      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(finalProfile))

      // Call parent completion handler
      onComplete(finalProfile)

    } catch (error) {
      console.error('❌ Content loading failed:', error)
      
      // Still complete onboarding but without official content
      const fallbackProfile: UserProfile = {
        name: 'User',
        targetCertification: selectedCertification,
        communicationStyle: userProfile?.communicationStyle || {
          tone: 'mixed',
          complexity: 'detailed',
          explanationStyle: 'examples',
          learningPreference: 'conversational'
        },
        rawText: textSample,
        isOnboarded: true
      }

      localStorage.setItem('userProfile', JSON.stringify(fallbackProfile))
      onComplete(fallbackProfile)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onThemeToggle}
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Enhanced Onboarding Flow */}
        <div className={`max-w-2xl mx-auto rounded-lg shadow-lg p-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                onboardingStep >= 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>1</div>
              <div className={`w-16 h-1 ${onboardingStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                onboardingStep >= 2 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>2</div>
              <div className={`w-16 h-1 ${onboardingStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                onboardingStep >= 3 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>3</div>
            </div>
          </div>

          {/* Step 1: Communication Style Analysis */}
          {onboardingStep === 1 && (
            <>
              <div className="text-center mb-8">
                <User className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h2 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Let's Personalize Your Learning
                </h2>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Paste a sample of your natural writing so I can adapt to your communication style:
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={textSample}
                  onChange={(e) => setTextSample(e.target.value)}
                  placeholder="Paste any text you've written naturally - an email, message, or note..."
                  className={`w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                
                <button
                  onClick={analyzeStyleAndContinue}
                  disabled={!textSample || textSample.length < 15 || isAnalyzing}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    !textSample || textSample.length < 15 || isAnalyzing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing your style...
                    </div>
                  ) : (
                    'Analyze My Style'
                  )}
                </button>

                <p className={`text-xs text-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Need at least 15 characters for accurate analysis
                </p>
              </div>
            </>
          )}

          {/* Step 2: Certification Selection */}
          {onboardingStep === 2 && (
            <>
              <div className="text-center mb-8">
                <Target className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h2 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Choose Your Target Certification
                </h2>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Select the certification you want to focus on. I'll load the official curriculum and adapt to your learning style.
                </p>
              </div>

              <div className="grid gap-4 mb-6">
                {Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).slice(0, 8).map((cert) => {
                  const colors = getColorClasses(cert.color, theme)
                  const isSelected = selectedCertification === cert.id
                  
                  return (
                    <button
                      key={cert.id}
                      onClick={() => setSelectedCertification(cert.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? `${colors.bg} ${colors.border} ring-2 ring-blue-500`
                          : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-4 ${colors.icon}`}>
                          {getProviderIcon(cert.provider)}
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold ${colors.text}`}>
                            {cert.name}
                          </div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {cert.fullName}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {cert.provider} • {cert.level} Level
                          </div>
                        </div>
                        {isSelected && (
                          <div className="text-blue-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={finalizeCertificationChoice}
                className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Start Learning {selectedCertification}
              </button>
            </>
          )}

          {/* Step 3: Loading & Completion */}
          {onboardingStep === 3 && (
            <div className="text-center">
              <Brain className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Setting Up Your Study Experience
              </h2>
              <div className="flex items-center justify-center mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                  Loading official {selectedCertification} curriculum...
                </span>
              </div>
              
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="mb-2">✓ Analyzing your communication style</p>
                <p className="mb-2">✓ Loading certification requirements</p>
                <p className="mb-2">✓ Customizing learning experience</p>
                <p className="opacity-50">✓ Preparing your AI coach...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingComponent