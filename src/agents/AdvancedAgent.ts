/**
 * Advanced AI Agent with Emotion, Multilingual, and File Processing
 * Showcases cutting-edge capabilities for hackathon demo
 */

import { BaseAgent, AgentConfig } from './BaseAgent';
import { LLMService } from '../services/LLMService';
import { ConversationTurn } from '../core/VoiceAgent';
import { EmotionService, EmotionAnalysis } from '../services/EmotionService';
import { MultilingualService } from '../services/MultilingualService';
import { LlamaIndexService, QueryResult } from '../services/LlamaIndexService';

export class AdvancedAgent extends BaseAgent {
  private emotionService: EmotionService;
  private multilingualService: MultilingualService;
  private llamaIndexService: LlamaIndexService;

  constructor() {
    const config: AgentConfig = {
      name: 'Advanced AI Assistant',
      description: 'Next-gen AI with emotion recognition, multilingual support, and intelligent file processing',
      systemPrompt: `You are ARIA (Advanced Responsive Intelligence Assistant), a cutting-edge AI with emotional intelligence and multilingual capabilities.

CORE CAPABILITIES:
1. Emotional Intelligence: Recognize and respond to user emotions appropriately
2. Multilingual Support: Communicate in multiple languages naturally
3. Document Intelligence: Process and understand file contents for contextual responses
4. Adaptive Personality: Adjust communication style based on emotional context

RESPONSE GUIDELINES:
- Always acknowledge detected emotions with empathy
- Adapt your tone to match the user's emotional state
- Use information from uploaded documents to provide contextual answers
- Keep responses conversational and under 60 words for voice interaction
- Show cultural sensitivity when switching languages

EMOTIONAL ADAPTATION:
- Joy/Excitement: Be enthusiastic and celebratory
- Sadness: Be gentle, supportive, and understanding
- Anger/Frustration: Be calm, solution-focused, and de-escalating
- Fear/Anxiety: Be reassuring and confidence-building
- Surprise: Share in the amazement and curiosity

Remember: You're showcasing the future of human-AI interaction through emotional intelligence and contextual understanding.`,
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.8,
      maxTokens: 200
    };

    super(config);
    
    this.emotionService = new EmotionService();
    this.multilingualService = new MultilingualService();
    this.llamaIndexService = new LlamaIndexService();
  }

  public async processInput(
    userInput: string,
    conversationHistory: ConversationTurn[],
    llmService: LLMService
  ): Promise<string> {
    try {
      // 1. Analyze emotion
      const emotion = this.emotionService.analyzeEmotion(userInput);
      
      // 2. Detect language
      const language = this.multilingualService.detectLanguage(userInput);
      
      // 3. Query relevant documents
      const documentContext = await this.llamaIndexService.queryDocuments(userInput, 3);
      
      // 4. Build enhanced context
      const enhancedMessages = this.buildEnhancedMessages(
        userInput,
        conversationHistory,
        emotion,
        language.language,
        documentContext
      );

      // 5. Generate response
      const response = await llmService.generateResponse(
        enhancedMessages,
        this.config.model,
        {
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens
        }
      );

      // 6. Add emotional context to response
      const emotionalPrefix = this.emotionService.getEmotionalResponse(emotion);
      const finalResponse = emotionalPrefix ? 
        `${emotionalPrefix} ${response.content}` : 
        response.content;

      // 7. Log analytics
      console.log(`[Advanced Agent] Emotion: ${emotion.primary} (${emotion.confidence.toFixed(2)})`);
      console.log(`[Advanced Agent] Language: ${language.language}`);
      console.log(`[Advanced Agent] Document chunks: ${documentContext.chunks.length}`);

      return finalResponse;
    } catch (error) {
      console.error('Advanced Agent Error:', error);
      return "I apologize, but I'm experiencing some technical difficulties. Let me try to help you in a different way.";
    }
  }

  private buildEnhancedMessages(
    userInput: string,
    conversationHistory: ConversationTurn[],
    emotion: EmotionAnalysis,
    language: string,
    documentContext: QueryResult
  ) {
    const messages = this.buildMessages(userInput, conversationHistory);
    
    // Add emotional context
    const emotionalContext = `
EMOTIONAL CONTEXT:
- Primary emotion: ${emotion.primary} (confidence: ${emotion.confidence.toFixed(2)})
- Emotional valence: ${emotion.valence > 0 ? 'positive' : 'negative'} (${emotion.valence.toFixed(2)})
- Arousal level: ${emotion.arousal > 0.5 ? 'high' : 'low'} (${emotion.arousal.toFixed(2)})

Adapt your response tone accordingly.`;

    // Add document context if available
    const docContext = documentContext.chunks.length > 0 ? `
DOCUMENT CONTEXT:
The user has uploaded documents. Here's relevant information:
${documentContext.context}

Use this information to provide more accurate and contextual responses.` : '';

    // Add language context
    const langContext = language !== 'en' ? `
LANGUAGE CONTEXT:
Detected language: ${language}
Consider responding in the user's preferred language if appropriate.` : '';

    messages.push({
      role: 'system',
      content: `${emotionalContext}${docContext}${langContext}`
    });

    return messages;
  }

  public getEmotionService(): EmotionService {
    return this.emotionService;
  }

  public getMultilingualService(): MultilingualService {
    return this.multilingualService;
  }

  public getLlamaIndexService(): LlamaIndexService {
    return this.llamaIndexService;
  }
}