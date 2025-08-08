// lib/utils/message-utils.ts
// 🔧 Pure utility functions for message formatting (no dependencies)

export interface UserProfile {
  name: string
  communicationStyle: {
    tone: 'casual' | 'formal' | 'friendly'
    complexity: string
  }
  targetCertification: string
  isOnboarded: boolean
}

// 📝 Format message content with proper line breaks and structure
export const formatMessage = (content: string): string => {
  return content
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/\n\n+/g, '\n\n') // Clean up multiple line breaks
}

// 👋 Generate welcome back message based on user profile
export const getWelcomeBackMessage = (profile: UserProfile): string => {
  if (profile.communicationStyle.tone === 'casual') {
    return `Yo ${profile.name}! Welcome back! 🚀\n\nI remember ur style - keeping it ${profile.communicationStyle.tone} and ${profile.communicationStyle.complexity}. Ready to crush some more certs?`
  } else if (profile.communicationStyle.tone === 'formal') {
    return `Welcome back, ${profile.name}.\n\nI have your communication preferences configured for ${profile.communicationStyle.tone} tone with ${profile.communicationStyle.complexity} explanations.\n\nHow may I assist with your certification studies today?`
  } else {
    return `Hey ${profile.name}! Welcome back to your certification study session.\n\nI've got your learning style saved (${profile.communicationStyle.tone} tone, ${profile.communicationStyle.complexity} explanations) and I'm ready to help you master ${profile.targetCertification}!\n\nWhat would you like to work on today?`
  }
}

// 🎓 Generate certification welcome message with official content
export const getCertificationWelcomeMessage = (
  profile: UserProfile, 
  officialContent?: { domains?: Array<{ name: string; weight: string }> }
): string => {
  const certName = profile.targetCertification
  const style = profile.communicationStyle
  
  // Get the official topics from content
  const getOfficialTopics = () => {
    if (!officialContent?.domains) {
      return ["• General certification topics", "• Practice questions", "• Study guidance"]
    }
    
    return officialContent.domains.slice(0, 3).map(domain => 
      `• ${domain.name} (${domain.weight})`
    )
  }

  const topics = getOfficialTopics()
  
  if (style?.tone === 'casual') {
    return `Yo! Welcome to your ${certName} study squad! 🚀

I've loaded all the official Microsoft Learn content for ${certName}, so we're gonna crush this exam together!

I'm ur dedicated ${certName} tutor now - ask me anything about:
${topics.join('\n')}

Ready to get started? What part of ${certName} do u wanna dive into first?`
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

How would you like to begin your ${certName} preparation?`
  } else {
    return `Welcome to your personalized ${certName} study experience!

I've loaded the complete Microsoft Learn content for ${certName} and I'm ready to be your dedicated tutor. Every explanation will be tailored to your communication style.

The ${certName} exam focuses on:
${topics.join('\n')}

Let's start mastering ${certName}! What topic would you like to explore first?`
  }
}

// 💬 Generate error messages based on communication style
export const getErrorMessage = (
  communicationStyle?: { tone: string },
  isLoading?: boolean
): { role: 'assistant'; content: string } => {
  const isCasual = communicationStyle?.tone === 'casual'
  
  return {
    role: 'assistant',
    content: isCasual 
      ? 'Oops! Something went wrong. Try again?' 
      : 'I apologize, but I encountered an error. Please try again.'
  }
}

// 🎯 Generate initial chat message for certification selection
export const getInitialChatMessage = (certification: string): string => {
  return `Great choice! I'll help you study for ${certification}. What would you like to learn about?`
}