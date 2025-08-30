/**
 * API Documentation Component
 * Shows how to integrate custom agents
 */

import React from 'react';
import { Code2, Book, Zap, Shield } from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Book className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Framework Documentation</h2>
      </div>

      <div className="space-y-6">
        {/* Quick Start */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            Quick Start
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`import { VoiceAgent } from './core/VoiceAgent';
import { CustomAgent } from './agents/CustomAgent';

const agent = new CustomAgent();
const voiceAgent = new VoiceAgent({
  apiKey: 'your-api-key',
  agent: agent
});

voiceAgent.startListening();`}
            </pre>
          </div>
        </section>

        {/* Creating Custom Agents */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-purple-600" />
            Creating Custom Agents
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`import { BaseAgent, AgentConfig } from './agents/BaseAgent';

export class CustomAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'My Custom Agent',
      description: 'Specialized for my use case',
      systemPrompt: 'You are a helpful assistant...',
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.7
    };
    super(config);
  }

  async processInput(userInput, history, llmService) {
    const messages = this.buildMessages(userInput, history);
    const response = await llmService.generateResponse(messages);
    return response.content;
  }
}`}
            </pre>
          </div>
        </section>

        {/* Event System */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Event System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-700 mb-2">Pipeline Events</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• speechStart</li>
                <li>• speechEnd</li>
                <li>• transcriptionReceived</li>
                <li>• llmProcessingStart</li>
                <li>• llmProcessingEnd</li>
                <li>• speechOutputStart</li>
                <li>• speechOutputEnd</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-gray-700 mb-2">System Events</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• turnCompleted</li>
                <li>• error</li>
                <li>• historyCleared</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Security Features
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <ul className="text-sm text-green-800 space-y-2">
              <li>• API keys are never logged or exposed in plaintext</li>
              <li>• Conversation history is stored locally only</li>
              <li>• Error messages sanitize sensitive information</li>
              <li>• Optional conversation encryption (enterprise feature)</li>
            </ul>
          </div>
        </section>

        {/* Architecture */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Architecture Overview</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-700">
              <p className="mb-3"><strong>Modular Pipeline:</strong></p>
              <div className="flex items-center justify-between bg-white rounded p-3 mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">STT Service</span>
                <span className="text-gray-400">→</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">LLM Agent</span>
                <span className="text-gray-400">→</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">TTS Service</span>
              </div>
              <p className="text-gray-600">
                Each component is independently replaceable and configurable, 
                allowing businesses to plug in their own domain-specific logic.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};