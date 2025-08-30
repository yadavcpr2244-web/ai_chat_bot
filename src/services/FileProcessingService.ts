/**
 * File Processing Service
 * Handles file reading and intelligent content extraction
 */

import { EventEmitter } from '../utils/EventEmitter';

export interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  metadata: Record<string, any>;
  processedAt: Date;
}

export class FileProcessingService extends EventEmitter {
  private processedFiles: Map<string, ProcessedFile> = new Map();

  public async processFile(file: File): Promise<ProcessedFile> {
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      let content = '';
      
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        content = await this.readTextFile(file);
      } else if (file.type === 'application/json') {
        content = await this.readJsonFile(file);
      } else if (file.type === 'text/csv') {
        content = await this.readCsvFile(file);
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      const processedFile: ProcessedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        content,
        metadata: {
          wordCount: content.split(/\s+/).length,
          characterCount: content.length,
          lineCount: content.split('\n').length
        },
        processedAt: new Date()
      };

      this.processedFiles.set(fileId, processedFile);
      this.emit('fileProcessed', processedFile);
      
      return processedFile;
    } catch (error) {
      this.emit('fileError', { fileId, error: error as Error });
      throw error;
    }
  }

  private async readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  private async readJsonFile(file: File): Promise<string> {
    const text = await this.readTextFile(file);
    try {
      const json = JSON.parse(text);
      return JSON.stringify(json, null, 2);
    } catch {
      return text; // Return as-is if not valid JSON
    }
  }

  private async readCsvFile(file: File): Promise<string> {
    const text = await this.readTextFile(file);
    const lines = text.split('\n');
    const headers = lines[0]?.split(',') || [];
    
    return `CSV File with ${lines.length} rows and ${headers.length} columns:\nHeaders: ${headers.join(', ')}\n\nContent:\n${text}`;
  }

  public getProcessedFile(fileId: string): ProcessedFile | undefined {
    return this.processedFiles.get(fileId);
  }

  public getAllProcessedFiles(): ProcessedFile[] {
    return Array.from(this.processedFiles.values());
  }

  public generateIntelligentSummary(file: ProcessedFile): string {
    const { content, metadata } = file;
    
    if (metadata.wordCount < 50) {
      return `This is a short ${file.type} file with ${metadata.wordCount} words.`;
    }

    // Extract key information
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const firstSentence = sentences[0]?.trim() || '';
    const keyTopics = this.extractKeyTopics(content);

    return `This ${file.type} file contains ${metadata.wordCount} words across ${metadata.lineCount} lines. ${firstSentence}. Key topics include: ${keyTopics.join(', ')}.`;
  }

  private extractKeyTopics(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 4);

    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  public clearProcessedFiles(): void {
    this.processedFiles.clear();
    this.emit('filesCleared');
  }
}