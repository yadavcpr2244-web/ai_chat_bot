/**
 * Real-time Emotion Display Component
 * Visualizes detected emotions with animated indicators
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Frown, Zap, AlertTriangle, Star, ThumbsDown } from 'lucide-react';
import { EmotionAnalysis } from '../services/EmotionService';

interface EmotionDisplayProps {
  emotion: EmotionAnalysis | null;
  isActive: boolean;
}

const emotionConfig = {
  joy: { icon: Heart, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Joy' },
  sadness: { icon: Frown, color: 'text-blue-500', bg: 'bg-blue-100', label: 'Sadness' },
  anger: { icon: Zap, color: 'text-red-500', bg: 'bg-red-100', label: 'Anger' },
  fear: { icon: AlertTriangle, color: 'text-purple-500', bg: 'bg-purple-100', label: 'Fear' },
  surprise: { icon: Star, color: 'text-green-500', bg: 'bg-green-100', label: 'Surprise' },
  disgust: { icon: ThumbsDown, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Disgust' }
};

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotion, isActive }) => {
  if (!emotion || !isActive) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-center text-gray-500">
          <Heart className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Emotion detection ready</p>
        </div>
      </div>
    );
  }

  const primaryEmotion = emotionConfig[emotion.primary as keyof typeof emotionConfig];
  const Icon = primaryEmotion?.icon || Heart;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg p-4 border border-gray-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: emotion.arousal > 0.5 ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          className={`p-2 rounded-full ${primaryEmotion?.bg || 'bg-gray-100'}`}
        >
          <Icon className={`h-5 w-5 ${primaryEmotion?.color || 'text-gray-500'}`} />
        </motion.div>
        
        <div>
          <h4 className="font-medium text-gray-800">
            {primaryEmotion?.label || 'Neutral'}
          </h4>
          <p className="text-xs text-gray-500">
            Confidence: {(emotion.confidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Emotion Bars */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Valence</span>
          <span>{emotion.valence > 0 ? 'Positive' : 'Negative'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.abs(emotion.valence) * 100}%` }}
            className={`h-2 rounded-full ${
              emotion.valence > 0 ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Arousal</span>
          <span>{emotion.arousal > 0.5 ? 'High' : 'Low'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${emotion.arousal * 100}%` }}
            className="h-2 rounded-full bg-orange-500"
          />
        </div>
      </div>
    </motion.div>
  );
};