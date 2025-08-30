/**
 * API Key Input Component
 * Secure input for LLM API credentials
 */

import React, { useState } from 'react';
import { Key, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
  initialApiKey?: string;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit, initialApiKey = '' }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateApiKey = (key: string): boolean => {
    // Basic validation for OpenRouter API key format
    return key.startsWith('sk-or-v1-') && key.length > 20;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateApiKey(apiKey)) {
      onApiKeySubmit(apiKey);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsValid(validateApiKey(value));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <Key className="h-8 w-8 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">API Configuration</h2>
        <p className="text-gray-600 text-sm">
          Enter your OpenRouter API key to enable LLM processing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {apiKey && !isValid && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Please enter a valid OpenRouter API key</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          Initialize Voice Agent
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-xs">
          <strong>Note:</strong> Your API key is stored locally and never transmitted except to the LLM provider.
        </p>
      </div>
    </div>
  );
};