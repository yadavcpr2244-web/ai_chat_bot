/**
 * Speech-to-Text Service
 * Handles real-time speech recognition using Web Speech API
 */

import { EventEmitter } from '../utils/EventEmitter';
import { SpeechRecognition, SpeechRecognitionInit, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../utils/types';

export class STTService extends EventEmitter {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private shouldKeepListening: boolean = false;
  private isStarting: boolean = false;

  constructor(options?: SpeechRecognitionInit) {
    super();
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionConstructor() as SpeechRecognition;

    this.setupRecognition(options);
  }

  private setupRecognition(options?: SpeechRecognitionInit): void {
    if (!this.recognition) return;

    // Default configuration
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Apply custom options
    if (options) {
      Object.assign(this.recognition, options);
    }

    // Event listeners
    this.recognition.onstart = () => {
      this.isListening = true;
      this.isStarting = false;
      this.emit('speechStart');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.isStarting = false;
      this.emit('speechEnd');
      
      // Auto-restart if we should keep listening
      if (this.shouldKeepListening && this.recognition && !this.isStarting) {
        this.isStarting = true;
        setTimeout(() => {
          if (this.shouldKeepListening && this.recognition && !this.isListening) {
            try {
              this.recognition.start();
            } catch (error) {
              this.isStarting = false;
              console.log('Auto-restart failed, retrying...', error);
              setTimeout(() => {
                if (this.shouldKeepListening && this.recognition && !this.isListening) {
                  try {
                    this.recognition.start();
                  } catch (retryError) {
                    this.isStarting = false;
                    this.emit('error', retryError as Error);
                  }
                }
              }, 200);
            }
          } else {
            this.isStarting = false;
          }
        }, 100); // Small delay to prevent rapid restarts
      }
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.emit('transcription', finalTranscript.trim());
      }

      if (interimTranscript) {
        this.emit('interimTranscription', interimTranscript.trim());
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.emit('error', new Error(`Speech recognition error: ${event.error}`));
    };

    this.recognition.onnomatch = () => {
      this.emit('error', new Error('No speech was recognized'));
    };
  }

  public startListening(): void {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    // If already listening or starting, don't start again
    if (this.isListening || this.isStarting) {
      return;
    }

    // Stop any existing recognition first
    this.shouldKeepListening = true;
    this.isStarting = true;
    
    try {
      this.recognition.start();
    } catch (error) {
      this.isStarting = false;
      console.log('Recognition start error, retrying...', error);
      // Retry after a short delay if it fails
      setTimeout(() => {
        if (this.shouldKeepListening && this.recognition && !this.isListening && !this.isStarting) {
          this.isStarting = true;
          try {
            this.recognition.start();
          } catch (retryError) {
            this.isStarting = false;
            this.emit('error', retryError as Error);
          }
        }
      }, 100);
    }
  }

  public stopListening(): void {
    this.shouldKeepListening = false;
    this.isStarting = false;
    
    if (this.recognition) {
      try {
        if (this.isListening) {
          this.recognition.stop();
        }
      } catch (error) {
        console.log('Error stopping recognition:', error);
      }
    }
  }

  public isCurrentlyListening(): boolean {
    return this.isListening || this.isStarting;
  }

  public getState(): { isListening: boolean; shouldKeepListening: boolean; isStarting: boolean } {
    return {
      isListening: this.isListening,
      shouldKeepListening: this.shouldKeepListening,
      isStarting: this.isStarting
    };
  }

  public destroy(): void {
    if (this.recognition) {
      this.stopListening();
      this.recognition = null;
    }
    this.removeAllListeners();
  }
}