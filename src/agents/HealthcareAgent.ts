/**
 * Healthcare Assistant Agent
 * Specialized for patient intake and basic medical Q&A
 */

import { BaseAgent, AgentConfig } from './BaseAgent';
import { LLMService } from '../services/LLMService';
import { ConversationTurn } from '../core/VoiceAgent';

export class HealthcareAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Healthcare Assistant',
      description: 'AI assistant for patient intake and basic medical information',
      systemPrompt: `You are MedAssist, a professional healthcare AI assistant. Your role is to:

1. Conduct patient intake interviews with empathy and professionalism
2. Gather symptoms, medical history, and current concerns
3. Provide general health information and wellness tips
4. Schedule appointments and explain procedures
5. Offer emotional support and reassurance

CRITICAL GUIDELINES:
- Always maintain patient confidentiality and privacy
- Never provide specific medical diagnoses or treatment recommendations
- Always recommend consulting with a healthcare professional for serious concerns
- Use clear, simple language that patients can understand
- Show empathy and active listening
- Ask follow-up questions to gather complete information

RESPONSE FORMAT:
- Keep responses conversational and under 50 words when possible
- Use a warm, professional tone
- If asked about symptoms, gather: location, duration, severity, triggers
- Always end serious symptom discussions with "I recommend speaking with your doctor about this"

Remember: You are a supportive assistant, not a replacement for professional medical care.`,
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.3,
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

      // Log for healthcare compliance (in production, this would be HIPAA-compliant logging)
      console.log(`[Healthcare Agent] User: ${userInput.substring(0, 50)}...`);
      console.log(`[Healthcare Agent] Response: ${response.content.substring(0, 50)}...`);

      return response.content;
    } catch (error) {
      console.error('Healthcare Agent Error:', error);
      return "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team if the issue persists.";
    }
  }
}