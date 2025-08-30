/**
 * Main Voice Interface Component
 * Handles the primary user interaction with the voice agent
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Activity, Clock } from 'lucide-react';
import { VoiceAgent } from '../core/VoiceAgent';
import { BaseAgent } from '../agents/BaseAgent';
import { ConversationTurn } from '../core/VoiceAgent';

interface VoiceInterfaceProps {
  agent: BaseAgent;
  apiKey: string;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ agent, apiKey }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [latencyStats, setLatencyStats] = useState<Record<string, number>>({});
  
  const voiceAgentRef = useRef<VoiceAgent | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeVoiceAgent = async () => {
      try {
        const voiceAgent = new VoiceAgent({
          apiKey,
          agent,
          sttOptions: {
            continuous: true,
            interimResults: true,
            lang: 'en-US'
          }
        });

        // Setup event listeners
        voiceAgent.on('speechStart', () => {
          setIsListening(true);
          setError(null);
        });

        voiceAgent.on('speechEnd', () => {
          setIsListening(false);
        });

        voiceAgent.on('transcriptionReceived', ({ text }: { text: string }) => {
          setCurrentTranscription(text);
        });

        voiceAgent.on('llmProcessingStart', () => {
          setIsProcessing(true);
        });

        voiceAgent.on('llmProcessingEnd', ({ response }: { response: string }) => {
          setCurrentResponse(response);
          setIsProcessing(false);
        });

        voiceAgent.on('speechOutputStart', () => {
          setIsSpeaking(true);
        });

        voiceAgent.on('speechOutputEnd', () => {
          setIsSpeaking(false);
          setCurrentTranscription('');
          setCurrentResponse('');
        });

        voiceAgent.on('turnCompleted', ({ turn }: { turn: ConversationTurn }) => {
          setConversationHistory(prev => [...prev, turn]);
          setLatencyStats(voiceAgent.getLatencyStats());
        });

        voiceAgent.on('error', ({ error }: { error: Error }) => {
          setError(error.message);
          setIsListening(false);
          setIsProcessing(false);
          setIsSpeaking(false);
        });

        voiceAgentRef.current = voiceAgent;
        setIsInitialized(true);
      } catch (error) {
        setError(`Failed to initialize voice agent: ${(error as Error).message}`);
      }
    };

    initializeVoiceAgent();

    return () => {
      if (voiceAgentRef.current) {
        voiceAgentRef.current.destroy();
      }
    };
  }, [agent, apiKey]);

  const handleMicToggle = () => {
    if (!voiceAgentRef.current || !isInitialized) return;

    if (isListening) {
      voiceAgentRef.current.stopListening();
      setIsListening(false); // Force update the UI state
    } else {
      voiceAgentRef.current.startListening();
    }
  };

  const clearHistory = () => {
    if (voiceAgentRef.current) {
      voiceAgentRef.current.clearHistory();
      setConversationHistory([]);
      setLatencyStats({});
    }
  };

  const getStatusText = () => {
    if (isListening) return 'Listening... (Click to stop)';
    if (isProcessing) return 'Processing...';
    if (isSpeaking) return 'Speaking...';
    return 'Click microphone to start listening';
  };

  const getStatusColor = () => {
    if (isListening) return 'text-green-600';
    if (isProcessing) return 'text-yellow-600';
    if (isSpeaking) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Initializing voice agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{agent.getName()}</h2>
        <p className="text-gray-600">{agent.getDescription()}</p>
      </div>

      {/* Status Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 ${getStatusColor()}`}>
          <Activity className={`h-4 w-4 ${isListening || isProcessing || isSpeaking ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{getStatusText()}</span>
        </div>
        
        {isListening && (
          <p className="text-xs text-gray-500 mt-2">
            🎤 Continuous listening active - Click microphone again to stop
          </p>
        )}
      </div>

      {/* Current Activity */}
      {(currentTranscription || currentResponse) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          {currentTranscription && (
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-500">You said:</span>
              <p className="text-gray-800">{currentTranscription}</p>
            </div>
          )}
          {currentResponse && (
            <div>
              <span className="text-sm font-medium text-gray-500">Response:</span>
              <p className="text-gray-800">{currentResponse}</p>
            </div>
          )}
        </div>
      )}

      {/* Main Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="relative">
          <button
            onClick={handleMicToggle}
            disabled={isProcessing || isSpeaking}
            className={`p-4 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>
          
          {/* Continuous listening indicator */}
          {isListening && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
          )}
        </div>

        {isSpeaking ? (
          <Volume2 className="h-6 w-6 text-blue-600 animate-pulse self-center" />
        ) : (
          <VolumeX className="h-6 w-6 text-gray-400 self-center" />
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Performance Stats */}
      {Object.keys(latencyStats).length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Average Response Times</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
            <div>STT: {Math.round(latencyStats.stt || 0)}ms</div>
            <div>LLM: {Math.round(latencyStats.llm || 0)}ms</div>
            <div>TTS: {Math.round(latencyStats.tts || 0)}ms</div>
            <div>Total: {Math.round(latencyStats.total || 0)}ms</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-2">
        <button
          onClick={clearHistory}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Clear History
        </button>
        <button
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4 inline mr-1" />
          Settings
        </button>
      </div>

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="mt-6 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Conversation</h3>
          <div className="space-y-2">
            {conversationHistory.slice(-5).map((turn) => (
              <div key={turn.id} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                <div><strong>You:</strong> {turn.userInput}</div>
                <div><strong>Agent:</strong> {turn.agentResponse}</div>
                <div className="text-gray-400 mt-1">
                  Total: {turn.latency.total}ms
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};