/**
 * Main Application Component
 * Orchestrates the entire voice agent demo
 */

import React, { useState } from 'react';
import { VoiceInterface } from './components/VoiceInterface';
import { AgentSelector } from './components/AgentSelector';
import { ApiKeyInput } from './components/ApiKeyInput';
import { Documentation } from './components/Documentation';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { BaseAgent } from './agents/BaseAgent';
import { GenericAgent } from './agents/GenericAgent';
import { Mic, Code, BarChart3 } from 'lucide-react';

type Tab = 'demo' | 'docs' | 'performance';

function App() {
  const [apiKey, setApiKey] = useState('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');
  const [selectedAgent, setSelectedAgent] = useState<BaseAgent>(new GenericAgent());
  const [activeTab, setActiveTab] = useState<Tab>('demo');
  const [latencyStats, setLatencyStats] = useState<Record<string, number>>({});
  const [conversationCount, setConversationCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const tabs = [
    { id: 'demo' as Tab, label: 'Voice Demo', icon: Mic },
    { id: 'docs' as Tab, label: 'Documentation', icon: Code },
    { id: 'performance' as Tab, label: 'Performance', icon: BarChart3 }
  ];

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  const handleAgentChange = (agent: BaseAgent) => {
    setSelectedAgent(agent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Voice Agent Framework</h1>
                <p className="text-sm text-gray-600">Modular STT → LLM → TTS Pipeline</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <nav className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!apiKey ? (
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} initialApiKey={apiKey} />
        ) : (
          <>
            {activeTab === 'demo' && (
              <div className="space-y-6">
                <AgentSelector 
                  selectedAgent={selectedAgent} 
                  onAgentChange={handleAgentChange}
                />
                <VoiceInterface 
                  agent={selectedAgent} 
                  apiKey={apiKey}
                />
              </div>
            )}

            {activeTab === 'docs' && <Documentation />}

            {activeTab === 'performance' && (
              <PerformanceMonitor
                latencyStats={latencyStats}
                conversationCount={conversationCount}
                isActive={isActive}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Framework Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time speech processing</li>
                <li>• Pluggable LLM agents</li>
                <li>• Performance monitoring</li>
                <li>• Security-first design</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Supported Models</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Claude 3.5 Sonnet</li>
                <li>• GPT-4 & GPT-3.5</li>
                <li>• Llama 2 & 3</li>
                <li>• Custom fine-tuned models</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Integration</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Simple API/SDK</li>
                <li>• TypeScript support</li>
                <li>• Event-driven architecture</li>
                <li>• Production-ready</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;