/**
 * Base Agent Interface
 * Defines the contract for all LLM agents
 */

import { LLMService, LLMMessage } from '../services/LLMService';
import { ConversationTurn } from '../core/VoiceAgent';

export interface AgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export abstract class BaseAgent {
  protected config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  public abstract processInput(
    userInput: string,
    conversationHistory: ConversationTurn[],
    llmService: LLMService
  ): Promise<string>;

  protected buildMessages(
    userInput: string,
    conversationHistory: ConversationTurn[]
  ): LLMMessage[] {
    const messages: LLMMessage[] = [
      {
        role: 'system',
        content: this.config.systemPrompt
      }
    ];

    // Add conversation history (last 10 turns to avoid token limits)
    const recentHistory = conversationHistory.slice(-10);
    for (const turn of recentHistory) {
      messages.push(
        { role: 'user', content: turn.userInput },
        { role: 'assistant', content: turn.agentResponse }
      );
    }

    // Add current user input
    messages.push({
      role: 'user',
      content: userInput
    });

    return messages;
  }

  public getName(): string {
    return this.config.name;
  }

  public getDescription(): string {
    return this.config.description;
  }
}