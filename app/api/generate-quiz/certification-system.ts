// 🏗️ MULTI-CERTIFICATION QUIZ SYSTEM ARCHITECTURE

// 1. **Topic Specification Interface** - Standardized structure for all certifications
export interface TopicSpecification {
  focus: string;
  keyTerms: string[];
  scenarios: string[];
  examStyle: string;
  difficulty?: 'fundamental' | 'associate' | 'expert';
  provider?: 'microsoft' | 'aws' | 'gcp';
}

export interface CertificationSpecs {
  [topicName: string]: TopicSpecification;
}

// 2. **Certification Registry** - Maps certification codes to their data
export interface CertificationConfig {
  code: string;
  name: string;
  provider: 'microsoft' | 'aws' | 'gcp';
  level: 'fundamental' | 'associate' | 'expert';
  specsPath: string;
  fallbacksPath?: string;
}

export const CERTIFICATION_REGISTRY: Record<string, CertificationConfig> = {
  'AZ-900': {
    code: 'AZ-900',
    name: 'Azure Fundamentals',
    provider: 'microsoft',
    level: 'fundamental',
    specsPath: '/app/data/quiz-topics/az900-specifications.ts'
  },
  'AZ-104': {
    code: 'AZ-104',
    name: 'Azure Administrator',
    provider: 'microsoft',
    level: 'associate',
    specsPath: '/app/data/quiz-topics/az104-specifications.ts'
  },
  'AWS-CLF': {
    code: 'AWS-CLF',
    name: 'AWS Cloud Practitioner',
    provider: 'aws',
    level: 'fundamental',
    specsPath: '/app/data/quiz-topics/aws-clf-specifications.ts'
  },
  'GCP-ACE': {
    code: 'GCP-ACE',
    name: 'Google Cloud Associate Cloud Engineer',
    provider: 'gcp',
    level: 'associate',
    specsPath: '/app/data/quiz-topics/gcp-ace-specifications.ts'
  }
};

// 3. **Dynamic Topic Loader** - Loads specifications based on certification
export class TopicSpecificationLoader {
  private static cache: Map<string, CertificationSpecs> = new Map();

  static async loadSpecifications(certificationCode: string): Promise<CertificationSpecs> {
    // Check cache first
    if (this.cache.has(certificationCode)) {
      return this.cache.get(certificationCode)!;
    }

    const certConfig = CERTIFICATION_REGISTRY[certificationCode];
    if (!certConfig) {
      throw new Error(`Unsupported certification: ${certificationCode}`);
    }

    try {
      // Dynamic import based on certification
      const specsModule = await this.dynamicImport(certificationCode);
      const specs = this.extractSpecifications(specsModule, certificationCode);
      
      // Cache the loaded specifications
      this.cache.set(certificationCode, specs);
      return specs;
    } catch (error) {
      console.error(`Failed to load specifications for ${certificationCode}:`, error);
      throw new Error(`Could not load topic specifications for ${certificationCode}`);
    }
  }

  private static async dynamicImport(certificationCode: string): Promise<any> {
    switch (certificationCode) {
      case 'AZ-900':
        return await import('../../data/quiz-topics/az900-specifications');
    //   case 'AZ-104':
    //     return await import('../../data/quiz-topics/az104-specifications');
    //   case 'AWS-CLF':
    //     return await import('../../data/quiz-topics/aws-clf-specifications');
    //   case 'GCP-ACE':
    //     return await import('../../data/quiz-topics/gcp-ace-specifications');
      default:
        throw new Error(`No import mapping for certification: ${certificationCode}`);
    }
  }

  private static extractSpecifications(module: any, certCode: string): CertificationSpecs {
    // Try different possible export names
    const possibleExports = [
      `${certCode.replace('-', '')}_TOPIC_SPECIFICATIONS`,
      `${certCode}_TOPIC_SPECIFICATIONS`,
      'TOPIC_SPECIFICATIONS',
      'default'
    ];

    for (const exportName of possibleExports) {
      if (module[exportName]) {
        return module[exportName];
      }
    }

    throw new Error(`Could not find topic specifications in module for ${certCode}`);
  }

  static clearCache(): void {
    this.cache.clear();
  }
}

