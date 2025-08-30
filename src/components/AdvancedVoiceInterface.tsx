/**
 * Advanced Voice Interface with Emotion Recognition and File Processing
 * Showcase component for hackathon demo
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, Brain, Zap, 
  FileText, Globe, Activity, Sparkles 
} from 'lucide-react';
import { VoiceAgent, ConversationTurn } from '../core/VoiceAgent';
import { AdvancedAgent } from '../agents/AdvancedAgent';
import { FileUpload } from './FileUpload';
import { EmotionDisplay } from './EmotionDisplay';
import { LanguageSelector } from './LanguageSelector';
import { EmotionAnalysis } from '../services/EmotionService';
import { ProcessedFile, FileProcessingService } from '../services/FileProcessingService';

interface AdvancedVoiceInterfaceProps {
  apiKey: string;
}

export const AdvancedVoiceInterface: React.FC<AdvancedVoiceInterfaceProps> = ({ apiKey }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [latencyStats, setLatencyStats] = useState<Record<string, number>>({});
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [fileService] = useState(() => new FileProcessingService());
  
  const voiceAgentRef = useRef<VoiceAgent | null>(null);
  const advancedAgentRef = useRef<AdvancedAgent | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAdvancedAgent = async () => {
      try {
        const agent = new AdvancedAgent();
        advancedAgentRef.current = agent;

        const voiceAgent = new VoiceAgent({
          apiKey,
          agent,
          sttOptions: {
            continuous: true,
            interimResults: true,
            lang: agent.getMultilingualService().getVoiceForLanguage(selectedLanguage)
          }
        });

        // Enhanced event listeners
        voiceAgent.on('speechStart', () => {
          setIsListening(true);
          setError(null);
        });

        voiceAgent.on('speechEnd', () => {
          setIsListening(false);
        });

        voiceAgent.on('transcriptionReceived', ({ text }: { text: string }) => {
          setCurrentTranscription(text);
          
          // Analyze emotion in real-time
          if (advancedAgentRef.current) {
            const emotion = advancedAgentRef.current.getEmotionService().analyzeEmotion(text);
            setCurrentEmotion(emotion);
          }
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
          setCurrentEmotion(null);
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
        setError(`Failed to initialize advanced agent: ${(error as Error).message}`);
      }
    };

    initializeAdvancedAgent();

    return () => {
      if (voiceAgentRef.current) {
        voiceAgentRef.current.destroy();
      }
    };
  }, [apiKey, selectedLanguage]);

  const handleMicToggle = () => {
    if (!voiceAgentRef.current || !isInitialized) return;

    if (isListening) {
      voiceAgentRef.current.stopListening();
    } else {
      voiceAgentRef.current.startListening();
    }
  };

  const handleFileProcessed = (file: ProcessedFile) => {
    setProcessedFiles(prev => [...prev, file]);
  };

  const getStatusText = () => {
    if (isListening) return 'Listening with emotion detection...';
    if (isProcessing) return 'Processing with AI intelligence...';
    if (isSpeaking) return 'Speaking with emotional context...';
    return 'Ready for intelligent conversation';
  };

  const getLatencyGrade = (): { grade: string; color: string } => {
    const total = latencyStats.total || 0;
    if (total < 1000) return { grade: 'A+', color: 'text-green-600' };
    if (total < 1500) return { grade: 'A', color: 'text-green-500' };
    if (total < 2000) return { grade: 'B', color: 'text-yellow-500' };
    return { grade: 'C', color: 'text-orange-500' };
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-center"
        >
          <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Initializing Advanced AI...</p>
        </motion.div>
      </div>
    );
  }

  const performance = getLatencyGrade();

  return (
    <div className="space-y-6">
      {/* Header with Performance Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Advanced AI Assistant</h2>
            <p className="text-blue-100">
              Emotion Recognition • Multilingual • Document Intelligence
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-3xl font-bold ${performance.color} bg-white/20 rounded-full w-16 h-16 flex items-center justify-center`}
          >
            {performance.grade}
          </motion.div>
        </div>
      </div>

      {/* Main Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Controls */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                scale: isListening ? [1, 1.1, 1] : 1,
                boxShadow: isListening ? 
                  ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 20px rgba(59, 130, 246, 0)'] : 
                  '0 0 0 0 rgba(59, 130, 246, 0)'
              }}
              transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
              className="inline-block"
            >
              <button
                onClick={handleMicToggle}
                disabled={isProcessing || isSpeaking}
                className={`p-6 rounded-full transition-all duration-300 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-2xl'
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>
            </motion.div>
            
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-800">{getStatusText()}</p>
              {latencyStats.total && (
                <p className="text-sm text-gray-500 mt-1">
                  Response time: {Math.round(latencyStats.total)}ms
                </p>
              )}
            </div>
          </div>

          {/* Current Activity */}
          <AnimatePresence>
            {(currentTranscription || currentResponse) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border"
              >
                {currentTranscription && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">You said:</span>
                    </div>
                    <p className="text-gray-800 italic">"{currentTranscription}"</p>
                  </div>
                )}
                {currentResponse && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">AI Response:</span>
                    </div>
                    <p className="text-gray-800">{currentResponse}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <Volume2 className="h-5 w-5 text-blue-600 animate-pulse" />
              ) : (
                <VolumeX className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">
                {isSpeaking ? 'Speaking' : 'Silent'}
              </span>
            </div>

            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              supportedLanguages={advancedAgentRef.current?.getMultilingualService().getSupportedLanguages() || {}}
            />
          </div>
        </div>

        {/* Emotion Display */}
        <div>
          <EmotionDisplay 
            emotion={currentEmotion} 
            isActive={isListening || isProcessing} 
          />
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Document Intelligence</h3>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </motion.div>
        </div>
        
        {advancedAgentRef.current && (
          <FileUpload
            fileService={fileService}
            indexService={advancedAgentRef.current.getLlamaIndexService()}
            onFileProcessed={handleFileProcessed}
          />
        )}
      </div>

      {/* Performance Dashboard */}
      {Object.keys(latencyStats).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Real-time Performance</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${performance.color} bg-gray-100`}>
              Grade: {performance.grade}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Speech Recognition', value: latencyStats.stt, icon: Mic, color: 'blue' },
              { label: 'AI Processing', value: latencyStats.llm, icon: Brain, color: 'purple' },
              { label: 'Speech Output', value: latencyStats.tts, icon: Volume2, color: 'green' },
              { label: 'Total Response', value: latencyStats.total, icon: Zap, color: 'orange' }
            ].map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-4 bg-${color}-50 border border-${color}-200 rounded-lg`}
              >
                <Icon className={`h-6 w-6 text-${color}-600 mx-auto mb-2`} />
                <div className={`text-xl font-bold text-${color}-700`}>
                  {Math.round(value || 0)}ms
                </div>
                <div className="text-xs text-gray-600">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Conversations */}
      {conversationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Conversations</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {conversationHistory.slice(-3).map((turn) => (
              <motion.div
                key={turn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-sm">
                  <div className="mb-1">
                    <strong className="text-blue-600">You:</strong> {turn.userInput}
                  </div>
                  <div className="mb-2">
                    <strong className="text-purple-600">AI:</strong> {turn.agentResponse}
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Response: {turn.latency.total}ms</span>
                    <span>{turn.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};