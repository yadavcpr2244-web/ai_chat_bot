/**
 * Text-to-Speech Service
 * Handles speech synthesis using Web Speech API
 */

import { EventEmitter } from '../utils/EventEmitter';

export interface TTSConfig {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class TTSService extends EventEmitter {
  private synthesis: SpeechSynthesis;
  private config: TTSConfig;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(config: TTSConfig = {}) {
    super();
    
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    this.synthesis = window.speechSynthesis;
    this.config = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      ...config
    };
  }

  public async speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Apply configuration
      if (this.config.voice) {
        utterance.voice = this.config.voice;
      }
      utterance.rate = this.config.rate || 1.0;
      utterance.pitch = this.config.pitch || 1.0;
      utterance.volume = this.config.volume || 1.0;

      // Event listeners
      utterance.onstart = () => {
        this.emit('speechStart');
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.emit('speechEnd');
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        const error = new Error(`Speech synthesis error: ${event.error}`);
        this.emit('error', error);
        reject(error);
      };

      utterance.onpause = () => {
        this.emit('speechPause');
      };

      utterance.onresume = () => {
        this.emit('speechResume');
      };

      // Start speaking
      this.synthesis.speak(utterance);
    });
  }

  public stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  public setVoice(voice: SpeechSynthesisVoice): void {
    this.config.voice = voice;
  }

  public setRate(rate: number): void {
    this.config.rate = Math.max(0.1, Math.min(10, rate));
  }

  public setPitch(pitch: number): void {
    this.config.pitch = Math.max(0, Math.min(2, pitch));
  }

  public setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }

  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  public destroy(): void {
    this.stop();
    this.removeAllListeners();
  }
}