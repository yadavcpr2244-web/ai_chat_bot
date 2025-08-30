/**
 * Language Selector Component
 * Allows users to choose their preferred language
 */

import React from 'react';
import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  supportedLanguages: Record<string, { name: string; voice: string }>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  supportedLanguages
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">
          {supportedLanguages[selectedLanguage]?.name || 'English'}
        </span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48"
        >
          <div className="p-2">
            {Object.entries(supportedLanguages).map(([code, { name }]) => (
              <button
                key={code}
                onClick={() => {
                  onLanguageChange(code);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>{name}</span>
                {selectedLanguage === code && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};