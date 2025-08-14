import React, { useState, useEffect } from 'react'
import { Target, ChevronRight, BookOpen, Clock, Award } from 'lucide-react'
import type { QuizSession, QuizQuestion, UserProfile, Theme, Certification } from '../types'
import { MULTI_CLOUD_CERTIFICATIONS_2025 } from '../lib/certifications'
import { getColorClasses, getProviderIcon } from '../lib/utils/ui-utils'
import { generateTopicQuizAPI, loadCertificationContentAPI } from '../lib/utils/api-utils'
import { QuizResults } from './QuizResults'

interface QuizInterfaceProps {
  theme: Theme
  userProfile: UserProfile | null
  onQuizComplete?: (session: QuizSession) => void
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  theme,
  userProfile,
  onQuizComplete
}) => {
  // State management
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [selectedCertification, setSelectedCertification] = useState<string>('')
  const [selectedTopicDetails, setSelectedTopicDetails] = useState<any>(null)
  const [availableTopics, setAvailableTopics] = useState<any[]>([])
  const [certificationContent, setCertificationContent] = useState<any>(null)

  // Load certification content when certification is selected
  useEffect(() => {
    if (selectedCertification) {
      loadCertificationContent(selectedCertification)
    }
  }, [selectedCertification])

  // Load certification content and topics
  const loadCertificationContent = async (certificationId: string) => {
    try {
      const result = await loadCertificationContentAPI(certificationId)
      setCertificationContent(result.content)
      setAvailableTopics(result.allTopics)
      console.log(`✅ Loaded ${result.allTopics.length} topics for ${certificationId}`)
    } catch (error) {
      console.error('❌ Failed to load certification content:', error)
    }
  }

  // Generate quiz for selected topic
  const generateTopicQuiz = async (certification: string, topicDetails: any) => {
    setQuizLoading(true)
    try {
      const questions = await generateTopicQuizAPI(certification, topicDetails)
      
      setQuizSession({
        certification,
        domain: `${topicDetails.moduleTitle} → ${topicDetails.title}`,
        questions,
        currentQuestion: 0,
        answers: new Array(questions.length).fill(null),
        score: 0,
        completed: false
      })

      console.log(`✅ Generated ${questions.length} questions for ${topicDetails.title}`)
    } catch (error) {
      console.error('❌ Topic quiz generation failed:', error)
    } finally {
      setQuizLoading(false)
    }
  }

  // Generate quiz for certification domain
  const generateDomainQuiz = async (certification: string, domain: string) => {
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

  // Answer a question
  const answerQuestion = (answerIndex: number) => {
    if (!quizSession) return

    const newAnswers = [...quizSession.answers]
    newAnswers[quizSession.currentQuestion] = answerIndex
    
    setQuizSession({
      ...quizSession,
      answers: newAnswers
    })
  }

  // Move to next question or complete quiz
  const nextQuestion = () => {
    if (!quizSession) return

    if (quizSession.currentQuestion < quizSession.questions.length - 1) {
      setQuizSession({
        ...quizSession,
        currentQuestion: quizSession.currentQuestion + 1
      })
    } else {
      // Complete the quiz
      const correctAnswers = quizSession.answers.reduce((score, answer, index) => {
        return answer === quizSession.questions[index].correct ? score + 1 : score
      }, 0)

      const completedSession = {
        ...quizSession,
        score: correctAnswers,
        completed: true
      }

      setQuizSession(completedSession)
      onQuizComplete?.(completedSession)
    }
  }

  // Reset quiz and return to selection
  const resetQuiz = () => {
    setQuizSession(null)
    setSelectedCertification('')
    setSelectedTopicDetails(null)
  }

  // Get theme-appropriate styling
  const getThemeClasses = () => ({
    container: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    card: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-800',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
    },
    button: {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: theme === 'dark' 
        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
        : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      success: 'bg-green-500 hover:bg-green-600 text-white'
    },
    border: theme === 'dark' ? 'border-gray-600' : 'border-gray-200',
    input: theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  })

  const themeClasses = getThemeClasses()

  // If quiz is completed, show results
  if (quizSession?.completed) {
    return (
      <QuizResults
        quizSession={quizSession}
        onResetQuiz={resetQuiz}
        theme={theme}
      />
    )
  }

  // If quiz is active, show quiz interface
  if (quizSession && !quizSession.completed) {
    const currentQuestion = quizSession.questions[quizSession.currentQuestion]
    const userAnswer = quizSession.answers[quizSession.currentQuestion]

    return (
      <div className={`rounded-lg shadow-lg p-6 ${themeClasses.container}`}>
        {/* Quiz Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
            {quizSession.certification} - {quizSession.domain}
          </h2>
          <span className={`text-sm ${themeClasses.text.secondary}`}>
            Question {quizSession.currentQuestion + 1} of {quizSession.questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className={`w-full bg-gray-200 rounded-full h-2 mb-4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((quizSession.currentQuestion + 1) / quizSession.questions.length) * 100}%` 
              }}
            />
          </div>

          {/* Question Content */}
          <div className="space-y-4">
            <h3 className={`text-lg font-medium leading-relaxed ${themeClasses.text.primary}`}>
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuestion(index)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    userAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : `${themeClasses.border} ${themeClasses.text.primary} hover:border-blue-300 hover:bg-blue-50`
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)})
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={resetQuiz}
                className={`px-4 py-2 rounded-lg transition-colors ${themeClasses.button.secondary}`}
              >
                ← Back to Topics
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={userAnswer === null}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  userAnswer !== null
                    ? themeClasses.button.primary
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {quizSession.currentQuestion === quizSession.questions.length - 1 
                  ? 'Complete Quiz' 
                  : 'Next Question'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Topic selection interface
  if (selectedCertification && availableTopics.length > 0 && !selectedTopicDetails) {
    return (
      <div className="space-y-6">
        <div className={`text-center p-8 rounded-lg ${themeClasses.container} shadow-lg`}>
          <Target className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
            Select a Study Topic
          </h2>
          <p className={themeClasses.text.secondary}>
            Choose from {availableTopics.length} official Microsoft Learn topics for {selectedCertification}
          </p>
        </div>

        {/* Topic Grid */}
        <div className="grid gap-4">
          {availableTopics.map((topic, index) => (
            <button
              key={index}
              onClick={() => setSelectedTopicDetails(topic)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                theme === 'dark'
                  ? 'border-gray-600 hover:border-blue-400 bg-gray-800/50 hover:bg-gray-700/50'
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className={`font-medium mb-2 ${themeClasses.text.primary}`}>
                    📖 {topic.title}
                  </h5>
                  <p className={`text-sm mb-3 ${themeClasses.text.secondary}`}>
                    Module: {topic.moduleTitle}
                  </p>
                  
                  {topic.keyPoints && topic.keyPoints.length > 0 && (
                    <div className="space-y-1">
                      <p className={`text-xs font-medium ${themeClasses.text.muted}`}>
                        Key concepts:
                      </p>
                      <ul className={`text-xs space-y-1 ${themeClasses.text.muted}`}>
                        {topic.keyPoints.slice(0, 2).map((point: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                        {topic.keyPoints.length > 2 && (
                          <li className="italic">+{topic.keyPoints.length - 2} more...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <ChevronRight className={`w-5 h-5 mt-1 ${themeClasses.text.muted}`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Topic details and quiz generation
  if (selectedTopicDetails) {
    return (
      <div className={`p-6 rounded-lg shadow-lg ${themeClasses.container}`}>
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
            theme === 'dark' 
              ? 'bg-blue-900/30 text-blue-300' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {selectedTopicDetails.moduleTitle}
          </div>
          
          <h3 className={`text-xl font-bold mb-2 ${themeClasses.text.primary}`}>
            {selectedTopicDetails.title}
          </h3>
          
          <p className={`mb-6 ${themeClasses.text.secondary}`}>
            Ready to test your knowledge on this topic?
          </p>

          {selectedTopicDetails.keyPoints && selectedTopicDetails.keyPoints.length > 0 && (
            <div className={`mb-6 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                This quiz will cover:
              </p>
              <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
                {selectedTopicDetails.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSelectedTopicDetails(null)}
              className={`px-6 py-2 rounded-lg transition-colors ${themeClasses.button.secondary}`}
            >
              ← Back to Topics
            </button>
            
            <button
              onClick={() => generateTopicQuiz(selectedCertification, selectedTopicDetails)}
              disabled={quizLoading}
              className={`px-8 py-2 rounded-lg font-medium transition-colors flex items-center ${themeClasses.button.success}`}
            >
              {quizLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Generate 10 Questions
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Initial certification selection
  return (
    <div className="space-y-6">
      <div className={`text-center p-8 rounded-lg ${themeClasses.container} shadow-lg`}>
        <Target className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h2 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
          Practice Quiz
        </h2>
        <p className={themeClasses.text.secondary}>
          Select a certification to start practicing with official curriculum topics
        </p>
      </div>

      {/* Certification Selection */}
      <div className={`p-6 rounded-lg shadow-lg ${themeClasses.container}`}>
        <h3 className={`text-lg font-medium mb-4 ${themeClasses.text.primary}`}>
          Choose Your Certification
        </h3>
        
        <div className="grid gap-4">
          {Object.values(MULTI_CLOUD_CERTIFICATIONS_2025).slice(0, 6).map((cert) => {
            const colors = getColorClasses(cert.color, theme)
            
            return (
              <button
                key={cert.id}
                onClick={() => setSelectedCertification(cert.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${colors.bg} ${colors.border} hover:shadow-md`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-4 ${colors.icon}`}>
                    {getProviderIcon(cert.provider)}
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold ${colors.text}`}>
                      {cert.name}
                    </div>
                    <div className={`text-sm ${themeClasses.text.secondary}`}>
                      {cert.fullName}
                    </div>
                    <div className={`text-xs ${themeClasses.text.muted}`}>
                      {cert.provider} • {cert.level} Level
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${themeClasses.text.muted}`} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuizInterface