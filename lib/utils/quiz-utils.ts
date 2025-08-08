// lib/utils/quiz-utils.ts
// 🔧 SIMPLIFIED utility functions for testing

// Simple interfaces (minimal for now)
export interface QuizSession {
  questions: Array<{ correct: number }>
  answers: (number | null)[]
  score: number
}

// Simple calculation function
export const calculateQuizMetrics = (quizSession: QuizSession) => {
  const totalQuestions = quizSession.questions.length
  const correctAnswers = quizSession.score
  const incorrectAnswers = totalQuestions - correctAnswers
  const percentage = Math.round((correctAnswers / totalQuestions) * 100)
  
  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage
  }
}

// Simple performance level function
export const getPerformanceLevel = (percentage: number) => {
  if (percentage >= 90) return { level: 'Excellent', color: 'green', icon: '🎉' }
  if (percentage >= 80) return { level: 'Very Good', color: 'blue', icon: '🎯' }
  if (percentage >= 70) return { level: 'Good', color: 'yellow', icon: '👍' }
  if (percentage >= 60) return { level: 'Fair', color: 'orange', icon: '📚' }
  return { level: 'Needs Improvement', color: 'red', icon: '💪' }
}

// Study recommendations function
export const generateStudyRecommendations = (
  incorrectQuestions: Array<{ domain?: string }>,
  unansweredQuestions: Array<any>,
  percentage: number
) => {
  const weakAreas = incorrectQuestions.map(q => q.domain).filter(Boolean)
  const uniqueWeakAreas = [...new Set(weakAreas)]
  
  return {
    focusAreas: uniqueWeakAreas.slice(0, 3),
    suggestions: [
      percentage < 70 ? "Review fundamental concepts before retaking" : null,
      incorrectQuestions.length > 3 ? "Focus on scenario-based questions" : null,
      unansweredQuestions.length > 0 ? "Improve time management skills" : null,
      "Practice with official Microsoft Learn modules"
    ].filter(Boolean)
  }
}