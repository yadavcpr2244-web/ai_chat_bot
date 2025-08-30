/**
 * Performance Monitoring Component
 * Displays real-time performance metrics and system health
 */

import React from 'react';
import { Activity, Clock, Zap, TrendingUp } from 'lucide-react';

interface PerformanceMonitorProps {
  latencyStats: Record<string, number>;
  conversationCount: number;
  isActive: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  latencyStats,
  conversationCount,
  isActive
}) => {
  const getLatencyColor = (latency: number): string => {
    if (latency < 500) return 'text-green-600';
    if (latency < 1000) return 'text-yellow-600';
    if (latency < 2000) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceGrade = (): { grade: string; color: string } => {
    const totalLatency = latencyStats.total || 0;
    if (totalLatency < 1000) return { grade: 'A', color: 'text-green-600' };
    if (totalLatency < 1500) return { grade: 'B', color: 'text-yellow-600' };
    if (totalLatency < 2000) return { grade: 'C', color: 'text-orange-600' };
    return { grade: 'D', color: 'text-red-600' };
  };

  const performance = getPerformanceGrade();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Activity className={`h-6 w-6 ${isActive ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
        <h3 className="text-lg font-semibold text-gray-800">Performance Monitor</h3>
        <div className={`ml-auto text-2xl font-bold ${performance.color}`}>
          {performance.grade}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
          <div className={`text-lg font-semibold ${getLatencyColor(latencyStats.stt || 0)}`}>
            {Math.round(latencyStats.stt || 0)}ms
          </div>
          <div className="text-xs text-gray-600">Speech-to-Text</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <div className={`text-lg font-semibold ${getLatencyColor(latencyStats.llm || 0)}`}>
            {Math.round(latencyStats.llm || 0)}ms
          </div>
          <div className="text-xs text-gray-600">LLM Processing</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
          <div className={`text-lg font-semibold ${getLatencyColor(latencyStats.tts || 0)}`}>
            {Math.round(latencyStats.tts || 0)}ms
          </div>
          <div className="text-xs text-gray-600">Text-to-Speech</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-orange-600 mx-auto mb-1" />
          <div className={`text-lg font-semibold ${getLatencyColor(latencyStats.total || 0)}`}>
            {Math.round(latencyStats.total || 0)}ms
          </div>
          <div className="text-xs text-gray-600">Total Response</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Conversations: {conversationCount}</span>
        <span className={`font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
          {isActive ? 'Active' : 'Idle'}
        </span>
      </div>

      {latencyStats.total > 2000 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs">
            ⚠️ Response time exceeds 2s target. Consider optimizing your agent or switching to a faster model.
          </p>
        </div>
      )}
    </div>
  );
};