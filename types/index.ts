// types/index.ts
// 🏗️ Centralized type definitions for the entire application

// 👤 User and Profile Types
export interface UserProfile {
  name: string;
  targetCertification: string;
  communicationStyle: {
    tone: 'casual' | 'formal' | 'mixed';
    complexity: 'simple' | 'detailed' | 'technical';
    explanationStyle: 'examples' | 'step-by-step' | 'analogies' | 'direct';
    learningPreference: 'visual' | 'conversational' | 'structured';
  };
  certificationContent?: any;
  rawText?: string;
  isOnboarded: boolean;
}

// 💬 Chat and Message Types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

// 🎯 Quiz Related Types
export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  domain?: string
  topicAlignment?: string
  relevanceScore?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  examStyle?: string
}

export interface QuizSession {
  certification: string
  domain: string
  questions: QuizQuestion[]
  answers: (number | null)[]
  score: number
  completed: boolean
  currentQuestion: number
  timeStarted?: Date
  timeCompleted?: Date
  metadata?: {
    questionCount: number
    source: string
    topicFocus: string
    isFallback?: boolean
  }
}

export interface QuizMetrics {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  percentage: number
}

export interface PerformanceLevel {
  level: string
  color: string
  icon: string
}

export interface QuestionAnalysis {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  domain?: string
  index: number
  userAnswer: number | null
  selectedOption: string
  correctOption: string
  isCorrect: boolean
  wasAnswered: boolean
}

// 🎓 Certification Types
export interface CertificationDomain {
  name: string
  weight: string
  description?: string
  topics?: string[]
}

export interface Certification {
  id: string
  name: string
  fullName: string
  level: string
  provider: string
  color: string
  description: string
  averageSalary?: string
  icon: string
  domains?: CertificationDomain[]
}

export interface CertificationContent {
  modules: Array<{
    title: string
    moduleId: string
    estimatedTime: string
    weight: string
    topics: Array<{
      id: string
      title: string
      keyPoints?: string[]
      learningObjectives?: string[]
    }>
  }>
}

export interface TopicDetails {
  id: string
  title: string
  moduleTitle: string
  moduleId: string
  estimatedTime: string
  weight: string
  keyPoints?: string[]
  learningObjectives?: string[]
}

// 🎨 UI and Theme Types
export type Theme = 'light' | 'dark'

export interface ColorScheme {
  bg: string
  border: string
  text: string
  icon?: string
}

export interface ThemeColors {
  blue: ColorScheme
  red: ColorScheme
  orange: ColorScheme
  green: ColorScheme
  purple: ColorScheme
  yellow: ColorScheme
}

// 📊 Session Management Types
export interface SessionStats {
  messageCount: number
  quizCount: number
  studyTime: number
  lastActivity: Date
}

export interface SessionLimits {
  maxMessages: number
  maxQuizzes: number
  maxStudyTime: number
}

// 🔧 Component Props Types
export interface QuizResultsProps {
  quizSession: QuizSession
  onResetQuiz: () => void
  onRetakeQuiz?: () => void
  theme: Theme
}

export interface SessionManagerProps {
  theme: Theme
  messageCount: number
  maxMessages: number
  quizCount: number
  maxQuizzes: number
  onReset?: () => void
}

// 🚀 API Related Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface QuizGenerationRequest {
  certification: string
  domain: string
  questionCount: number
  userProfile?: UserProfile['communicationStyle']
  topicDetails?: TopicDetails
  moduleContent?: string[]
}

export interface QuizGenerationResponse {
  questions: QuizQuestion[]
  metadata: {
    certification: string
    domain: string
    questionCount: number
    source: string
    topicFocus: string
    isFallback?: boolean
    warning?: string
  }
}

// 📝 Form and Input Types
export interface OnboardingStep {
  step: number
  title: string
  description: string
  completed: boolean
}

export interface FormValidation {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

// 🔍 Search and Filter Types
export interface SearchFilters {
  provider?: string
  level?: string
  category?: string
  difficulty?: string
}

export interface SearchResult {
  id: string
  title: string
  description: string
  relevance: number
  type: 'certification' | 'topic' | 'question'
}

// 🎯 Study Recommendations Types
export interface StudyRecommendation {
  focusAreas: string[]
  suggestions: string[]
  nextSteps?: string[]
  resources?: Array<{
    title: string
    url: string
    type: 'video' | 'article' | 'practice' | 'documentation'
  }>
}