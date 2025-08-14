// components/QuizResults.tsx
import { calculateQuizMetrics, getPerformanceLevel, generateStudyRecommendations } from '../lib/utils/quiz-utils'
import React, { useState } from 'react'
import { 
  Trophy, Target, BookOpen, TrendingUp, AlertCircle, 
  CheckCircle, XCircle, RotateCcw, ChevronDown, ChevronRight,
  Clock, Award, Brain, ArrowRight, Download, Share
} from 'lucide-react'
import type { 
  QuizQuestion,
  QuizSession,
  QuizResultsProps
} from '../types'


export const QuizResults: React.FC<QuizResultsProps> = ({ 
  quizSession, 
  onResetQuiz, 
  onRetakeQuiz,
  theme 
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [showDetailedView, setShowDetailedView] = useState(false)

  // Calculate performance metrics
  const metrics = calculateQuizMetrics(quizSession)
  const { totalQuestions, correctAnswers, incorrectAnswers, percentage } = metrics
  const performance = getPerformanceLevel(percentage)

  // Categorize questions by result
  const questionAnalysis = quizSession.questions.map((question, index) => {
    const userAnswer = quizSession.answers[index]
    const isCorrect = userAnswer === question.correct
    const selectedOption = userAnswer !== null ? question.options[userAnswer] : 'Not answered'
    const correctOption = question.options[question.correct]

    return {
      ...question,
      index,
      userAnswer,
      selectedOption,
      correctOption,
      isCorrect,
      wasAnswered: userAnswer !== null
    }
  })

  const correctQuestions = questionAnalysis.filter(q => q.isCorrect)
  const incorrectQuestions = questionAnalysis.filter(q => !q.isCorrect && q.wasAnswered)
  const unansweredQuestions = questionAnalysis.filter(q => !q.wasAnswered)

  // Generate study recommendations using utility function
  const studyRecs = generateStudyRecommendations(incorrectQuestions, unansweredQuestions, percentage)

  const toggleQuestionDetails = (questionIndex: number) => {
    setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex)
  }

  const getQuestionStatusIcon = (question: any) => {
    if (question.isCorrect) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (question.wasAnswered) {
      return <XCircle className="w-5 h-5 text-red-500" />
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getAnswerHighlight = (optionIndex: number, question: any) => {
    const isUserChoice = question.userAnswer === optionIndex
    const isCorrectAnswer = question.correct === optionIndex
    
    if (isCorrectAnswer && isUserChoice) {
      return 'bg-green-100 border-green-500 text-green-800' // Correct choice
    } else if (isCorrectAnswer) {
      return 'bg-green-50 border-green-300 text-green-700' // Correct answer (not chosen)
    } else if (isUserChoice) {
      return 'bg-red-100 border-red-500 text-red-800' // Wrong choice
    }
    return theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
  }

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Performance Overview */}
      <div className={`rounded-lg shadow-lg p-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {performance.level === 'Excellent' ? (
              <Trophy className="w-20 h-20 text-yellow-500" />
            ) : performance.level === 'Very Good' ? (
              <Target className="w-20 h-20 text-blue-500" />
            ) : (
              <BookOpen className="w-20 h-20 text-gray-500" />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {performance.icon} {performance.level}
          </h2>
          
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {correctAnswers} / {totalQuestions}
          </div>
          
          <div className={`text-xl mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {percentage}% Correct
          </div>

          {/* Performance Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            performance.color === 'green' ? 'bg-green-100 text-green-800' :
            performance.color === 'blue' ? 'bg-blue-100 text-blue-800' :
            performance.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            performance.color === 'orange' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {quizSession.certification} - {quizSession.domain}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-lg shadow ${
          theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-green-300' : 'text-green-600'
              }`}>
                Correct Answers
              </p>
              <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow ${
          theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-red-300' : 'text-red-600'
              }`}>
                Incorrect Answers
              </p>
              <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow ${
          theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
              }`}>
                Accuracy Rate
              </p>
              <p className="text-2xl font-bold text-blue-600">{percentage}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Study Recommendations */}
      {(percentage < 80 || studyRecs.focusAreas.length > 0) && (
        <div className={`p-6 rounded-lg shadow ${
          theme === 'dark' ? 'bg-gray-800 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start space-x-3">
            <Brain className="w-6 h-6 text-yellow-500 mt-1" />
            <div className="flex-1">
              <h3 className={`font-semibold mb-3 ${
                theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
              }`}>
                📚 Study Recommendations
              </h3>
              
              {studyRecs.focusAreas.length > 0 && (
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
                  }`}>
                    Focus Areas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {studyRecs.focusAreas.map((area, index) => (
                      <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' ? 'bg-yellow-900/50 text-yellow-200' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <ul className={`space-y-1 text-sm ${
                theme === 'dark' ? 'text-yellow-200' : 'text-yellow-700'
              }`}>
                {studyRecs.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Detailed View */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowDetailedView(!showDetailedView)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          {showDetailedView ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <span>{showDetailedView ? 'Hide' : 'Show'} Detailed Question Analysis</span>
        </button>
      </div>

      {/* Detailed Question Analysis */}
      {showDetailedView && (
        <div className={`p-6 rounded-lg shadow ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            📋 Question-by-Question Analysis
          </h3>

          <div className="space-y-4">
            {questionAnalysis.map((question, index) => (
              <div key={index} className={`border rounded-lg ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => toggleQuestionDetails(index)}
                  className={`w-full p-4 text-left transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getQuestionStatusIcon(question)}
                      <span className="font-medium">Question {index + 1}</span>
                      {question.isCorrect ? (
                        <span className="text-green-600 text-sm">✓ Correct</span>
                      ) : question.wasAnswered ? (
                        <span className="text-red-600 text-sm">✗ Incorrect</span>
                      ) : (
                        <span className="text-yellow-600 text-sm">⚠ Not Answered</span>
                      )}
                    </div>
                    {expandedQuestion === index ? 
                      <ChevronDown className="w-5 h-5" /> : 
                      <ChevronRight className="w-5 h-5" />
                    }
                  </div>
                </button>

                {expandedQuestion === index && (
                  <div className={`border-t p-6 ${
                    theme === 'dark' ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'
                  }`}>
                    {/* Question Text */}
                    <div className="mb-6">
                      <h4 className={`font-medium mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {question.question}
                      </h4>

                      {/* Answer Options */}
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 border-2 rounded-lg transition-colors ${
                              getAnswerHighlight(optionIndex, question)
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>
                                <span className="font-medium mr-3">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                              </span>
                              <div className="flex space-x-2">
                                {question.userAnswer === optionIndex && (
                                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                    Your Answer
                                  </span>
                                )}
                                {question.correct === optionIndex && (
                                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                    Correct
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className={`p-4 rounded-lg ${
                      theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className={`font-medium mb-2 ${
                            theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
                          }`}>
                            Explanation:
                          </p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
                          }`}>
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Answer Summary */}
                    {!question.isCorrect && (
                      <div className={`mt-4 p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                      }`}>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-red-200' : 'text-red-700'
                        }`}>
                          <span className="font-medium">Your answer:</span> {question.selectedOption}
                          <br />
                          <span className="font-medium">Correct answer:</span> {question.correctOption}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onResetQuiz}
          className={`flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          <Target className="w-5 h-5 mr-2" />
          New Topic Quiz
        </button>
        
        {onRetakeQuiz && (
          <button
            onClick={onRetakeQuiz}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Retake Same Quiz
          </button>
        )}
        
        <button
          onClick={() => {
            // Create a simple text summary for sharing
            const summary = `🎯 ${quizSession.certification} Quiz Results\n📊 Score: ${correctAnswers}/${totalQuestions} (${percentage}%)\n🎯 Topic: ${quizSession.domain}\n\nStudy with AI Certification Coach!`
            navigator.share?.({ text: summary }) || navigator.clipboard?.writeText(summary)
          }}
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          <Share className="w-5 h-5 mr-2" />
          Share Results
        </button>
      </div>
    </div>
  )
}