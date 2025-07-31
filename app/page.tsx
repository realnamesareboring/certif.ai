'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, BookOpen, Target, Trophy, Brain, User, MessageSquare, FileText, Sun, Moon, ExternalLink, DollarSign, Clock, Award } from 'lucide-react'
import { MULTI_CLOUD_CERTIFICATIONS_2025, getCertificationsByProvider, type Certification } from '../lib/certifications'
import { startNewSession, canSendMessage, recordMessage, canGenerateQuiz, recordQuiz } from '../lib/sessionManager'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface UserProfile {
  name: string
  communicationStyle: {
    tone: 'casual' | 'formal' | 'mixed'
    complexity: 'simple' | 'detailed' | 'technical'
    explanationStyle: 'examples' | 'step-by-step' | 'analogies' | 'direct'
    learningPreference: 'visual' | 'conversational' | 'structured'
  }
  rawText: string
  isOnboarded: boolean
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  domain: string
}

interface QuizSession {
  certification: string
  domain: string
  questions: QuizQuestion[]
  currentQuestion: number
  answers: (number | null)[]
  score: number
  completed: boolean
}

interface CertificationDomain {
  name: string
  weight: string
  description: string
}

interface Certification {
  id: string
  name: string
  fullName: string
  domains: CertificationDomain[]
  color: string
}

// Expanded certification database
const CERTIFICATIONS: Record<string, Certification> = {
  'AZ-900': {
    id: 'AZ-900',
    name: 'AZ-900',
    fullName: 'Microsoft Azure Fundamentals',
    color: 'blue',
    domains: [
      {
        name: "Cloud Concepts",
        weight: "25-30%",
        description: "Cloud benefits, service types, and deployment models"
      },
      {
        name: "Core Azure Services", 
        weight: "25-30%",
        description: "Azure architecture, compute, networking, storage, databases"
      },
      {
        name: "Security and Compliance",
        weight: "25-30%", 
        description: "Azure security features, governance, privacy, compliance"
      },
      {
        name: "Azure Pricing and Support",
        weight: "20-25%",
        description: "Subscriptions, pricing, support options, SLAs"
      }
    ]
  },
  'SC-200': {
    id: 'SC-200',
    name: 'SC-200',
    fullName: 'Microsoft Security Operations Analyst',
    color: 'red',
    domains: [
      {
        name: "Mitigate threats using Microsoft Defender XDR",
        weight: "25-30%",
        description: "Threat detection, investigation, and response"
      },
      {
        name: "Mitigate threats using Microsoft Defender for Cloud",
        weight: "25-30%",
        description: "Cloud security posture management and workload protection"
      },
      {
        name: "Mitigate threats using Microsoft Sentinel",
        weight: "40-45%",
        description: "SIEM operations, threat hunting, and incident response"
      }
    ]
  },
  'AWS-SAA': {
    id: 'AWS-SAA',
    name: 'AWS-SAA',
    fullName: 'AWS Solutions Architect Associate',
    color: 'orange',
    domains: [
      {
        name: "Design Resilient Architectures",
        weight: "26%",
        description: "Multi-tier architectures, disaster recovery, and scalability"
      },
      {
        name: "Design High-Performing Architectures",
        weight: "24%",
        description: "Storage, databases, networking, and compute solutions"
      },
      {
        name: "Design Secure Applications",
        weight: "30%",
        description: "Identity management, data protection, and infrastructure security"
      },
      {
        name: "Design Cost-Optimized Architectures",
        weight: "20%",
        description: "Cost-effective storage, compute, and monitoring solutions"
      }
    ]
  },
  'GCP-CDL': {
    id: 'GCP-CDL',
    name: 'GCP-CDL',
    fullName: 'Google Cloud Digital Leader',
    color: 'green',
    domains: [
      {
        name: "Digital Transformation with Google Cloud",
        weight: "~10%",
        description: "Cloud adoption, innovation, and business transformation"
      },
      {
        name: "Innovating with Data and Google Cloud",
        weight: "~30%",
        description: "Data lifecycle, analytics, and ML/AI solutions"
      },
      {
        name: "Infrastructure and Application Modernization",
        weight: "~30%",
        description: "Compute, containers, applications, and API management"
      },
      {
        name: "Understanding Google Cloud Security",
        weight: "~30%",
        description: "Shared responsibility, compliance, and security controls"
      }
    ]
  }
}

