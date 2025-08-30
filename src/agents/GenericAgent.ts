/**
 * Generic Conversational Agent
 * General-purpose agent for open-domain conversations
 */

import { BaseAgent, AgentConfig } from './BaseAgent';
import { LLMService } from '../services/LLMService';
import { ConversationTurn } from '../core/VoiceAgent';

export class GenericAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'General Assistant',
      description: 'AI assistant for general conversations and questions',
      systemPrompt: `You are a helpful, knowledgeable AI assistant designed for voice conversations. Your role is to:

1. Engage in natural, flowing conversations
2. Answer questions across a wide range of topics
3. Provide helpful information and explanations
4. Maintain a friendly, approachable personality
5. Keep responses conversational and concise for voice interaction

CONVERSATION GUIDELINES:
- Respond naturally as if speaking to a friend
- Keep answers concise (under 50 words for simple questions)
- Use everyday language, avoid technical jargon
- Ask follow-up questions to keep conversations engaging
- Show curiosity about the user's interests and needs

VOICE-SPECIFIC ADAPTATIONS:
- Avoid long lists or complex formatting
- Use verbal cues like "First," "Also," "Finally" instead of bullet points
- Spell out numbers and abbreviations when clarity is important
- Pause naturally with commas and periods
- Confirm understanding when discussing complex topics

Remember: This is a voice conversation, so prioritize clarity and natural flow over detailed explanations.`,
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.7,
      maxTokens: 150
    };

    super(config);
  }

  public async processInput(
    userInput: string,
    conversationHistory: ConversationTurn[],
    llmService: LLMService
  ): Promise<string> {
    const messages = this.buildMessages(userInput, conversationHistory);
    
    try {
      const response = await llmService.generateResponse(
        messages,
        this.config.model,
        {
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens
        }
      );

      // Log for analytics
      console.log(`[Generic Agent] User: ${userInput.substring(0, 50)}...`);
      console.log(`[Generic Agent] Response: ${response.content.substring(0, 50)}...`);

      return response.content;
    } catch (error) {
      console.error('Generic Agent Error:', error);
      return "I apologize, but I'm having trouble processing your request right now. Could you please try rephrasing that?";
    }
  }
}