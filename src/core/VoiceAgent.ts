/**
 * Core Voice Agent Framework
 * Orchestrates the STT → LLM → TTS pipeline
 */

import { STTService } from '../services/STTService';
import { TTSService, TTSConfig } from '../services/TTSService';
import { LLMService } from '../services/LLMService';
import { BaseAgent } from '../agents/BaseAgent';
import { EventEmitter } from '../utils/EventEmitter';
import { SpeechRecognitionInit } from '../utils/types';

export interface VoiceAgentConfig {
  apiKey: string;
  agent: BaseAgent;
  sttOptions?: SpeechRecognitionInit;
  ttsOptions?: TTSConfig;
}

export interface ConversationTurn {
  id: string;
  timestamp: Date;
  userInput: string;
  agentResponse: string;
  latency: {
    stt: number;
    llm: number;
    tts: number;
    total: number;
  };
}

export class VoiceAgent extends EventEmitter {
  private sttService: STTService;
  private ttsService: TTSService;
  private llmService: LLMService;
  private agent: BaseAgent;
  private conversationHistory: ConversationTurn[] = [];
  private currentTurnId: string | null = null;
  private startTime: number = 0;
  private latencyTracker: Record<string, number> = {};
  private lastUserInput: string = '';
  private lastAgentResponse: string = '';

  constructor(config: VoiceAgentConfig) {
    super();
    
    this.agent = config.agent;
    this.sttService = new STTService(config.sttOptions);
    this.ttsService = new TTSService(config.ttsOptions);
    this.llmService = new LLMService(config.apiKey);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // STT Events
    this.sttService.on('speechStart', () => {
      // Only create a new turn if we don't have one active
      if (!this.currentTurnId) {
        this.currentTurnId = this.generateTurnId();
        this.startTime = Date.now();
        this.emit('speechStart', { turnId: this.currentTurnId });
      }
    });

    this.sttService.on('speechEnd', () => {
      if (this.currentTurnId) {
        this.latencyTracker.stt = Date.now() - this.startTime;
        this.emit('speechEnd', { turnId: this.currentTurnId });
      }
    });

    this.sttService.on('transcription', async (text: string) => {
      // Create a new turn if we don't have one (in case speechStart wasn't fired)
      if (!this.currentTurnId) {
        this.currentTurnId = this.generateTurnId();
        this.startTime = Date.now();
        this.emit('speechStart', { turnId: this.currentTurnId });
      }
      this.emit('transcriptionReceived', { turnId: this.currentTurnId, text });
      await this.processTranscription(text);
    });

    this.sttService.on('error', (error: Error) => {
      this.emit('error', { type: 'stt', error, turnId: this.currentTurnId });
    });

    // TTS Events
    this.ttsService.on('speechStart', () => {
      this.emit('speechOutputStart', { turnId: this.currentTurnId });
    });

    this.ttsService.on('speechEnd', () => {
      if (this.currentTurnId) {
        this.latencyTracker.tts = Date.now() - this.startTime;
        this.latencyTracker.total = Date.now() - this.startTime;
        
        // Finalize the current turn
        const turn: ConversationTurn = {
          id: this.currentTurnId,
          timestamp: new Date(this.startTime),
          userInput: this.lastUserInput,
          agentResponse: this.lastAgentResponse,
          latency: {
            stt: this.latencyTracker.stt || 0,
            llm: this.latencyTracker.llm || 0,
            tts: this.latencyTracker.tts || 0,
            total: this.latencyTracker.total || 0
          }
        };

        this.conversationHistory.push(turn);
        this.emit('turnCompleted', { turn });
        this.emit('speechOutputEnd', { turnId: this.currentTurnId });
        
        // Reset for next turn
        this.currentTurnId = null;
        this.latencyTracker = {};
        this.lastUserInput = '';
        this.lastAgentResponse = '';
      }
    });
  }

  private async processTranscription(text: string): Promise<void> {
    if (!this.currentTurnId) return;

    try {
      this.emit('llmProcessingStart', { turnId: this.currentTurnId });
      this.lastUserInput = text;
      const llmStartTime = Date.now();
      const response = await this.agent.processInput(
        text, 
        this.conversationHistory,
        this.llmService
      );
      this.latencyTracker.llm = Date.now() - llmStartTime;
      this.lastAgentResponse = response;

      this.emit('llmProcessingEnd', { 
        turnId: this.currentTurnId, 
        response 
      });

      await this.ttsService.speak(response);
    } catch (error) {
      this.emit('error', { 
        type: 'llm', 
        error: error as Error, 
        turnId: this.currentTurnId 
      });
    }
  }

  public startListening(): void {
    this.sttService.startListening();
  }

  public stopListening(): void {
    this.sttService.stopListening();
  }

  public getConversationHistory(): ConversationTurn[] {
    return [...this.conversationHistory];
  }

  public getLatencyStats(): Record<string, number> {
    if (this.conversationHistory.length === 0) return {};
    
    const totalTurns = this.conversationHistory.length;
    const avgLatency = {
      stt: this.conversationHistory.reduce((sum, turn) => sum + turn.latency.stt, 0) / totalTurns,
      llm: this.conversationHistory.reduce((sum, turn) => sum + turn.latency.llm, 0) / totalTurns,
      tts: this.conversationHistory.reduce((sum, turn) => sum + turn.latency.tts, 0) / totalTurns,
      total: this.conversationHistory.reduce((sum, turn) => sum + turn.latency.total, 0) / totalTurns
    };

    return avgLatency;
  }

  public clearHistory(): void {
    this.conversationHistory = [];
    this.emit('historyCleared');
  }

  private generateTurnId(): string {
    return `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public destroy(): void {
    this.sttService.destroy();
    this.ttsService.destroy();
    this.removeAllListeners();
  }
}