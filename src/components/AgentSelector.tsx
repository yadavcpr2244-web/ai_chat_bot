/**
 * Agent Selector Component
 * Allows users to choose between different specialized agents
 */

import React from 'react';
import { BaseAgent } from '../agents/BaseAgent';
import { HealthcareAgent } from '../agents/HealthcareAgent';
import { CustomerSupportAgent } from '../agents/CustomerSupportAgent';
import { GenericAgent } from '../agents/GenericAgent';
import { Heart, Headphones, MessageCircle, Check } from 'lucide-react';

interface AgentSelectorProps {
  selectedAgent: BaseAgent;
  onAgentChange: (agent: BaseAgent) => void;
}

const agentConfigs = [
  {
    agent: GenericAgent,
    icon: MessageCircle,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    selectedColor: 'bg-purple-500 text-white border-purple-500'
  },
  {
    agent: HealthcareAgent,
    icon: Heart,
    color: 'bg-teal-100 text-teal-600 border-teal-200',
    selectedColor: 'bg-teal-500 text-white border-teal-500'
  },
  {
    agent: CustomerSupportAgent,
    icon: Headphones,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    selectedColor: 'bg-blue-500 text-white border-blue-500'
  }
];

export const AgentSelector: React.FC<AgentSelectorProps> = ({ selectedAgent, onAgentChange }) => {
  const selectedAgentName = selectedAgent.getName();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Your AI Agent</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agentConfigs.map(({ agent: AgentClass, icon: Icon, color, selectedColor }) => {
          const agentInstance = new AgentClass();
          const isSelected = agentInstance.getName() === selectedAgentName;
          
          return (
            <button
              key={agentInstance.getName()}
              onClick={() => onAgentChange(agentInstance)}
              className={`relative p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                isSelected ? selectedColor : color
              }`}
            >
              {isSelected && (
                <Check className="absolute top-2 right-2 h-5 w-5" />
              )}
              
              <div className="flex items-start gap-3">
                <Icon className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{agentInstance.getName()}</h3>
                  <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                    {agentInstance.getDescription()}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};