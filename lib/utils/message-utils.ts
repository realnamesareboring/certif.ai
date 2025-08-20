// lib/utils/message-utils.ts
// Ultra-safe message utility extraction from page.tsx
// Following the proven pattern from quiz-utils.ts
import type { UserProfile } from '../../types'

/**
 * Generate welcome back message based on user's communication style
 * Extracted from page.tsx - ~15 lines saved
 */
export const getWelcomeBackMessage = (profile: UserProfile): string => {
  if (profile.communicationStyle.tone === 'casual') {
    return `Yo ${profile.name}! Welcome back! 🚀\n\nI remember ur style - keeping it ${profile.communicationStyle.tone} and ${profile.communicationStyle.complexity}. Ready to crush some more certs?`;
  } else if (profile.communicationStyle.tone === 'formal') {
    return `Welcome back, ${profile.name}.\n\nI have your communication preferences configured for ${profile.communicationStyle.tone} tone with ${profile.communicationStyle.complexity} explanations.\n\nHow may I assist with your certification studies today?`;
  } else {
    return `Hey ${profile.name}! Good to see you again!\n\nI've got your style preferences saved - ${profile.communicationStyle.tone} tone with ${profile.communicationStyle.explanationStyle}-focused learning.\n\nWhat certification are we tackling today?`;
  }
};

/**
 * Generate certification-specific welcome message with official content
 * Extracted from page.tsx - ~25 lines saved
 */
export const getCertificationWelcomeMessage = (profile: UserProfile, officialContent?: any): string => {
  const certName = profile.targetCertification;
  const style = profile.communicationStyle;
  
  // Get the CORRECT topics from official Microsoft Learn content
  const getOfficialTopics = () => {
    if (!officialContent?.domains) {
      return ["• General certification topics", "• Practice questions", "• Study guidance"];
    }
    
    return officialContent.domains.slice(0, 3).map((domain: any) => 
      `• ${domain.name} (${domain.weight})`
    );
  };

  const topics = getOfficialTopics();
  
  if (style?.tone === 'casual') {
    return `Yo! Welcome to your ${certName} study squad! 🚀

I've loaded all the official Microsoft Learn content for ${certName}, so we're gonna crush this exam together!

I'm ur dedicated ${certName} tutor now - ask me anything about:
${topics.join('\n')}

Ready to get started? What part of ${certName} do u wanna dive into first?`;
  } else if (style?.tone === 'formal') {
    return `Welcome to your dedicated ${certName} preparation program.

I have successfully integrated the complete Microsoft Learn curriculum for ${certName}, including:

• Official exam objectives and domains
• Key terminology and concepts  
• Practice scenarios and examples
• Study guidance and tips

Your ${certName} exam covers these main areas:
${topics.join('\n')}

I will serve as your specialized ${certName} instructor, adapting all explanations to your preferred learning style.

Practice Quiz Generation

How would you like to proceed?`;
  } else {
    return `Perfect ${profile.name}!

I've learned your style - you like ${style.complexity} explanations delivered through ${style.explanationStyle}. I'll keep things ${style.tone} but informative.

Ready to start? I can help with:

→ AI coaching and explanations
→ Custom practice quizzes

What interests you most?`;
  }
};

/**
 * Generate error message based on user communication style
 * MOVED from api-utils.ts - Single source of truth for all error messages
 */
export const getAPIErrorMessage = (
  userProfile: UserProfile | null, 
  context: 'chat' | 'quiz' | 'general' = 'general'
): string => {
  const tone = userProfile?.communicationStyle?.tone
  
  if (context === 'chat') {
    if (tone === 'casual') {
      return 'Oops! Something went wrong. Try again?'
    } else if (tone === 'formal') {
      return 'I apologize, but I encountered an error. Please try again.'
    } else {
      return 'Sorry, something went wrong. Please try again.'
    }
  } else if (context === 'quiz') {
    if (tone === 'casual') {
      return "Uh oh! Quiz didn't load. Want me to try again?"
    } else if (tone === 'formal') {
      return 'Quiz generation failed. Would you like to retry?'
    } else {
      return 'Failed to generate quiz. Please try again.'
    }
  } else {
    if (tone === 'casual') {
      return "Something's not working right. Give it another shot?"
    } else if (tone === 'formal') {
      return 'An error occurred. Please retry your request.'
    } else {
      return 'An error occurred. Please try again.'
    }
  }
}

// Alias for backward compatibility
export const getErrorMessage = getAPIErrorMessage

/**
 * Generate fallback message when certification content fails to load
 * New utility - prevents code duplication
 */
export const getFallbackMessage = (certification: string, profile?: UserProfile): string => {
  const isCasual = profile?.communicationStyle?.tone === 'casual';
  
  if (isCasual) {
    return `Welcome! I'll help you study for ${certification}. What do u wanna learn about?`;
  } else {
    return `Welcome! I'll help you study for ${certification}. What would you like to learn about?`;
  }
};

// 🎯 Generate initial chat message for certification selection
export const getInitialChatMessage = (certification: string): string => {
  return `Great choice! I'll help you study for ${certification}. What would you like to learn about?`
}

// 🎯 Generate completion message for quiz/study sessions
export const getCompletionMessage = (profile: UserProfile, score?: number): string => {
  const isCasual = profile?.communicationStyle?.tone === 'casual'
  
  if (score !== undefined) {
    if (isCasual) {
      return score >= 80 ? 'Nice job! You crushed it! 🎉' : 'Good try! Keep studying and you\'ll get there! 💪'
    } else {
      return score >= 80 ? 'Excellent performance! Well done.' : 'Good effort. Continue studying to improve your results.'
    }
  }
  
  return isCasual ? 'Great session! What\'s next?' : 'Session completed. How would you like to proceed?'
}