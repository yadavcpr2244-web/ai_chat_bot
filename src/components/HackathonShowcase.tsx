/**
 * Hackathon Showcase Component
 * Impressive landing page highlighting all advanced features
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Mic, FileText, Globe, Heart, Zap, 
  Award, Target, Sparkles, ChevronRight 
} from 'lucide-react';

interface HackathonShowcaseProps {
  onStartDemo: () => void;
}

export const HackathonShowcase: React.FC<HackathonShowcaseProps> = ({ onStartDemo }) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: 'Advanced LLM Integration',
      description: 'Swappable AI models with Claude 3.5 Sonnet',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Heart,
      title: 'Emotion Recognition',
      description: 'Real-time emotional intelligence and adaptive responses',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: '10+ languages with automatic detection',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: FileText,
      title: 'Document Intelligence',
      description: 'LlamaIndex integration for smart file processing',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Zap,
      title: 'Sub-2s Latency',
      description: 'Optimized pipeline for real-time interaction',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100],
              y: [0, Math.random() * 100],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-4 rounded-full">
              <Brain className="h-12 w-12" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ARIA
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Advanced Responsive Intelligence Assistant
          </p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            Next-generation voice AI with emotional intelligence, multilingual support, 
            and document understanding - built for the future of human-computer interaction.
          </p>
        </motion.div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === currentFeature;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isActive ? 1.05 : 1,
                  boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.1)'
                }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${feature.color} backdrop-blur-sm`}
              >
                <Icon className="h-8 w-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
                
                {isActive && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="h-1 bg-white/50 rounded-full mt-4"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-6">Performance Targets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Response Time', value: '<2s', icon: Zap },
              { label: 'Accuracy', value: '95%+', icon: Target },
              { label: 'Languages', value: '10+', icon: Globe },
              { label: 'Emotions', value: '6 Types', icon: Heart }
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="h-6 w-6 mx-auto mb-2 text-blue-300" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-sm text-blue-200">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <motion.button
            onClick={onStartDemo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full text-xl font-bold shadow-2xl transition-all duration-300"
          >
            <Award className="h-6 w-6" />
            Experience the Future
            <ChevronRight className="h-6 w-6" />
          </motion.button>
          
          <p className="text-blue-200 mt-4">
            Ready to impress the judges? Let's showcase what's possible.
          </p>
        </motion.div>
      </div>
    </div>
  );
};