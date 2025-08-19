# AI Certification Study Coach - File Structure Analysis

## 📁 Main Application Files

| File Name | Purpose | Key Functions |
|-----------|---------|---------------|
| **app/page.tsx** | Main application component | `EnhancedPersonalizedCoach()`, `sendMessageProtected()`, `analyzeConversationContext()`, `handleTabSwitch()`, `loadCertificationContent()` |

## 📁 Component Files

| File Name | Purpose | Key Functions |
|-----------|---------|---------------|
| **components/OnboardingComponent.tsx** | User onboarding flow | `analyzeStyleAndContinue()`, `finalizeCertificationChoice()`, handles user profile creation |
| **components/ChatInterface.tsx** | Chat messaging interface | Uses `sendMessageToAPI()`, `getAPIErrorMessage()`, `formatMessageContent()` |
| **components/QuizInterface.tsx** | Quiz generation and display | `loadCertificationContent()`, `generateQuiz()`, `generateTopicQuiz()`, `answerQuestion()`, `nextQuestion()`, `resetQuiz()` |
| **components/QuizResults.tsx** | Quiz results display | `calculateQuizMetrics()`, `getPerformanceLevel()`, `generateStudyRecommendations()`, `toggleQuestionDetails()` |

## 📁 API Route Files

| File Name | Purpose | Key Functions |
|-----------|---------|---------------|
| **app/api/chat/route.ts** | Chat API endpoint | `POST()`, `getSystemPrompt()`, handles OpenAI chat completions |
| **app/api/analyze-style/route.ts** | Communication style analysis | `POST()`, analyzes text samples for user communication preferences |
| **app/api/generate-quiz/route.ts** | Quiz generation API | `POST()`, `generateTopicSpecificPrompt()`, `getTopicSpecificFallbacks()` |
| **app/api/load-certification-content/route.ts** | Certification content loader | `POST()`, returns AZ-900 comprehensive content |

## 📁 Library Utility Files

| File Name | Purpose | Key Functions |
|-----------|---------|---------------|
| **lib/utils/api-utils.ts** | API utility functions | `sendMessageToAPI()`, `generateTopicQuizAPI()`, `loadCertificationContentAPI()`, `getAPIErrorMessage()` |
| **lib/utils/ui-utils.ts** | UI helper functions | `getColorClasses()`, `getProviderIcon()`, `getFilteredCertifications()`, `toggleTheme()`, `initializeTheme()`, `getPopularCertifications()`, `getCertificationDomains()`, `formatMessageContent()` |
| **lib/utils/message-utils.ts** | Message generation utilities | `getWelcomeBackMessage()`, `getCertificationWelcomeMessage()`, `getErrorMessage()`, `getFallbackMessage()`, `getInitialChatMessage()`, `getCompletionMessage()` |
| **lib/utils/quiz-utils.ts** | Quiz calculation utilities | `calculateQuizMetrics()`, `getPerformanceLevel()`, `generateStudyRecommendations()` |
| **lib/utils/session-utils.ts** | Session management utilities | `initializeNewSession()`, `testSessionLimits()`, `resetUserProfile()`, `loadUserProfile()`, `saveUserProfile()` |

## 📁 Library Core Files

| File Name | Purpose | Key Functions |
|-----------|---------|---------------|
| **lib/sessionManager.ts** | Session and usage management | `SessionManager` class, `startNewSession()`, `canSendMessage()`, `recordMessage()`, `canGenerateQuiz()`, `recordQuiz()`, `getDailyUsage()`, `loadUserProfile()`, `saveUserProfile()`, `resetUserProfile()` |
| **lib/certifications.ts** | Certification database | Contains `MULTI_CLOUD_CERTIFICATIONS_2025` data, `getCertificationsByProvider()` |

## 📁 Type Definition Files

| File Name | Purpose | Key Interfaces/Types |
|-----------|---------|---------------|
| **types/index.ts** | Centralized type definitions | `UserProfile`, `ChatMessage`, `QuizQuestion`, `QuizSession`, `Certification`, `CertificationContent`, `Theme`, `QuizMetrics`, etc. |

## 📁 Data Files

| File Name | Purpose | Key Content |
|-----------|---------|---------------|
| **app/data/quiz-topics/az900-specifications.ts** | AZ-900 topic specifications | Topic-specific quiz generation data with focus areas, key terms, scenarios |

## 🔄 Identified Redundancies & Overlaps

### 1. **User Profile Management**
- **Redundancy**: Both `lib/sessionManager.ts` and `lib/utils/session-utils.ts` have duplicate functions:
  - `loadUserProfile()`
  - `saveUserProfile()`
  - `resetUserProfile()`
- **Recommendation**: Keep only in `sessionManager.ts` and remove from `session-utils.ts`

### 2. **Certification Content Loading**
- **Overlap**: `loadCertificationContent()` appears in:
  - `app/page.tsx`
  - `components/QuizInterface.tsx`
  - `lib/utils/api-utils.ts` (as `loadCertificationContentAPI()`)
- **Recommendation**: Use only the API utility version across all components

### 3. **Theme Management**
- **Overlap**: Theme toggle logic appears in multiple places
- **Recommendation**: Centralize in `lib/utils/ui-utils.ts`

### 4. **Error Message Generation**
- **Redundancy**: Error messages generated in:
  - `lib/utils/message-utils.ts` (`getErrorMessage()`)
  - `lib/utils/api-utils.ts` (`getAPIErrorMessage()`)
- **Recommendation**: Merge into single function in `message-utils.ts`

### 5. **Session Initialization**
- **Overlap**: Session initialization logic scattered between:
  - `lib/sessionManager.ts` (`startNewSession()`)
  - `lib/utils/session-utils.ts` (`initializeNewSession()`)
- **Recommendation**: Keep only in `sessionManager.ts`

### 6. **Quiz Generation**
- **Overlap**: Quiz generation API calls in:
  - `components/QuizInterface.tsx` (direct fetch and via utility)
  - `lib/utils/api-utils.ts` (`generateTopicQuizAPI()`)
- **Recommendation**: Use only the API utility version

### 7. **Deleted/Backup Files**
- Multiple backup/deleted versions in `_todelete/`, `_workingbackup/`, `_debugging/` folders
- **Recommendation**: Clean up these folders after confirming no needed code

## 📊 Summary Statistics

- **Total Active Files**: ~20 core files
- **API Routes**: 4 endpoints
- **Component Files**: 4 main components
- **Utility Files**: 6 utility modules
- **Redundant Functions Identified**: ~10-12 functions
- **Potential Lines to Save**: ~150-200 lines by removing redundancies

## 🎯 Action Items

1. **Consolidate user profile management** → Remove from `session-utils.ts`
2. **Standardize API calls** → Use only utility functions, not direct fetches
3. **Merge error message functions** → Single source of truth
4. **Clean up backup folders** → Remove `_todelete`, `_debugging`, `_workingbackup`
5. **Remove `session-utils.ts`** → Already duplicated in `sessionManager.ts`
6. **Standardize imports** → Ensure all components use utility functions