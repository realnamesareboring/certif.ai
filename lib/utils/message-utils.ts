// lib/utils/message-utils.ts
// Ultra-safe message utility extraction from page.tsx
// Following the proven pattern from quiz-utils.ts

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

How would you like to begin your ${certName} preparation?`;
  } else {
    return `Welcome to your personalized ${certName} study experience!

I've loaded the complete Microsoft Learn content for ${certName} and I'm ready to be your dedicated tutor. Every explanation will be tailored to your communication style.

The ${certName} exam focuses on:
${topics.join('\n')}

Let's start mastering ${certName}! What topic would you like to explore first?`;
  }
};

/**
 * Generate completion message for onboarding flow
 * Extracted from page.tsx - ~15 lines saved
 */
export const getCompletionMessage = (profile: UserProfile): string => {
  const style = profile.communicationStyle;
  
  if (style.tone === 'casual') {
    return `Awesome ${profile.name}! 🎯\n\nI can tell you're pretty ${style.tone} and like ${style.complexity} explanations with lots of ${style.explanationStyle}.\n\nI'm gonna match your vibe from now on - no boring formal stuff! Ready to crush some cloud certs? I can help with:\n\n• AI coaching (ask me anything!)\n• Practice quizzes (I'll generate fresh questions)\n\nWhat sounds good?`;
  } else if (style.tone === 'formal') {
    return `Excellent, ${profile.name}.\n\nI have analyzed your communication style:\n\n• Tone: Professional and ${style.tone}\n• Complexity: ${style.complexity} explanations\n• Learning: ${style.explanationStyle}-based instruction\n• Format: ${style.learningPreference} presentation\n\nI will adapt all responses accordingly. Please select your preferred study method:\n\n1. AI Coaching Sessions\n2. Practice Quiz Generation\n\nHow would you like to proceed?`;
  } else {
    return `Perfect ${profile.name}!\n\nI've learned your style - you like ${style.complexity} explanations delivered through ${style.explanationStyle}. I'll keep things ${style.tone} but informative.\n\nReady to start? I can help with:\n\n→ AI coaching and explanations\n→ Custom practice quizzes\n\nWhat interests you most?`;
  }
};

/**
 * Generate standardized error messages based on communication style
 * Extracted from page.tsx error patterns - ~5 lines saved
 */
export const getErrorMessage = (profile?: UserProfile, context: 'chat' | 'quiz' | 'general' = 'general'): string => {
  const isCasual = profile?.communicationStyle?.tone === 'casual';
  const isFormal = profile?.communicationStyle?.tone === 'formal';
  
  if (context === 'chat') {
    if (isCasual) {
      return 'Oops! Something went wrong. Try again?';
    } else if (isFormal) {
      return 'I apologize, but I encountered an error. Please try again.';
    } else {
      return 'Sorry, something went wrong. Please try again.';
    }
  } else if (context === 'quiz') {
    if (isCasual) {
      return "Uh oh! Quiz didn't load. Want me to try again?";
    } else if (isFormal) {
      return 'Quiz generation failed. Would you like to retry?';
    } else {
      return 'Failed to generate quiz. Please try again.';
    }
  } else {
    if (isCasual) {
      return "Something's not working right. Give it another shot?";
    } else if (isFormal) {
      return 'An error occurred. Please retry your request.';
    } else {
      return 'An error occurred. Please try again.';
    }
  }
};

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