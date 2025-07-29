'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, BookOpen, Target, Trophy, Brain, User, MessageSquare, FileText } from 'lucide-react'

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
  domain: string
  questions: QuizQuestion[]
  currentQuestion: number
  answers: (number | null)[]
  score: number
  completed: boolean
}

const AZ900_DOMAINS = [
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

export default function ImprovedPersonalizedCoach() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [textSample, setTextSample] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [quizLoading, setQuizLoading] = useState(false)

  // Load user profile on component mount
  useEffect(() => {
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
      // Show onboarding
      setIsOnboarding(true)
    }
  }, [])

  const getWelcomeBackMessage = (profile: UserProfile) => {
    if (profile.communicationStyle.tone === 'casual') {
      return `Yo ${profile.name}! Welcome back! 🚀\n\nI remember ur style - keeping it ${profile.communicationStyle.tone} and ${profile.communicationStyle.complexity}. Ready to crush some more cloud cert stuff?`
    } else if (profile.communicationStyle.tone === 'formal') {
      return `Welcome back, ${profile.name}.\n\nI have your learning preferences configured for ${profile.communicationStyle.complexity} explanations with ${profile.communicationStyle.explanationStyle}-based instruction. How may I assist you today?`
    } else {
      return `Hey ${profile.name}! Good to see you back.\n\nI've got your learning style saved - ${profile.communicationStyle.complexity} explanations with ${profile.communicationStyle.explanationStyle} approach. What would you like to work on?`
    }
  }

  const analyzeTextSample = async (textSample: string) => {
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textSample }),
      })

      if (!response.ok) throw new Error('Analysis failed')
      const data = await response.json()
      
      // Extract name from text (simple approach)
      const words = textSample.split(' ')
      const firstName = words.find(word => 
        word.length > 2 && /^[A-Z][a-z]+$/.test(word) && 
        !['The', 'And', 'But', 'For', 'With'].includes(word)
      ) || 'there'

      const profile: UserProfile = {
        name: firstName,
        communicationStyle: data.style,
        rawText: textSample,
        isOnboarded: true
      }

      setUserProfile(profile)
      localStorage.setItem('userProfile', JSON.stringify(profile))
      setIsOnboarding(false)

      // Add personalized completion message
      const completionMessage = getCompletionMessage(profile)
      setMessages([{
        role: 'assistant',
        content: completionMessage
      }])

    } catch (error) {
      console.error('Analysis error:', error)
      // Create fallback profile
      const fallbackProfile: UserProfile = {
        name: 'there',
        communicationStyle: {
          tone: 'casual',
          complexity: 'simple',
          explanationStyle: 'examples',
          learningPreference: 'conversational'
        },
        rawText: textSample,
        isOnboarded: true
      }
      
      setUserProfile(fallbackProfile)
      localStorage.setItem('userProfile', JSON.stringify(fallbackProfile))
      setIsOnboarding(false)
      setMessages([{
        role: 'assistant',
        content: "Cool! I've got a sense of your style. Let's start learning some cloud stuff! What certification are you working on?"
      }])
    } finally {
      setIsAnalyzing(false)
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
        content: 'Sorry, I ran into an issue. Try again?' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateQuiz = async (domain: string) => {
    setQuizLoading(true)
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          certification: 'AZ-900',
          domain: domain,
          questionCount: 10,
          userProfile: userProfile?.communicationStyle
        }),
      })

      if (!response.ok) throw new Error('Failed to generate quiz')
      const data = await response.json()
      
      setQuizSession({
        domain,
        questions: data.questions,
        currentQuestion: 0,
        answers: new Array(data.questions.length).fill(null),
        score: 0,
        completed: false
      })
      setActiveTab('quiz')

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
    // Handle both \n characters and actual newlines
    const lines = content.split(/\n|\r\n|\r/)
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim()
      
      // Skip empty lines but add spacing
      if (!trimmedLine) {
        return <br key={index} />
      }
      
      // Special formatting for answer options
      if (/^[A-D]\)/.test(trimmedLine)) {
        return (
          <div key={index} className="ml-4 my-1 font-medium">
            {trimmedLine}
          </div>
        )
      }
      
      // Special formatting for bullet points
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('→')) {
        return (
          <div key={index} className="ml-4 my-1">
            {trimmedLine}
          </div>
        )
      }
      
      // Special formatting for numbered lists
      if (/^\d+\./.test(trimmedLine)) {
        return (
          <div key={index} className="ml-4 my-1">
            {trimmedLine}
          </div>
        )
      }
      
      // Regular lines
      return (
        <div key={index} className="my-1">
          {trimmedLine}
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧠 Adaptive AI Study Coach
          </h1>
          <p className="text-gray-600">
            AI that learns YOUR communication style and adapts completely
          </p>
          {userProfile?.isOnboarded && (
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {userProfile.name}
              </span>
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                {userProfile.communicationStyle.tone} + {userProfile.communicationStyle.explanationStyle}
              </span>
              <button 
                onClick={resetProfile}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Reset Profile
              </button>
            </div>
          )}
        </div>

        {/* Onboarding */}
        {isOnboarding && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              Let Me Learn Your Communication Style
            </h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-700">
                Instead of asking you questions, I want to see how you naturally communicate. 
                Paste some text you've written recently - could be:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">📱 Text messages to friends</div>
                <div className="bg-green-50 p-3 rounded-lg">📧 Work emails you've sent</div>
                <div className="bg-purple-50 p-3 rounded-lg">📝 Notes you've taken</div>
                <div className="bg-orange-50 p-3 rounded-lg">💬 Social media posts</div>
              </div>
              
              <p className="text-gray-600 text-sm">
                <strong>Privacy note:</strong> This text is only used to understand your communication style. 
                It's not stored permanently.
              </p>
            </div>

            <textarea
              value={textSample}
              onChange={(e) => setTextSample(e.target.value)}
              placeholder="Paste some text you've written recently... the more natural the better! (at least 2-3 sentences)"
              className="w-full h-32 border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                {textSample.length} characters • {textSample.split(' ').length} words
              </div>
              
              <button
                onClick={() => analyzeTextSample(textSample)}
                disabled={isAnalyzing || textSample.trim().length < 50}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing Your Style...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Analyze My Style
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation (only show if onboarded) */}
        {userProfile?.isOnboarded && (
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'chat' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Brain className="inline-block w-5 h-5 mr-2" />
                AI Coaching
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'quiz' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Target className="inline-block w-5 h-5 mr-2" />
                Practice Quiz
              </button>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {userProfile?.isOnboarded && activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                        : 'bg-gray-100 text-gray-800'
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
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg">
                    <div className="flex space-x-1 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4">
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
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Quiz Interface - same as before but better formatted */}
        {userProfile?.isOnboarded && activeTab === 'quiz' && (
          <div className="space-y-6">
            {!quizSession && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
                  Generate AZ-900 Practice Quiz
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {AZ900_DOMAINS.map((domain, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDomain === domain.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedDomain(domain.name)}
                    >
                      <h3 className="font-semibold text-gray-800">{domain.name}</h3>
                      <p className="text-sm text-blue-600 mb-2">{domain.weight}</p>
                      <p className="text-sm text-gray-600">{domain.description}</p>
                    </div>
                  ))}
                </div>

                {selectedDomain && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => generateQuiz(selectedDomain)}
                      disabled={quizLoading}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors flex items-center mx-auto"
                    >
                      {quizLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Generating Quiz...
                        </>
                      ) : (
                        <>
                          <Target className="w-5 h-5 mr-2" />
                          Generate 10 Questions
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quiz questions with better formatting */}
            {quizSession && !quizSession.completed && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {quizSession.domain} - Question {quizSession.currentQuestion + 1} of {quizSession.questions.length}
                  </h2>
                  <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm">
                    Progress: {Math.round(((quizSession.currentQuestion + 1) / quizSession.questions.length) * 100)}%
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 leading-relaxed">
                    {quizSession.questions[quizSession.currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {quizSession.questions[quizSession.currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => answerQuestion(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          quizSession.answers[quizSession.currentQuestion] === index
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={resetQuiz}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                  >
                    Exit Quiz
                  </button>
                  
                  <button
                    onClick={nextQuestion}
                    disabled={quizSession.answers[quizSession.currentQuestion] === null}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg flex items-center"
                  >
                    {quizSession.currentQuestion === quizSession.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Quiz results with better formatting */}
            {quizSession && quizSession.completed && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-6">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {quizSession.score} / {quizSession.questions.length}
                  </div>
                  <div className="text-gray-600">
                    {Math.round((quizSession.score / quizSession.questions.length) * 100)}% Correct
                  </div>
                </div>

                <div className="space-y-4">
                  {quizSession.questions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                        <span className={`px-2 py-1 rounded text-sm ${
                          quizSession.answers[index] === question.correct
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {quizSession.answers[index] === question.correct ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2 leading-relaxed">{question.question}</p>
                      {quizSession.answers[index] !== question.correct && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <p className="text-sm text-yellow-800 mb-2">
                            <strong>Correct answer:</strong> {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                          </p>
                          <div className="text-sm text-yellow-700 leading-relaxed">
                            {formatMessage(question.explanation)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
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
    </div>
  )
}