// 4. **Universal Prompt Generator** - Works with any certification
export class UniversalPromptGenerator {
  static generateTopicPrompt(
    topic: string, 
    certification: string, 
    questionCount: number, 
    topicSpec: TopicSpecification
  ): string {
    const certConfig = CERTIFICATION_REGISTRY[certification];
    const providerName = this.getProviderDisplayName(certConfig?.provider || 'microsoft');
    
    return `You are a ${providerName} certification expert creating ${certification} exam questions.

TOPIC FOCUS: ${topic}
LEARNING OBJECTIVES: ${topicSpec.focus}

KEY TERMS TO INCLUDE: ${topicSpec.keyTerms.join(", ")}
SCENARIO TYPES: ${topicSpec.scenarios.join(", ")}
QUESTION STYLE: ${topicSpec.examStyle}
DIFFICULTY LEVEL: ${topicSpec.difficulty || 'fundamental'}

EXAM REQUIREMENTS:
- Questions must be specific to "${topic}" - NOT generic ${providerName} questions
- Use real-world scenarios that test understanding of this specific topic
- Include terminology and concepts specific to this learning objective
- Mirror actual ${certification} exam difficulty and style
- Focus on practical application, not just definitions

QUESTION TYPES TO INCLUDE:
- Scenario-based: "A company needs to..." situations
- Comparison: "Which option best addresses..." questions  
- Implementation: "To achieve X, you should..." questions
- Troubleshooting: "When Y occurs, the cause is..." questions

CRITICAL: Generate questions that someone studying ONLY "${topic}" would expect to see.
Do NOT generate generic ${providerName} questions that could apply to any section.

Generate exactly ${questionCount} unique, challenging questions in this JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Detailed scenario-based question...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct": 0,
      "explanation": "Detailed explanation...",
      "domain": "${topic}",
      "difficulty": "${topicSpec.difficulty || 'fundamental'}",
      "certification": "${certification}"
    }
  ]
}`;
  }

  private static getProviderDisplayName(provider: string): string {
    const providers = {
      'microsoft': 'Microsoft Azure',
      'aws': 'Amazon AWS', 
      'gcp': 'Google Cloud Platform'
    };
    return providers[provider] || 'Cloud';
  }
}

// 5. **Fallback System Manager** - Universal fallback handling
export class FallbackManager {
  private static fallbackCache: Map<string, any[]> = new Map();

  static async getFallbackQuestions(
    certification: string, 
    topic: string, 
    count: number
  ): Promise<any[]> {
    const cacheKey = `${certification}:${topic}`;
    
    if (this.fallbackCache.has(cacheKey)) {
      return this.fallbackCache.get(cacheKey)!.slice(0, count);
    }

    try {
      // Try to load certification-specific fallbacks
      const fallbacks = await this.loadCertificationFallbacks(certification);
      const topicFallbacks = fallbacks[topic] || this.getGenericFallbacks(certification);
      
      this.fallbackCache.set(cacheKey, topicFallbacks);
      return topicFallbacks.slice(0, count);
    } catch (error) {
      console.warn(`No fallbacks found for ${certification}:${topic}, using generic`);
      return this.getGenericFallbacks(certification).slice(0, count);
    }
  }

//   private static async loadCertificationFallbacks(certification: string): Promise<any> {
//     try {
//       switch (certification) {
//         case 'AZ-900':
//           return (await import('../../data/fallbacks/az900-fallbacks')).AZ900_FALLBACKS;
//         case 'AZ-104':
//           return (await import('../../data/fallbacks/az104-fallbacks')).AZ104_FALLBACKS;
//         case 'AWS-CLF':
//           return (await import('../../data/fallbacks/aws-clf-fallbacks')).AWS_CLF_FALLBACKS;
//         default:
//           throw new Error(`No fallbacks for ${certification}`);
//       }
//     } catch {
//       throw new Error(`Could not load fallbacks for ${certification}`);
//     }
//   }

  private static getGenericFallbacks(certification: string): any[] {
    const certConfig = CERTIFICATION_REGISTRY[certification];
    const provider = certConfig?.provider || 'microsoft';
    
    return [
      {
        question: `What is a key benefit of using ${this.getProviderDisplayName(provider)} cloud services?`,
        options: ["A) Higher costs", "B) Scalability and flexibility", "C) Limited availability", "D) Complex management"],
        correct: 1,
        explanation: "Cloud services provide scalability and flexibility as primary benefits.",
        isGeneric: true
      }
    ];
  }

  private static getProviderDisplayName(provider: string): string {
    const providers = {
      'microsoft': 'Microsoft Azure',
      'aws': 'Amazon AWS', 
      'gcp': 'Google Cloud Platform'
    };
    return providers[provider] || 'Cloud';
  }
}

// 6. **Usage Examples**

// Example: How to use the new system
/*
// In your API route:
const certification = 'AZ-104'; // or 'AWS-CLF', 'GCP-ACE', etc.
const topic = 'Manage Azure identities and governance';

// Load specifications dynamically
const specs = await TopicSpecificationLoader.loadSpecifications(certification);
const topicSpec = specs[topic];

if (!topicSpec) {
  // Use fallback system
  const fallbackQuestions = await FallbackManager.getFallbackQuestions(
    certification, 
    topic, 
    questionCount
  );
  return fallbackQuestions;
}

// Generate certification-specific prompt
const prompt = UniversalPromptGenerator.generateTopicPrompt(
  topic, 
  certification, 
  questionCount, 
  topicSpec
);

// Use prompt with OpenAI...
*/