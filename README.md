# Voice Agent Framework

A modular, production-ready framework for building voice-first AI applications with pluggable LLM agents.

## 🎯 Overview

This framework implements the core pattern for voice-first interfaces:
**Speech-to-Text → Large Language Model → Text-to-Speech**

## ✨ Key Features

- **Modular Architecture**: Swap LLM agents without rebuilding the pipeline
- **Real-time Processing**: Sub-2-second response times for conversational feel  
- **Multiple Domains**: Healthcare, customer support, and general-purpose agents
- **Performance Monitoring**: Real-time latency tracking and optimization
- **Security-First**: No sensitive data in plaintext logs
- **Easy Integration**: Simple API for custom agent development

## 🚀 Quick Start

### 1. Initialize the Framework

```typescript
import { VoiceAgent } from './core/VoiceAgent';
import { HealthcareAgent } from './agents/HealthcareAgent';

const agent = new HealthcareAgent();
const voiceAgent = new VoiceAgent({
  apiKey: 'your-openrouter-api-key',
  agent: agent
});

voiceAgent.startListening();
```

### 2. Create a Custom Agent

```typescript
import { BaseAgent, AgentConfig } from './agents/BaseAgent';

export class CustomAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'My Custom Agent',
      description: 'Specialized for my use case',
      systemPrompt: 'You are a helpful assistant specialized in...',
      model: 'anthropic/claude-3.5-sonnet',
      temperature: 0.7
    };
    super(config);
  }

  async processInput(userInput, history, llmService) {
    const messages = this.buildMessages(userInput, history);
    const response = await llmService.generateResponse(messages);
    
    // Add your custom logic here
    return response.content;
  }
}
```

## 🏗️ Architecture

### Core Components

- **VoiceAgent**: Orchestrates the entire STT → LLM → TTS pipeline
- **STTService**: Speech-to-text using Web Speech API
- **TTSService**: Text-to-speech using Web Speech Synthesis API
- **LLMService**: Configurable LLM provider communication
- **BaseAgent**: Abstract base class for custom agent implementations

### Included Agents

1. **GenericAgent**: General-purpose conversational AI
2. **HealthcareAgent**: Patient intake and medical Q&A
3. **CustomerSupportAgent**: Technical support and issue resolution

## 📊 Performance

The framework is optimized for real-time interaction:

- **STT Latency**: ~100-300ms (browser-dependent)
- **LLM Processing**: ~500-1500ms (model-dependent)  
- **TTS Latency**: ~100-500ms (browser-dependent)
- **Total Response Time**: <2s target for conversational feel

## 🔒 Security

- API keys never logged or exposed in plaintext
- Conversation history stored locally only
- Error messages sanitize sensitive information
- HIPAA-compliant logging for healthcare agents

## 🎨 Supported Models

Works with any OpenRouter-compatible LLM:
- Claude 3.5 Sonnet (recommended)
- GPT-4 and GPT-3.5 Turbo
- Llama 2 and 3
- Custom fine-tuned models

## 🔧 Configuration

### Agent Configuration

```typescript
const config: AgentConfig = {
  name: 'Agent Name',
  description: 'Agent description',
  systemPrompt: 'System instructions...',
  model: 'anthropic/claude-3.5-sonnet',
  temperature: 0.7,
  maxTokens: 150
};
```

### Voice Configuration

```typescript
const voiceAgent = new VoiceAgent({
  apiKey: 'your-key',
  agent: yourAgent,
  sttOptions: {
    lang: 'en-US',
    continuous: true,
    interimResults: true
  },
  ttsOptions: {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  }
});
```

## 🎯 Use Cases

### Healthcare
- Patient intake interviews
- Symptom assessment
- Appointment scheduling
- Medication reminders
- Health education

### Customer Support  
- Technical troubleshooting
- Billing inquiries
- Product information
- Issue escalation
- FAQ assistance

### Enterprise
- Meeting assistants
- Internal knowledge bases
- Training and onboarding
- Accessibility tools
- Hands-free interfaces

## 🚀 Deployment

The framework is browser-based and can be deployed to any static hosting provider:

- Vercel
- Netlify
- AWS CloudFront
- GitHub Pages
- Self-hosted

## 📈 Roadmap

- Multi-language support
- Emotional tone analysis
- WebRTC integration
- Mobile SDK
- Enterprise SSO
- Analytics dashboard

## 🤝 Contributing

This framework is designed for easy extension. To add a new agent:

1. Extend `BaseAgent`
2. Implement `processInput()` method
3. Define your system prompt and configuration
4. Add to the agent selector

## 📄 License

MIT License - Feel free to use in commercial projects.