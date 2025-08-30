/**
 * Main Application Component
 * Hackathon-ready voice AI system with advanced features
 */

import React, { useState } from 'react';
import { AdvancedVoiceInterface } from './components/AdvancedVoiceInterface';
import { HackathonShowcase } from './components/HackathonShowcase';
import { ApiKeyInput } from './components/ApiKeyInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

type AppState = 'showcase' | 'demo' | 'api-setup';

function App() {
  const [apiKey, setApiKey] = useState('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');
  const [appState, setAppState] = useState<AppState>('showcase');

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setAppState('demo');
  };

  const handleStartDemo = () => {
    if (apiKey) {
      setAppState('demo');
    } else {
      setAppState('api-setup');
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {appState === 'showcase' && (
          <motion.div
            key="showcase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HackathonShowcase onStartDemo={handleStartDemo} />
          </motion.div>
        )}

        {appState === 'api-setup' && (
          <motion.div
            key="api-setup"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-center mb-6"
              >
                <Brain className="h-16 w-16 text-blue-600 mx-auto" />
              </motion.div>
              <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} initialApiKey={apiKey} />
            </div>
          </motion.div>
        )}

        {appState === 'demo' && apiKey && (
          <motion.div
            key="demo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
          >
            {/* Demo Header */}
            <header className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
              <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <motion.div
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ARIA Demo
                      </h1>
                      <p className="text-sm text-gray-600">Advanced AI Assistant</p>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    onClick={() => setAppState('showcase')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    Back to Showcase
                  </motion.button>
                </div>
              </div>
            </header>
    </div>
  );
}

            <main className="max-w-6xl mx-auto px-6 py-8">
              <AdvancedVoiceInterface apiKey={apiKey} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
export default App;