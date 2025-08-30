/**
 * Emotion Recognition Service
 * Analyzes text for emotional content and adjusts responses accordingly
 */

import { EventEmitter } from '../utils/EventEmitter';

export interface EmotionAnalysis {
  primary: string;
  confidence: number;
  emotions: Record<string, number>;
  valence: number; // -1 (negative) to 1 (positive)
  arousal: number; // 0 (calm) to 1 (excited)
}

export class EmotionService extends EventEmitter {
  private emotionKeywords = {
    joy: ['happy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'perfect'],
    sadness: ['sad', 'disappointed', 'upset', 'down', 'depressed', 'terrible', 'awful'],
    anger: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', 'stupid'],
    fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'terrified'],
    surprise: ['wow', 'amazing', 'incredible', 'unbelievable', 'shocking'],
    disgust: ['gross', 'disgusting', 'awful', 'terrible', 'horrible']
  };

  public analyzeEmotion(text: string): EmotionAnalysis {
    const words = text.toLowerCase().split(/\s+/);
    const emotions: Record<string, number> = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0
    };

    // Count emotional keywords
    for (const word of words) {
      for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
        if (keywords.some(keyword => word.includes(keyword))) {
          emotions[emotion] += 1;
        }
      }
    }

    // Normalize scores
    const totalWords = words.length;
    for (const emotion in emotions) {
      emotions[emotion] = emotions[emotion] / totalWords;
    }

    // Find primary emotion
    const primary = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    )[0];

    const confidence = emotions[primary];

    // Calculate valence and arousal
    const valence = emotions.joy + emotions.surprise - emotions.sadness - emotions.anger - emotions.disgust;
    const arousal = emotions.anger + emotions.fear + emotions.surprise - emotions.sadness;

    return {
      primary,
      confidence,
      emotions,
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal))
    };
  }

  public getEmotionalResponse(emotion: EmotionAnalysis): string {
    const responses = {
      joy: "I can sense your enthusiasm! That's wonderful to hear.",
      sadness: "I understand this might be difficult. I'm here to help.",
      anger: "I can hear your frustration. Let me see how I can assist you better.",
      fear: "I understand your concerns. Let's work through this together.",
      surprise: "That does sound quite remarkable!",
      disgust: "I can sense your displeasure. Let me help address this."
    };

    return responses[emotion.primary as keyof typeof responses] || '';
  }
}