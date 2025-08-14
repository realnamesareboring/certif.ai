import React, { useState, useRef, useEffect } from 'react'
import type { ChatMessage, UserProfile, Theme } from '../types'
import { sendMessageToAPI, getAPIErrorMessage } from '../lib/utils/api-utils'
import { getErrorMessage } from '../lib/utils/message-utils'
import { formatMessageContent } from '../lib/utils/ui-utils'

interface ChatInterfaceProps {
  theme: Theme
  userProfile: UserProfile | null
  messages: ChatMessage[]
  onMessagesUpdate: (messages: ChatMessage[]) => void
  placeholder?: string
  disabled?: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  theme,
  userProfile,
  messages,
  onMessagesUpdate,
  placeholder,
  disabled = false
}) => {
  // State management
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Refs for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-focus input when component mounts
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus()
    }
  }, [disabled])

  // Format message content with proper styling
  const formatMessage = (content: string) => {
    const formattedContent = formatMessageContent(content)
    
    return formattedContent.map((item, index) => {
      if (item.type === 'break') {
        return <br key={item.key} />
      } else if (item.type === 'option') {
        return (
          <div key={item.key} className={item.className}>
            {item.content}
          </div>
        )
      } else {
        return (
          <div key={item.key} className={item.className}>
            {item.content}
          </div>
        )
      }
    })
  }

  // Handle keyboard events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Generate context-aware placeholder text
  const getPlaceholder = (): string => {
    if (placeholder) return placeholder
    
    if (userProfile?.communicationStyle?.tone === 'casual') {
      return "Ask me anything about cloud stuff..."
    } else if (userProfile?.communicationStyle?.tone === 'formal') {
      return "Please ask your cloud certification question..."
    } else {
      return "Ask me about cloud certifications..."
    }
  }

  // Main message sending logic
  const sendMessage = async () => {
    if (!input.trim() || isLoading || disabled) return

    // Create user message
    const userMessage: ChatMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    
    // Update UI immediately
    onMessagesUpdate(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Send to API using existing utility
      const aiResponse = await sendMessageToAPI(newMessages, userProfile)
      
      // Add AI response
      const aiMessage: ChatMessage = { role: 'assistant', content: aiResponse }
      onMessagesUpdate([...newMessages, aiMessage])

    } catch (error) {
      console.error('Chat error:', error)
      
      // Generate appropriate error message based on user's communication style
      const errorContent = userProfile 
        ? getErrorMessage(userProfile, 'chat')
        : 'I apologize, but I encountered an error. Please try again.'
      
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: errorContent
      }
      
      onMessagesUpdate([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
      // Re-focus input for better UX
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }

  // Get theme-appropriate styling classes
  const getThemeClasses = () => ({
    container: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    messagesArea: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    userMessage: 'bg-blue-500 text-white',
    aiMessage: theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800',
    inputArea: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900',
    loadingDots: theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
  })

  const themeClasses = getThemeClasses()

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${themeClasses.container}`}>
      {/* Messages Area */}
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
                  ? themeClasses.userMessage
                  : themeClasses.aiMessage
              }`}
            >
              <div className="text-sm leading-relaxed">
                {formatMessage(message.content)}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading Animation */}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-lg ${themeClasses.loadingDots}`}>
              <div className="flex space-x-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div 
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                  style={{animationDelay: '0.1s'}}
                ></div>
                <div 
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                  style={{animationDelay: '0.2s'}}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`border-t p-4 ${themeClasses.inputArea}`}>
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            className={`flex-1 border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
            rows={2}
            disabled={isLoading || disabled}
            maxLength={2000} // Prevent overly long messages
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || disabled}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors min-w-[80px]"
            title={isLoading ? 'Sending...' : 'Send message'}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>
        
        {/* Optional character count for long messages */}
        {input.length > 1500 && (
          <div className={`text-xs mt-1 text-right ${
            input.length > 1900 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {input.length}/2000
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInterface