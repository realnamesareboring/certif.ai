// lib/cloudFilter.ts
// Conversation-context based filtering

// Core cloud terms for initial topic detection
const CLOUD_TOPICS = [
  // Cloud Services
  "ec2", "s3", "lambda", "dynamodb", "rds", "cloudformation", "cloudwatch",
  "iam", "vpc", "route 53", "cloudfront", "sns", "sqs", "kinesis", "redshift",
  "snowball", "api gateway", "sagemaker", "fargate", "ecs", "eks", "elasticache",
  
  // Azure Services  
  "vm", "virtual machine", "app service", "functions", "logic apps", "storage account",
  "blob storage", "sql database", "cosmos db", "active directory", "key vault",
  "kubernetes service", "aks", "container instances", "redis cache",
  
  // GCP Services
  "compute engine", "app engine", "cloud run", "cloud functions", "cloud storage",
  "bigquery", "dataflow", "dataproc", "cloud sql", "firestore", "gke",
  
  // General Cloud Technologies
  "redis", "container", "docker", "kubernetes", "serverless", "microservices",
  "database", "sql", "nosql", "api", "load balancer", "cdn", "monitoring",
  "backup", "security", "encryption", "authentication", "scaling",
  
  // Cloud Providers & Concepts
  "azure", "aws", "gcp", "google cloud", "amazon web services", "microsoft",
  "cloud", "iaas", "paas", "saas", "region", "availability zone",
  
  // Certifications
  "certification", "exam", "az-", "saa-", "clf-", "cdl", "ace", "sc-",
  "study", "practice", "training", "course", "cert"
]

// Obvious non-cloud conversation starters (only for NEW conversations)
const NON_CLOUD_STARTERS = [
  'weather', 'cooking', 'recipe', 'sports', 'game', 'politics', 'news',
  'movie', 'music', 'restaurant', 'food', 'dating', 'relationship',
  'birthday', 'party', 'vacation', 'travel', 'shopping', 'clothes',
  'medicine', 'health', 'doctor', 'joke', 'funny', 'story',
  'time', 'date', 'calendar', 'schedule'
]

// Conversation state management
interface ConversationState {
  isCloudConversation: boolean
  lastCloudTopicTime: number
  currentTopic: string | null
}

// Simple in-memory state (in production, you might use Redis or session storage)
let conversationState: ConversationState = {
  isCloudConversation: false,
  lastCloudTopicTime: 0,
  currentTopic: null
}

const CONVERSATION_TIMEOUT = 10 * 60 * 1000 // 10 minutes

export const isCloudRelated = (message: string): boolean => {
  const lowerMessage = message.toLowerCase()
  const now = Date.now()
  
  console.log('🔍 Checking message:', message)
  console.log('📋 Current conversation state:', conversationState)
  
  // Check if conversation has timed out
  if (now - conversationState.lastCloudTopicTime > CONVERSATION_TIMEOUT) {
    conversationState.isCloudConversation = false
    conversationState.currentTopic = null
    console.log('⏰ Conversation timeout - resetting cloud context')
  }
  
  // If we're already in a cloud conversation, allow ALL follow-up questions
  if (conversationState.isCloudConversation) {
    console.log('✅ ALLOWED - Already in cloud conversation mode')
    conversationState.lastCloudTopicTime = now // Extend the conversation
    return true
  }
  
  // Check if this is a new conversation starter that's obviously non-cloud
  const isNonCloudStarter = NON_CLOUD_STARTERS.some(term => 
    lowerMessage.includes(term)
  )
  
  if (isNonCloudStarter) {
    console.log('❌ BLOCKED - Non-cloud conversation starter')
    return false
  }
  
  // Check if this message contains cloud topics (for NEW conversations)
  const matchedTopic = CLOUD_TOPICS.find(topic => 
    lowerMessage.includes(topic.toLowerCase())
  )
  
  if (matchedTopic) {
    // Start cloud conversation mode
    conversationState.isCloudConversation = true
    conversationState.lastCloudTopicTime = now
    conversationState.currentTopic = matchedTopic
    
    console.log('✅ ALLOWED - Cloud topic detected, entering cloud conversation mode')
    console.log('🎯 Topic:', matchedTopic)
    return true
  }
  
  // If no clear cloud topic and not in cloud conversation, block
  console.log('❌ BLOCKED - No cloud topic detected in new conversation')
  return false
}

// Helper function to get current conversation topic
export const getCurrentCloudTopic = (): string | null => {
  return conversationState.currentTopic
}

// Helper function to reset conversation (for testing or explicit topic changes)
export const resetConversation = (): void => {
  conversationState = {
    isCloudConversation: false,
    lastCloudTopicTime: 0,
    currentTopic: null
  }
  console.log('🔄 Conversation reset')
}

// Helper function to check if in cloud conversation mode
export const isInCloudMode = (): boolean => {
  const now = Date.now()
  if (now - conversationState.lastCloudTopicTime > CONVERSATION_TIMEOUT) {
    conversationState.isCloudConversation = false
    return false
  }
  return conversationState.isCloudConversation
}

// For debugging/logging
export const getConversationState = () => conversationState