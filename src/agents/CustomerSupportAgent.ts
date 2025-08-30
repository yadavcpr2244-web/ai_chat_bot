/**
 * Customer Support Agent
 * Specialized for customer service inquiries and issue resolution
 */

import { BaseAgent, AgentConfig } from './BaseAgent';
import { LLMService } from '../services/LLMService';
import { ConversationTurn } from '../core/VoiceAgent';

export class CustomerSupportAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Customer Support Agent',
      description: 'AI assistant for customer service and technical support',
      systemPrompt: `You are SupportBot, a professional customer service AI assistant. Your role is to:

1. Resolve customer inquiries and technical issues efficiently
2. Provide product information and troubleshooting guidance  
3. Handle billing questions and account management
4. Escalate complex issues to human agents when necessary
5. Maintain a helpful, solution-oriented approach

CRITICAL GUIDELINES:
- Always be polite, professional, and solution-focused
- Acknowledge customer frustration with empathy
- Provide clear, step-by-step instructions for technical issues
- Know when to escalate to human agents (complex billing, legal issues, severe technical problems)
- Ask clarifying questions to understand the exact issue
- Offer multiple solutions when possible

RESPONSE FORMAT:
- Keep responses concise and actionable (under 60 words when possible)
- Use bullet points for multi-step instructions
- Always confirm understanding before providing solutions
- End with "Is there anything else I can help you with today?" when appropriate

ESCALATION TRIGGERS:
- Billing disputes over $100
- Legal or compliance issues
- Technical problems requiring system access
- Angry customers who specifically request human support

Remember: Your goal is customer satisfaction and issue resolution.`,
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.2,
      maxTokens: 200
    };

    super(config);
  }

  public async processInput(
    userInput: string,
    conversationHistory: ConversationTurn[],
    llmService: LLMService
  ): Promise<string> {
    const messages = this.buildMessages(userInput, conversationHistory);
    
    // Add context about common customer service scenarios
    const enhancedMessages = [
      ...messages,
      {
        role: 'system' as const,
        content: `Context: You have access to common solutions for:
        - Password resets and account lockouts
        - Billing inquiries and payment issues
        - Product setup and configuration
        - Technical troubleshooting
        - Returns and refunds
        - Service outages and connectivity issues`
      }
    ];

    try {
      const response = await llmService.generateResponse(
        enhancedMessages,
        this.config.model,
        {
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens
        }
      );

      // Check for escalation keywords
      const escalationKeywords = ['human agent', 'supervisor', 'manager', 'escalate', 'legal'];
      const shouldEscalate = escalationKeywords.some(keyword => 
        userInput.toLowerCase().includes(keyword)
      );

      if (shouldEscalate) {
        return response.content + "\n\nI'll connect you with a human agent who can better assist with this request.";
      }

      // Log for customer service analytics
      console.log(`[Support Agent] User: ${userInput.substring(0, 50)}...`);
      console.log(`[Support Agent] Response: ${response.content.substring(0, 50)}...`);

      return response.content;
    } catch (error) {
      console.error('Customer Support Agent Error:', error);
      return "I apologize for the technical difficulty. Let me connect you with a human agent who can assist you right away.";
    }
  }
}