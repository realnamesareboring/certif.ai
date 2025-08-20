import React, { useState, useRef, useEffect } from 'react'
import type { ChatMessage, UserProfile, Theme } from '../types'
import { sendMessageToAPI } from '../lib/utils/api-utils'
import { getAPIErrorMessage } from '../lib/utils/message-utils'
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
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
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
      return "Please enter your question about certification topics..."
    } else {
      return "Ask me about your certification..."
    }
  }

  // Send message function with proper error handling
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to chat
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    onMessagesUpdate(newMessages)

    try {
      const response = await sendMessageToAPI(newMessages, userProfile)
      onMessagesUpdate([
        ...newMessages,
        { role: 'assistant' as const, content: response }
      ])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = getAPIErrorMessage(userProfile, 'chat')
      onMessagesUpdate([
        ...newMessages,
        { role: 'assistant' as const, content: errorMessage }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Theme classes for consistent styling  
  const themeClasses = {
    container: theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200',
    messagesArea: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    userMessage: theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
    aiMessage: theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800',
    inputArea: theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white',
    input: theme === 'dark' 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    loadingDots: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
  }

  return (
    <div className={`border rounded-lg ${themeClasses.container}`}>
      {/* Messages Display Area with fixed height and scroll */}
      <div 
        ref={messagesContainerRef}
        className={`max-h-96 overflow-y-auto p-4 space-y-3 ${themeClasses.messagesArea}`}
      >
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
            maxLength={2000}
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