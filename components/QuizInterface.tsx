'use client'

import { useState, useEffect } from 'react'
import { Brain, Target, ChevronRight, BookOpen, Award, Clock } from 'lucide-react'
import { MULTI_CLOUD_CERTIFICATIONS_2025, getCertificationsByProvider } from '../lib/certifications'
import { canGenerateQuiz, recordQuiz } from '../lib/sessionManager'
import { QuizResults } from './QuizResults'
import { loadCertificationContentAPI, generateTopicQuizAPI } from '../lib/utils/api-utils'
import type { 
  QuizSession, 
  UserProfile, 
  Theme, 
  TopicDetails, 
  CertificationContent 
} from '../types'

interface QuizInterfaceProps {
  theme: Theme
  userProfile: UserProfile | null
  onQuizComplete?: (session: QuizSession) => void
}

export default function QuizInterface({ theme, userProfile, onQuizComplete }: QuizInterfaceProps) {
  // State management
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [selectedTopicDetails, setSelectedTopicDetails] = useState<TopicDetails | null>(null)
  const [selectedCertification, setSelectedCertification] = useState('')
  const [availableTopics, setAvailableTopics] = useState<TopicDetails[]>([])
  const [certificationContent, setCertificationContent] = useState<CertificationContent | null>(null)

  // Load certification content when certification is selected
  const loadCertificationContent = async (certId: string) => {
    try {
      setQuizLoading(true)
      const content = await loadCertificationContentAPI(certId)
      setCertificationContent(content)
      
      // Extract topics from modules
      const allTopics: TopicDetails[] = []
      content.modules.forEach(module => {
        module.topics.forEach(topic => {
          allTopics.push({
            ...topic,
            moduleTitle: module.title,
            moduleId: module.moduleId,
            estimatedTime: module.estimatedTime,
            weight: module.weight
          })
        })
      })
      setAvailableTopics(allTopics)
    } catch (error) {
      console.error('Error loading certification content:', error)
      setAvailableTopics([])
    } finally {
      setQuizLoading(false)
    }
  }

  // Generate quiz for specific domain
  const generateQuiz = async (certification: string, domain: string) => {
    if (!canGenerateQuiz()) {
      return
    }

    setQuizLoading(true)
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certification,
          domain,
          questionCount: 5,
          userProfile: userProfile?.communicationStyle
        })
      })

      if (!response.ok) throw new Error('Quiz generation failed')

      const data = await response.json()
      const newSession: QuizSession = {
        certification,
        domain,
        questions: data.questions,
        currentQuestion: 0,
        answers: new Array(data.questions.length).fill(null),
        score: 0,
        completed: false,
        timeStarted: new Date(),
        metadata: data.metadata
      }

      setQuizSession(newSession)
      recordQuiz()
    } catch (error) {
      console.error('Quiz generation error:', error)
    } finally {
      setQuizLoading(false)
    }
  }

  // Generate quiz for specific topic
  const generateTopicQuiz = async (certId: string, topicDetails: TopicDetails) => {
    if (!canGenerateQuiz()) {
      return
    }

    setQuizLoading(true)
    try {
      const response = await generateTopicQuizAPI(certId, topicDetails, userProfile?.communicationStyle)
      
      const newSession: QuizSession = {
        certification: certId,
        domain: topicDetails.title,
        questions: response.questions,
        currentQuestion: 0,
        answers: new Array(response.questions.length).fill(null),
        score: 0,
        completed: false,
        timeStarted: new Date(),
        metadata: response.metadata
      }

      setQuizSession(newSession)
      recordQuiz()
    } catch (error) {
      console.error('Topic quiz generation error:', error)
    } finally {
      setQuizLoading(false)
    }
  }

  // Answer question
  const answerQuestion = (answerIndex: number) => {
    if (!quizSession || quizSession.completed) return

    const newAnswers = [...quizSession.answers]
    newAnswers[quizSession.currentQuestion] = answerIndex

    setQuizSession({
      ...quizSession,
      answers: newAnswers
    })
  }

  // Move to next question or complete quiz
  const nextQuestion = () => {
    if (!quizSession || quizSession.completed) return

    if (quizSession.currentQuestion < quizSession.questions.length - 1) {
      setQuizSession({
        ...quizSession,
        currentQuestion: quizSession.currentQuestion + 1
      })
    } else {
      // Complete quiz
      const correctAnswers = quizSession.answers.reduce((score, answer, index) => {
        return answer === quizSession.questions[index].correct ? score + 1 : score
      }, 0)

      const completedSession = {
        ...quizSession,
        score: correctAnswers,
        completed: true,
        timeCompleted: new Date()
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

  // Get certification by provider for organization
  const azureCerts = getCertificationsByProvider('Microsoft')
  const awsCerts = getCertificationsByProvider('AWS')
  const gcpCerts = getCertificationsByProvider('Google Cloud')

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

  // If quiz is active, show quiz interface (MAINTAINING EXACT ORIGINAL FORMAT)
  if (quizSession && !quizSession.completed) {
    return (
      <div className={`rounded-lg shadow-lg p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Quiz Header - EXACT ORIGINAL FORMAT */}
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

        {/* Progress Bar - EXACT ORIGINAL FORMAT */}
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

          {/* Question Content - EXACT ORIGINAL FORMAT */}
          <div className="space-y-4">
            <h3 className={`text-lg font-medium leading-relaxed ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              {quizSession.questions[quizSession.currentQuestion]?.question}
            </h3>

            {/* Answer Options - EXACT ORIGINAL FORMAT */}
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

          {/* Navigation - EXACT ORIGINAL FORMAT */}
          <div className="flex justify-between mt-6">
            <button
              onClick={resetQuiz}
              className={`px-6 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              ← Back to Topics
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={quizSession.answers[quizSession.currentQuestion] === null}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                quizSession.answers[quizSession.currentQuestion] !== null
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
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
    )
  }

  // Show topic details and quiz generation button
  if (selectedTopicDetails) {
    return (
      <div className={`rounded-lg shadow-lg p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <Target className={`mx-auto h-16 w-16 mb-4 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
          }`} />
          
          <h3 className={`text-xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {selectedTopicDetails.title}
          </h3>
          
          <p className={`text-sm mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Module: {selectedTopicDetails.moduleTitle} • {selectedTopicDetails.estimatedTime} • Weight: {selectedTopicDetails.weight}
          </p>

          {selectedTopicDetails.keyPoints && selectedTopicDetails.keyPoints.length > 0 && (
            <div className={`mb-6 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                This quiz will cover:
              </p>
              <ul className={`text-sm space-y-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
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
              className={`px-6 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              ← Back to Topics
            </button>
            
            <button
              onClick={() => generateTopicQuiz(selectedCertification, selectedTopicDetails)}
              disabled={quizLoading}
              className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              {quizLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Start Topic Quiz
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show topic selection for selected certification
  if (selectedCertification && availableTopics.length > 0) {
    return (
      <div className={`rounded-lg shadow-lg p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-6">
          <BookOpen className={`mx-auto h-16 w-16 mb-4 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
          }`} />
          
          <h3 className={`text-xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Select a Topic for {selectedCertification}
          </h3>
          
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Choose from {availableTopics.length} available topics
          </p>
        </div>

        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {availableTopics.map((topic, index) => (
            <button
              key={index}
              onClick={() => setSelectedTopicDetails(topic)}
              className={`text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-200 text-gray-800 hover:bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{topic.title}</h4>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {topic.moduleTitle}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{topic.estimatedTime}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              setSelectedCertification('')
              setAvailableTopics([])
            }}
            className={`px-6 py-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            ← Back to Certifications
          </button>
        </div>
      </div>
    )
  }

  // Show certification selection
  return (
    <div className={`rounded-lg shadow-lg p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="text-center mb-8">
        <Brain className={`mx-auto h-16 w-16 mb-4 ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
        }`} />
        
        <h2 className={`text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Practice Quiz Generator
        </h2>
        
        <p className={`${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Test your knowledge with AI-generated practice questions
        </p>
      </div>

      {/* Certification Selection */}
      <div className="space-y-6">
        {/* Microsoft Azure */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            <Award className="h-5 w-5 mr-2 text-blue-500" />
            Microsoft Azure
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {azureCerts.map(cert => (
              <button
                key={cert.id}
                onClick={() => {
                  setSelectedCertification(cert.id)
                  loadCertificationContent(cert.id)
                }}
                disabled={quizLoading}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-200 text-gray-800 hover:bg-blue-50'
                } ${quizLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-blue-500">{cert.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {cert.fullName}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* AWS */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            <Award className="h-5 w-5 mr-2 text-orange-500" />
            Amazon Web Services
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {awsCerts.map(cert => (
              <button
                key={cert.id}
                onClick={() => {
                  setSelectedCertification(cert.id)
                  loadCertificationContent(cert.id)
                }}
                disabled={quizLoading}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:border-orange-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-200 text-gray-800 hover:bg-orange-50'
                } ${quizLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-orange-500">{cert.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {cert.fullName}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Google Cloud */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            <Award className="h-5 w-5 mr-2 text-red-500" />
            Google Cloud Platform
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {gcpCerts.map(cert => (
              <button
                key={cert.id}
                onClick={() => {
                  setSelectedCertification(cert.id)
                  loadCertificationContent(cert.id)
                }}
                disabled={quizLoading}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:border-red-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-200 text-gray-800 hover:bg-red-50'
                } ${quizLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-red-500">{cert.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {cert.fullName}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {quizLoading && (
        <div className="text-center mt-6">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Loading certification content...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}