export default function EnhancedPersonalizedCoach() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [textSample, setTextSample] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCertification, setSelectedCertification] = useState<string>('')
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'All' | 'Microsoft' | 'AWS' | 'GCP'>('All')
  const [hoveredCert, setHoveredCert] = useState<string | null>(null)
  const [suggestedCertification, setSuggestedCertification] = useState<string>('')
  const [sessionStatus, setSessionStatus] = useState('🔴 None')  // ADD THIS
  const [timeLeft, setTimeLeft] = useState(0)

    // ADD THIS useEffect HERE (after state, before helper functions):
useEffect(() => {
  const checkSession = () => {
    const session = localStorage.getItem('currentSession')
    if (session) {
      const { startTime } = JSON.parse(session)
      const elapsed = Date.now() - startTime
      const remaining = (45 * 60 * 1000) - elapsed // 45 minutes
      setTimeLeft(Math.max(0, remaining))
      setSessionStatus('🟢 Active')
    } else {
      setSessionStatus('🔴 None')
      setTimeLeft(0)
    }
  }
  checkSession()
  
  const interval = setInterval(checkSession, 1000)
  return () => clearInterval(interval)
}, [])

  const getFilteredCertifications = () => {
    const certs = Object.values(MULTI_CLOUD_CERTIFICATIONS_2025)
    if (selectedProvider === 'All') return certs
    return certs.filter(cert => cert.provider === selectedProvider)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'Microsoft': return 'M'
      case 'AWS': return 'A'  
      case 'GCP': return 'G'
      default: return '?'
    }
  }

  const getColorClasses = (color: string, theme: string) => {
    const colorMap = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
        border: 'border-blue-200',
        text: theme === 'dark' ? 'text-blue-300' : 'text-blue-700',
        icon: 'bg-blue-500'
      },
      red: {
        bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
        border: 'border-red-200',
        text: theme === 'dark' ? 'text-red-300' : 'text-red-700',
        icon: 'bg-red-500'
      },
      orange: {
        bg: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50',
        border: 'border-orange-200',
        text: theme === 'dark' ? 'text-orange-300' : 'text-orange-700',
        icon: 'bg-orange-500'
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
        border: 'border-green-200',
        text: theme === 'dark' ? 'text-green-300' : 'text-green-700',
        icon: 'bg-green-500'
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50',
        border: 'border-purple-200',
        text: theme === 'dark' ? 'text-purple-300' : 'text-purple-700',
        icon: 'bg-purple-500'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  // Load user profile and theme on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light'
    
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    
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

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  // Analyze conversation context for smart quiz suggestions using AI
  const analyzeConversationContext = async (messages: Message[]): Promise<string> => {
    try {
      const response = await fetch('/api/analyze-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })

      if (!response.ok) throw new Error('Context analysis failed')
      const result = await response.json()
      
      console.log('Context analysis result:', result)
      return result.suggestedCertification || 'AZ-900'
      
    } catch (error) {
      console.error('Context analysis error:', error)
      
      // Fallback to simple keyword matching
      const conversationText = messages
        .map(msg => msg.content)
        .join(' ')
        .toLowerCase()

      const certificationKeywords = {
        'SC-200': ['security', 'sentinel', 'defender', 'xdr', 'threat', 'incident', 'soc'],
        'AWS-SAA': ['aws', 'ec2', 's3', 'lambda', 'solutions architect', 'amazon web services'],
        'GCP-CDL': ['gcp', 'google cloud', 'bigquery', 'compute engine', 'digital leader'],
        'AZ-900': ['azure', 'az-900', 'azure fundamentals', 'cloud fundamentals']
      }

      let bestMatch = 'AZ-900'
      let maxMatches = 0

      Object.entries(certificationKeywords).forEach(([cert, keywords]) => {
        const matches = keywords.reduce((count, keyword) => {
          return count + (conversationText.includes(keyword) ? 1 : 0)
        }, 0)
        
        if (matches > maxMatches) {
          maxMatches = matches
          bestMatch = cert
        }
      })

      return bestMatch
    }
  }

  // Handle tab switch with smart quiz detection
  const handleTabSwitch = async (tab: 'chat' | 'quiz') => {
    if (tab === 'quiz' && messages.length > 0) {
      const suggested = await analyzeConversationContext(messages)
      setSuggestedCertification(suggested)
      setSelectedCertification(suggested)
    }
    setActiveTab(tab)
  }

  const analyzeStyle = async () => {
    if (!textSample.trim() || textSample.length < 15) {
      alert('Please provide at least 15 characters of your natural writing.')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textSample }),
      })

      if (!response.ok) throw new Error('Analysis failed')
      const result = await response.json()

      const profile: UserProfile = {
        name: 'User',
        communicationStyle: result.style,
        rawText: textSample,
        isOnboarded: true
      }

      setUserProfile(profile)
      localStorage.setItem('userProfile', JSON.stringify(profile))
      setIsOnboarding(false)

      setMessages([{
        role: 'assistant',
        content: getCompletionMessage(profile)
      }])

      // ADD THIS LINE - Initialize session after onboarding
      initializeSession()

    } finally {
      setIsAnalyzing(false)
    }
  }

  const getWelcomeBackMessage = (profile: UserProfile) => {
    if (profile.communicationStyle.tone === 'casual') {
      return `Yo ${profile.name}! Welcome back! 🚀\n\nI remember ur style - keeping it ${profile.communicationStyle.tone} and ${profile.communicationStyle.complexity}. Ready to crush some more certs?`
    } else if (profile.communicationStyle.tone === 'formal') {
      return `Welcome back, ${profile.name}.\n\nI have your communication preferences configured for ${profile.communicationStyle.tone} tone with ${profile.communicationStyle.complexity} explanations.\n\nHow may I assist with your certification studies today?`
    } else {
      return `Hey ${profile.name}! Good to see you again!\n\nI've got your style preferences saved - ${profile.communicationStyle.tone} tone with ${profile.communicationStyle.explanationStyle}-focused learning.\n\nWhat certification are we tackling today?`
    }
  }

  const getCompletionMessage = (profile: UserProfile) => {
    const style = profile.communicationStyle
    
    if (style.tone === 'casual') {
      return `Awesome ${profile.name}! 🎯\n\nI can tell you're pretty ${style.tone} and like ${style.complexity} explanations with lots of ${style.explanationStyle}.\n\nI'm gonna match your vibe from now on - no boring formal stuff! Ready to crush some cloud certs? I can help with:\n\n• AI coaching (ask me anything!)\n• Practice quizzes (I'll generate fresh questions)\n\nWhat sounds good?`
    } else if (style.tone === 'formal') {
      return `Excellent, ${profile.name}.\n\nI have analyzed your communication style:\n\n• Tone: Professional and ${style.tone}\n• Complexity: ${style.complexity} explanations\n• Learning: ${style.explanationStyle}-based instruction\n• Format: ${style.learningPreference} presentation\n\nI will adapt all responses accordingly. Please select your preferred study method:\n\n1. AI Coaching Sessions\n2. Practice Quiz Generation\n\nHow would you like to proceed?`
    } else {
      return `Perfect ${profile.name}!\n\nI've learned your style - you like ${style.complexity} explanations delivered through ${style.explanationStyle}. I'll keep things ${style.tone} but informative.\n\nReady to start? I can help with:\n\n→ AI coaching and explanations\n→ Custom practice quizzes\n\nWhat interests you most?`
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          userProfile: userProfile?.communicationStyle 
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')
      const data = await response.json()
      
      const aiMessage: Message = { role: 'assistant', content: data.message }
      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { 
        role: 'assistant', 
        content: userProfile?.communicationStyle?.tone === 'casual' 
          ? 'Oops! Something went wrong. Try again?' 
          : 'I apologize, but I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateQuiz = async (certification: string, domain: string) => {
    setQuizLoading(true)
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          certification,
          domain,
          questionCount: 10,
          userProfile: userProfile?.communicationStyle
        }),
      })

      if (!response.ok) throw new Error('Failed to generate quiz')
      const data = await response.json()
      
      setQuizSession({
        certification,
        domain,
        questions: data.questions,
        currentQuestion: 0,
        answers: new Array(data.questions.length).fill(null),
        score: 0,
        completed: false
      })

    } catch (error) {
      console.error('Quiz generation error:', error)
    } finally {
      setQuizLoading(false)
    }
  }

  const answerQuestion = (answerIndex: number) => {
    if (!quizSession) return

    const newAnswers = [...quizSession.answers]
    newAnswers[quizSession.currentQuestion] = answerIndex
    
    setQuizSession({
      ...quizSession,
      answers: newAnswers
    })
  }

  const nextQuestion = () => {
    if (!quizSession) return

    if (quizSession.currentQuestion < quizSession.questions.length - 1) {
      setQuizSession({
        ...quizSession,
        currentQuestion: quizSession.currentQuestion + 1
      })
    } else {
      const correctAnswers = quizSession.answers.reduce((score, answer, index) => {
        return answer === quizSession.questions[index].correct ? score + 1 : score
      }, 0)

      setQuizSession({
        ...quizSession,
        score: correctAnswers,
        completed: true
      })
    }
  }

  const resetQuiz = () => {
    setQuizSession(null)
    setSelectedCertification('')
    setSelectedDomain('')
    setActiveTab('chat')
  }

  const resetProfile = () => {
    localStorage.removeItem('userProfile')
    setUserProfile(null)
    setIsOnboarding(true)
    setMessages([])
    setActiveTab('chat')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Format message content with proper line breaks and structure
  const formatMessage = (content: string) => {
    const lines = content.split(/\n|\r\n|\r/)
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim()
      
      if (!trimmedLine) {
        return <br key={index} />
      }
      
      if (/^[A-D]\)/.test(trimmedLine)) {
        return (
          <div key={index} className="ml-4 my-1 font-medium">
            {trimmedLine}
          </div>
        )
      }
      
      return (
        <div key={index} className="mb-2">
          {trimmedLine}
        </div>
      )
    })
  }

  const getCertificationColor = (certId: string) => {
    const colors = {
      'AZ-900': 'blue',
      'SC-200': 'red', 
      'AWS-SAA': 'orange',
      'GCP-CDL': 'green'
    }
    return colors[certId as keyof typeof colors] || 'blue'
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              🎯 AI Study Coach
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Personalized certification training that adapts to your learning style
            </p>
              <div className="text-xs text-gray-500">
                Session: {sessionStatus}
                {timeLeft > 0 && ` • ${Math.floor(timeLeft/60000)}:${String(Math.floor((timeLeft%60000)/1000)).padStart(2,'0')}`}
            </div>
          </div>
          
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
            }`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        {/* Onboarding Flow */}
        {isOnboarding && (
          <div className={`max-w-2xl mx-auto rounded-lg shadow-lg p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center mb-8">
              <User className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Let's Personalize Your Learning Experience
              </h2>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Paste a sample of your natural writing (email, message, etc.) so I can adapt to your communication style:
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={textSample}
                onChange={(e) => setTextSample(e.target.value)}
                placeholder="Paste any text you've written naturally - an email, message, or note. This helps me understand how you communicate so I can match your style..."
                className={`w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows={4}
              />
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={analyzeStyle}
                  disabled={isAnalyzing || textSample.length < 15}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Analyzing Your Style...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze My Style
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        {userProfile?.isOnboarded && (
          <div className="space-y-6">
            {/* Smart Suggestion Banner */}
            {suggestedCertification && activeTab === 'quiz' && (
              <div className={`rounded-lg p-4 border-l-4 ${
                theme === 'dark' 
                  ? 'bg-blue-900/50 border-blue-400 text-blue-200' 
                  : 'bg-blue-50 border-blue-400 text-blue-800'
              }`}>
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    Smart Suggestion: Based on our conversation, I recommend starting with {CERTIFICATIONS[suggestedCertification]?.fullName}
                  </span>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex">
                <button
                  onClick={() => handleTabSwitch('chat')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'chat' 
                      ? (theme === 'dark' 
                          ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700' 
                          : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        )
                      : (theme === 'dark' 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-600 hover:text-blue-600'
                        )
                  }`}
                >
                  <Brain className="inline-block w-5 h-5 mr-2" />
                  AI Coaching
                </button>
                <button
                  onClick={() => handleTabSwitch('quiz')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'quiz' 
                      ? (theme === 'dark' 
                          ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700' 
                          : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        )
                      : (theme === 'dark' 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : 'text-gray-600 hover:text-blue-600'
                        )
                  }`}
                >
                  <Target className="inline-block w-5 h-5 mr-2" />
                  Practice Quiz
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            {activeTab === 'chat' && (
              <div className={`rounded-lg shadow-lg overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : (theme === 'dark' 
                                ? 'bg-gray-700 text-gray-200' 
                                : 'bg-gray-100 text-gray-800'
                              )
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {formatMessage(message.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className={`px-4 py-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="flex space-x-1 items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`border-t p-4 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex space-x-2">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        userProfile.communicationStyle.tone === 'casual' 
                          ? "Ask me anything about cloud stuff..."
                          : "Ask me about cloud certifications..."
                      }
                      className={`flex-1 border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      rows={2}
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Quiz Interface */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {!quizSession && (
                  <div className={`rounded-lg shadow-lg p-6 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <h2 className={`text-2xl font-bold mb-6 flex items-center ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                      Choose Your Certification
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {Object.entries(CERTIFICATIONS).map(([certId, cert]) => (
                        <div
                          key={certId}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedCertification === certId
                              ? `border-${cert.color}-500 ${
                                  theme === 'dark' 
                                    ? `bg-${cert.color}-900/20` 
                                    : `bg-${cert.color}-50`
                                }`
                              : (theme === 'dark' 
                                  ? 'border-gray-600 hover:border-gray-500' 
                                  : 'border-gray-200 hover:border-blue-300'
                                )
                          }`}
                          onClick={() => setSelectedCertification(certId)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-bold text-lg ${
                              theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {cert.name}
                            </h3>
                            {suggestedCertification === certId && (
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Suggested
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {cert.fullName}
                          </p>
                        </div>
                      ))}
                    </div>

                    {selectedCertification && (
                      <div className="space-y-4">
                        <h3 className={`text-lg font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          Select Domain for {CERTIFICATIONS[selectedCertification]?.name}
                        </h3>
                        
                        <div className="grid gap-3">
                          {CERTIFICATIONS[selectedCertification]?.domains.map((domain, index) => (
                            <div
                              key={index}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                selectedDomain === domain.name
                                  ? (theme === 'dark' 
                                      ? 'border-blue-400 bg-blue-900/20' 
                                      : 'border-blue-500 bg-blue-50'
                                    )
                                  : (theme === 'dark' 
                                      ? 'border-gray-600 hover:border-gray-500' 
                                      : 'border-gray-200 hover:border-blue-300'
                                    )
                              }`}
                              onClick={() => setSelectedDomain(domain.name)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className={`font-medium ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                                  }`}>
                                    {domain.name}
                                  </h4>
                                  <p className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    {domain.description}
                                  </p>
                                </div>
                                <span className={`text-sm font-medium ml-4 ${
                                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                }`}>
                                  {domain.weight}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {selectedDomain && (
                          <div className="text-center pt-4">
                            <button
                              onClick={() => generateQuiz(selectedCertification, selectedDomain)}
                              disabled={quizLoading}
                              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors flex items-center mx-auto"
                            >
                              {quizLoading ? (
                                <>
                                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                  Generating Quiz...
                                </>
                              ) : (
                                <>
                                  <Target className="w-5 h-5 mr-2" />
                                  Generate Practice Quiz
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz Session Display */}
                {quizSession && !quizSession.completed && (
                  <div className={`rounded-lg shadow-lg p-6 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {quizSession.certification} - {quizSession.domain}
                      </h2>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Question {quizSession.currentQuestion + 1} of {quizSession.questions.length}
                      </span>
                    </div>

                    <div className="mb-6">
                      <div className={`w-full bg-gray-200 rounded-full h-2 mb-4 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${((quizSession.currentQuestion + 1) / quizSession.questions.length) * 100}%` 
                          }}
                        ></div>
                      </div>

                      <div className="space-y-4">
                        <h3 className={`text-lg font-medium leading-relaxed ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {quizSession.questions[quizSession.currentQuestion]?.question}
                        </h3>

                        <div className="space-y-2">
                          {quizSession.questions[quizSession.currentQuestion]?.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => answerQuestion(index)}
                              className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                                quizSession.answers[quizSession.currentQuestion] === index
                                  ? (theme === 'dark' 
                                      ? 'border-blue-400 bg-blue-900/20' 
                                      : 'border-blue-500 bg-blue-50'
                                    )
                                  : (theme === 'dark' 
                                      ? 'border-gray-600 hover:border-gray-500' 
                                      : 'border-gray-200 hover:border-blue-300'
                                    )
                              }`}
                            >
                              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <button
                          onClick={resetQuiz}
                          className={`px-6 py-2 rounded-lg transition-colors ${
                            theme === 'dark' 
                              ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          }`}
                        >
                          Exit Quiz
                        </button>
                        
                        <button
                          onClick={nextQuestion}
                          disabled={quizSession.answers[quizSession.currentQuestion] === null}
                          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                        >
                          {quizSession.currentQuestion === quizSession.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quiz Results */}
                {quizSession && quizSession.completed && (
                  <div className={`rounded-lg shadow-lg p-6 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="text-center mb-6">
                      <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h2 className={`text-2xl font-bold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        Quiz Complete!
                      </h2>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {quizSession.score} / {quizSession.questions.length}
                      </div>
                      <div className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {Math.round((quizSession.score / quizSession.questions.length) * 100)}% Correct
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={resetQuiz}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
                      >
                        Start New Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Career Roadmap Section - Motivational */}
        {userProfile?.isOnboarded && (
          <div className={`mt-12 rounded-lg shadow-lg p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                🚀 Your Cloud Career Roadmap
              </h2>
              <p className={`text-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Master the most in-demand cloud certifications and accelerate your career
              </p>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className={`text-center p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
              }`}>
                <div className="text-2xl font-bold text-blue-600">25+</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Certifications Available
                </div>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
              }`}>
                <div className="text-2xl font-bold text-green-600">$200K+</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Top Salaries
                </div>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'
              }`}>
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Cloud Platforms
                </div>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'
              }`}>
                <div className="text-2xl font-bold text-orange-600">95%</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Job Market Growth
                </div>
              </div>
            </div>

            {/* Cloud Platforms */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Microsoft Azure */}
              <div className={`p-6 rounded-lg border-2 border-blue-200 ${
                theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                    M
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Microsoft Azure
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      7 key certifications
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • AZ-900: Fundamentals ($60K-$80K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • AZ-104: Administrator ($90K-$120K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • AZ-305: Architect ($140K-$180K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • SC-200: Security Analyst ($95K-$130K)
                  </div>
                </div>
                <a 
                  href="https://learn.microsoft.com/en-us/credentials/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Microsoft Learning Path →
                </a>
              </div>

              {/* AWS */}
              <div className={`p-6 rounded-lg border-2 border-orange-200 ${
                theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                    A
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Amazon AWS
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      8 core certifications
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • CLF-C02: Cloud Practitioner ($65K-$85K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • SAA-C03: Solutions Architect ($110K-$145K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • SAP-C02: Pro Architect ($150K-$200K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • MLS-C01: ML Specialty ($140K-$180K)
                  </div>
                </div>
                <a 
                  href="https://aws.amazon.com/certification/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                >
                  View AWS Certification Path →
                </a>
              </div>

              {/* Google Cloud */}
              <div className={`p-6 rounded-lg border-2 border-green-200 ${
                theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                    G
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Google Cloud
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      7 professional certs
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • CDL: Digital Leader ($65K-$85K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • ACE: Associate Engineer ($95K-$125K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • PCA: Pro Architect ($140K-$175K)
                  </div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    • PMLE: ML Engineer ($130K-$170K)
                  </div>
                </div>
                <a 
                  href="https://cloud.google.com/learn/certification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  View GCP Learning Path →
                </a>
              </div>
            </div>

            {/* Career Progression Path */}
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50'
            }`}>
              <h3 className={`text-xl font-bold mb-4 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                🎯 Recommended Career Path
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  1. Start: Fundamentals (AZ-900, CLF-C02, CDL)
                </div>
                <span className={`text-2xl ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`}>→</span>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  2. Build: Associate/Professional
                </div>
                <span className={`text-2xl ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`}>→</span>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  3. Specialize: Expert/Specialty
                </div>
                <span className={`text-2xl ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`}>→</span>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  theme === 'dark' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  4. Lead: Architecture/Strategy
                </div>
              </div>
            </div>

            {/* Interactive Certification Browser */}
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  🎯 Complete Certification Database
                </h3>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Explore all {Object.keys(MULTI_CLOUD_CERTIFICATIONS_2025).length} certifications across Microsoft, AWS & Google Cloud
                </p>
              </div>

              {/* Provider Filter */}
              <div className="flex justify-center mb-8">
                <div className={`inline-flex rounded-lg p-1 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {['All', 'Microsoft', 'AWS', 'GCP'].map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setSelectedProvider(provider as any)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedProvider === provider
                          ? (theme === 'dark' ? 'bg-white text-gray-900' : 'bg-white text-gray-900 shadow')
                          : (theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {getFilteredCertifications().map((cert) => {
                  const colors = getColorClasses(cert.color, theme)
                  const isHovered = hoveredCert === cert.id
                  
                  return (
                    <div
                      key={cert.id}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 transform ${
                        colors.bg
                      } ${colors.border} ${
                        isHovered ? 'scale-105 shadow-lg z-10' : 'hover:scale-102'
                      }`}
                      onMouseEnter={() => setHoveredCert(cert.id)}
                      onMouseLeave={() => setHoveredCert(null)}
                    >
                      {/* Basic Info */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3`}>
                            {getProviderIcon(cert.provider)}
                          </div>
                          <div>
                            <h4 className={`font-bold text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {cert.name}
                            </h4>
                            <p className={`text-xs ${colors.text}`}>
                              {cert.level}
                            </p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          cert.marketDemand === 'High' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cert.marketDemand}
                        </div>
                      </div>

                      <p className={`text-xs mb-3 line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {cert.description}
                      </p>

                      {/* Quick Stats */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`flex items-center ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <DollarSign className="w-3 h-3 mr-1" />
                            Salary
                          </span>
                          <span className={`font-medium ${colors.text}`}>
                            {cert.averageSalary}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`flex items-center ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Award className="w-3 h-3 mr-1" />
                            Cost
                          </span>
                          <span className={`font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {cert.examCost}
                          </span>
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      {isHovered && (
                        <div className={`absolute inset-0 p-4 rounded-lg ${colors.bg} border-2 ${colors.border} z-20`}>
                          <div className="h-full flex flex-col">
                            <h4 className={`font-bold text-sm mb-2 ${
                              theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>
                              {cert.fullName}
                            </h4>
                            
                            <div className="flex-1 space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className={`flex items-center ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Annual Salary
                                </span>
                                <span className={`font-bold ${colors.text}`}>
                                  {cert.averageSalary}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className={`flex items-center ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  <Award className="w-3 h-3 mr-1" />
                                  Exam Cost
                                </span>
                                <span className={`font-medium ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {cert.examCost}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className={`flex items-center ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Valid For
                                </span>
                                <span className={`font-medium ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {cert.validityPeriod}
                                </span>
                              </div>
                              
                              <div className={`pt-2 border-t ${
                                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                              }`}>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  {cert.description}
                                </p>
                              </div>
                            </div>
                            
                            <a
                              href={cert.officialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`mt-3 inline-flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${colors.icon} text-white hover:opacity-90`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Official Page
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Summary Statistics */}
              <div className={`p-4 rounded-lg text-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  💡 <strong>Currently showing {getFilteredCertifications().length} certifications</strong> 
                  {selectedProvider !== 'All' && ` from ${selectedProvider}`}
                  {' • '}Hover over any tile for detailed information and official links
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-lg ${
                  theme === 'dark' ? 'bg-green-900/30 border border-green-500' : 'bg-green-50 border border-green-200'
                }`}>
                  <Trophy className="w-5 h-5 text-green-600 mr-2" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-green-300' : 'text-green-700'
                  }`}>
                    Over 1.42 million active AWS certifications and growing across all platforms
                  </span>
                </div>
              </div>

              {/* Salary References */}
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  📊 Salary Data Sources & References:
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Microsoft & Multi-Cloud Salaries:
                    </div>
                    <a 
                      href="https://www.skillsoft.com/blog/top-paying-microsoft-certifications"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-words"
                    >
                      Skillsoft 2024 IT Skills & Salary Survey →
                    </a>
                  </div>
                  <div>
                    <div className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Google Cloud Platform Salaries:
                    </div>
                    <a 
                      href="https://bluelight.co/blog/top-google-cloud-platform-certification-courses"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-words"
                    >
                      Glassdoor GCP Salary Research →
                    </a>
                  </div>
                  <div>
                    <div className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      AWS Certification Impact:
                    </div>
                    <a 
                      href="https://k21academy.com/amazon-web-services/aws-cloud-certifications/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-words"
                    >
                      Global Knowledge Certification Study →
                    </a>
                  </div>
                  <div>
                    <div className={`font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Industry Market Analysis:
                    </div>
                    <a 
                      href="https://www.tealhq.com/certifications/aws"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-words"
                    >
                      TealHQ Certification Rankings →
                    </a>
                  </div>
                </div>
                <div className={`mt-3 text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  💡 Key Insight: <strong>80% of certified professionals report salary increases</strong> of $12K-$13K on average after certification
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-6">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Ready to advance your career? Start with our AI-powered personalized coaching and practice quizzes above! 🚀
              </p>
            </div>
          </div>
        )}

        {/* Reset Profile Button */}
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
    </div>
  )
}
// ==========================================
// 🛡️ APPEND THIS TO THE BOTTOM OF YOUR page.tsx
// (Before the final closing brace and export)
// ==========================================

// 1. ADD THE IMPORT AT THE TOP (just add this one line to your existing imports)
// import { startNewSession, canSendMessage, recordMessage, canGenerateQuiz, recordQuiz } from '../lib/sessionManager'

// 2. APPEND THESE FUNCTIONS TO THE BOTTOM (before the final return statement)

// 🛡️ Protected wrapper for your existing sendMessage function
const sendMessageProtected = async () => {
  if (!input.trim()) return

  // Check session limits first
  const messageCheck = canSendMessage()
  if (!messageCheck.allowed) {
    alert(messageCheck.reason)
    return
  }

  // Call your existing sendMessage logic
  const userMessage: Message = { role: 'user', content: input }
  const newMessages = [...messages, userMessage]
  setMessages(newMessages)
  setInput('')
  setIsLoading(true)

  try {
    // Record the message for tracking
    recordMessage()
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        messages: newMessages,
        userProfile: userProfile?.communicationStyle 
      }),
    })

    if (!response.ok) throw new Error('Failed to get response')
    const data = await response.json()
    
    const aiMessage: Message = { role: 'assistant', content: data.message }
    setMessages(prev => [...prev, aiMessage])

  } catch (error) {
    console.error('Error:', error)
    const errorMessage: Message = { 
      role: 'assistant', 
      content: userProfile?.communicationStyle?.tone === 'casual' 
        ? 'Oops! Something went wrong. Try again?' 
        : 'I apologize, but I encountered an error. Please try again.'
    }
    setMessages(prev => [...prev, errorMessage])
  } finally {
    setIsLoading(false)
  }
}

// 🛡️ Protected wrapper for your existing generateQuiz function  
const generateQuizProtected = async (certification: string, domain: string) => {
  // Check quiz limits first
  const quizCheck = canGenerateQuiz()
  if (!quizCheck.allowed) {
    alert(quizCheck.reason)
    return
  }

  setQuizLoading(true)
  try {
    // Record the quiz for tracking
    recordQuiz()
    
    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        certification,
        domain,
        questionCount: 10,
        userProfile: userProfile?.communicationStyle
      }),
    })

    if (!response.ok) throw new Error('Failed to generate quiz')
    const data = await response.json()
    
    setQuizSession({
      certification,
      domain,
      questions: data.questions,
      currentQuestion: 0,
      answers: new Array(data.questions.length).fill(null),
      score: 0,
      completed: false
    })

  } catch (error) {
    console.error('Quiz generation error:', error)
  } finally {
    setQuizLoading(false)
  }
}

// 🛡️ Initialize session (add this to your existing useEffect or call it separately)
const initializeSession = () => {
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

// 🛡️ Test functions (you can call these from browser console to test)
const testSessionLimits = () => {
  console.log('Message check:', canSendMessage())
  console.log('Quiz check:', canGenerateQuiz())
}

// ==========================================
// 🧪 TESTING INSTRUCTIONS:
// ==========================================
// 
// 1. Add the import line to your imports
// 2. Append everything above to the bottom of your component (before the return)
// 3. Test by calling these in browser console:
//    - testSessionLimits() 
//    - initializeSession()
// 
// 4. OPTIONAL: Replace your existing function calls:
//    - Change onClick={sendMessage} to onClick={sendMessageProtected}
//    - Change generateQuiz(cert, domain) to generateQuizProtected(cert, domain)
// 
// 5. If something breaks, just remove this appended code!
//
// ==========================================
// 📝 INTEGRATION STEPS (when ready):
// ==========================================
//
// STEP A: Add this one line to your existing useEffect:
// if (profile.isOnboarded) {
//   setMessages([{
//     role: 'assistant', 
//     content: getWelcomeBackMessage(profile)
//   }])
//   initializeSession() // ADD THIS LINE
// }
//
// STEP B: Replace your send button:
// <button onClick={sendMessage}>  →  <button onClick={sendMessageProtected}>
//
// STEP C: Replace your quiz button:  
// onClick={() => generateQuiz(cert, domain)}  →  onClick={() => generateQuizProtected(cert, domain)}
//
// ==========================================