// backend/coordinatorAgent.js - Routes tasks to specialized agents
const Agent = require('./agent');

class CoordinatorAgent extends Agent {
  constructor() {
    super('Coordinator', 'Task Router & Manager', ['routing', 'delegation', 'coordination']);
    this.agentRegistry = new Map();
  }

  registerAgent(agent) {
    this.agentRegistry.set(agent.name, agent);
    this.log(`✓ Registered: ${agent.name} [${agent.capabilities.join(', ')}]`);
  }

  async run(input, context) {
    this.log('═══════════════════════════════════════');
    this.log('ANALYZING REQUEST...');
    
    const taskType = this.analyzeTaskType(input);
    const priority = this.assessPriority(input);
    const complexity = this.assessComplexity(input);

    context.taskType = taskType;
    context.priority = priority;
    context.complexity = complexity;
    context.originalInput = input;
    context.timestamp = new Date().toISOString();

    this.log(`Task Type: ${taskType.toUpperCase()}`);
    this.log(`Priority: ${priority} | Complexity: ${complexity}`);

    const agent = this.findBestAgent(taskType);
    
    if (!agent) {
      context.error = `No agent available for task type: ${taskType}`;
      context.result = `I don't have a specialized agent for this type of request yet. Available capabilities: ${this.getAvailableCapabilities().join(', ')}`;
      this.log(`⚠️  ${context.error}`);
      return context;
    }

    context.assignedAgent = agent.name;
    this.log(`→ Routing to: ${agent.name}`);
    this.log('═══════════════════════════════════════\n');

    await agent.run(input, context);

    this.addToMemory({ 
      input, 
      taskType, 
      assignedAgent: agent.name,
      success: !context.error,
      complexity
    });

    return context;
  }

  analyzeTaskType(input) {
    const lower = input.toLowerCase();

    if (lower.match(/\b(code|program|debug|fix|error|function|class|variable|syntax|bug|implement|algorithm|javascript|python|java|c\+\+)\b/)) {
      return 'coding';
    }

    if (lower.match(/\b(study plan|roadmap|schedule|curriculum|learning path|prepare for|how to learn|steps to|course)\b/)) {
      return 'planning';
    }

    if (lower.match(/\b(research|find|search|lookup|what is|who is|when did|history of|facts about|information on)\b/)) {
      return 'research';
    }

    if (lower.match(/\b(explain|teach|understand|how does|why|tutorial|concept|definition|tell me about|what does.*mean)\b/)) {
      return 'tutoring';
    }

    return 'tutoring';
  }

  assessPriority(input) {
    const lower = input.toLowerCase();
    if (lower.match(/urgent|asap|quickly|now|emergency/)) return 'high';
    if (lower.match(/when you can|eventually|sometime/)) return 'low';
    return 'medium';
  }

  assessComplexity(input) {
    const wordCount = input.split(' ').length;
    const hasMultipleParts = input.includes('and') || input.includes(',');
    const lower = input.toLowerCase();
    
    if (wordCount > 30 || lower.match(/complex|advanced|detailed|comprehensive|deep/) || hasMultipleParts) {
      return 'high';
    }
    if (wordCount < 10 && lower.match(/simple|basic|quick|brief/)) {
      return 'low';
    }
    return 'medium';
  }

  findBestAgent(taskType) {
    for (const [name, agent] of this.agentRegistry) {
      if (agent.canHandle(taskType)) {
        return agent;
      }
    }
    return null;
  }

  getAvailableCapabilities() {
    const caps = new Set();
    for (const agent of this.agentRegistry.values()) {
      agent.capabilities.forEach(cap => caps.add(cap));
    }
    return Array.from(caps);
  }

  getSystemStatus() {
    return {
      totalAgents: this.agentRegistry.size,
      agents: Array.from(this.agentRegistry.values()).map(a => ({
        name: a.name,
        role: a.role,
        capabilities: a.capabilities,
        memoryEntries: a.memory.length
      })),
      capabilities: this.getAvailableCapabilities()
    };
  }
}

module.exports = CoordinatorAgent;