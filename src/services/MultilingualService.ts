/**
 * Multilingual Support Service
 * Handles language detection and translation
 */

import { EventEmitter } from '../utils/EventEmitter';

export interface LanguageDetection {
  language: string;
  confidence: number;
  supportedLanguages: string[];
}

export class MultilingualService extends EventEmitter {
  private supportedLanguages = {
    'en': { name: 'English', voice: 'en-US' },
    'es': { name: 'Spanish', voice: 'es-ES' },
    'fr': { name: 'French', voice: 'fr-FR' },
    'de': { name: 'German', voice: 'de-DE' },
    'it': { name: 'Italian', voice: 'it-IT' },
    'pt': { name: 'Portuguese', voice: 'pt-BR' },
    'ru': { name: 'Russian', voice: 'ru-RU' },
    'ja': { name: 'Japanese', voice: 'ja-JP' },
    'ko': { name: 'Korean', voice: 'ko-KR' },
    'zh': { name: 'Chinese', voice: 'zh-CN' }
  };

  private languagePatterns = {
    'en': /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/gi,
    'es': /\b(el|la|los|las|y|o|pero|en|de|con|por|para)\b/gi,
    'fr': /\b(le|la|les|et|ou|mais|dans|de|avec|par|pour)\b/gi,
    'de': /\b(der|die|das|und|oder|aber|in|von|mit|für)\b/gi,
    'it': /\b(il|la|gli|le|e|o|ma|in|di|con|per)\b/gi,
    'pt': /\b(o|a|os|as|e|ou|mas|em|de|com|por|para)\b/gi,
    'ru': /\b(и|или|но|в|на|с|для|от|до|по)\b/gi,
    'ja': /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g,
    'ko': /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/g,
    'zh': /[\u4E00-\u9FFF]/g
  };

  public detectLanguage(text: string): LanguageDetection {
    const scores: Record<string, number> = {};
    
    for (const [lang, pattern] of Object.entries(this.languagePatterns)) {
      const matches = text.match(pattern);
      scores[lang] = matches ? matches.length / text.length : 0;
    }

    const detectedLang = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];

    return {
      language: detectedLang,
      confidence: scores[detectedLang],
      supportedLanguages: Object.keys(this.supportedLanguages)
    };
  }

  public async translateText(text: string, targetLang: string): Promise<string> {
    // In production, integrate with Google Translate API or similar
    // For demo purposes, return formatted response
    if (targetLang === 'en') return text;
    
    return `[Translated to ${this.supportedLanguages[targetLang as keyof typeof this.supportedLanguages]?.name || targetLang}] ${text}`;
  }

  public getVoiceForLanguage(language: string): string {
    return this.supportedLanguages[language as keyof typeof this.supportedLanguages]?.voice || 'en-US';
  }

  public getSupportedLanguages(): Record<string, { name: string; voice: string }> {
    return this.supportedLanguages;
  }
}