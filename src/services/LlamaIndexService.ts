/**
 * LlamaIndex Integration Service
 * Handles document indexing and intelligent retrieval
 */

import { EventEmitter } from '../utils/EventEmitter';

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface QueryResult {
  chunks: DocumentChunk[];
  relevanceScores: number[];
  context: string;
}

export class LlamaIndexService extends EventEmitter {
  private documents: DocumentChunk[] = [];
  private index: Map<string, DocumentChunk> = new Map();

  public async indexDocument(content: string, metadata: Record<string, any> = {}): Promise<string> {
    const chunks = this.chunkDocument(content);
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    for (let i = 0; i < chunks.length; i++) {
      const chunk: DocumentChunk = {
        id: `${documentId}_chunk_${i}`,
        content: chunks[i],
        metadata: {
          ...metadata,
          documentId,
          chunkIndex: i,
          totalChunks: chunks.length
        }
      };

      this.documents.push(chunk);
      this.index.set(chunk.id, chunk);
    }

    this.emit('documentIndexed', { documentId, chunks: chunks.length });
    return documentId;
  }

  public async queryDocuments(query: string, maxResults: number = 5): Promise<QueryResult> {
    // Simple keyword-based retrieval (in production, use vector embeddings)
    const queryWords = query.toLowerCase().split(/\s+/);
    const results: { chunk: DocumentChunk; score: number }[] = [];

    for (const chunk of this.documents) {
      const chunkWords = chunk.content.toLowerCase().split(/\s+/);
      let score = 0;

      // Calculate relevance score based on keyword overlap
      for (const queryWord of queryWords) {
        for (const chunkWord of chunkWords) {
          if (chunkWord.includes(queryWord) || queryWord.includes(chunkWord)) {
            score += 1;
          }
        }
      }

      if (score > 0) {
        results.push({ chunk, score: score / queryWords.length });
      }
    }

    // Sort by relevance and take top results
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, maxResults);

    const context = topResults
      .map(r => r.chunk.content)
      .join('\n\n');

    return {
      chunks: topResults.map(r => r.chunk),
      relevanceScores: topResults.map(r => r.score),
      context
    };
  }

  private chunkDocument(content: string, chunkSize: number = 500): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence.trim();
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence.trim();
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [content];
  }

  public getIndexStats(): { totalDocuments: number; totalChunks: number } {
    const documentIds = new Set(this.documents.map(d => d.metadata.documentId));
    return {
      totalDocuments: documentIds.size,
      totalChunks: this.documents.length
    };
  }

  public clearIndex(): void {
    this.documents = [];
    this.index.clear();
    this.emit('indexCleared');
  }
}