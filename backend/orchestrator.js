// backend/orchestrator.js - Updated to use new coordinator pattern
const CoordinatorAgent = require('./coordinatorAgent');
const ResearchAgent = require('./researchAgent');
const TutorAgent = require('./tutorAgent');
const CodeHelperAgent = require('./codeHelperAgent');
const PlanningAgent = require('./planningAgent');

class Orchestrator {
  constructor() {
    this.coordinator = new CoordinatorAgent();
    this.initializeAgents();
  }

  initializeAgents() {
    // Register all specialized agents with the coordinator
    this.coordinator.registerAgent(new ResearchAgent());
    this.coordinator.registerAgent(new TutorAgent());
    this.coordinator.registerAgent(new CodeHelperAgent());
    this.coordinator.registerAgent(new PlanningAgent());
    
    console.log('\n🚀 Multi-Agent System Initialized');
    console.log('═══════════════════════════════════════\n');
  }

  async processRequest(input) {
    const context = {
      startTime: new Date(),
      input: input
    };

    console.log(`\n📥 NEW REQUEST: "${input}"\n`);

    try {
      // Coordinator handles routing and execution
      await this.coordinator.run(input, context);

      context.endTime = new Date();
      context.duration = context.endTime - context.startTime;

      console.log(`\n⏱️  Processing time: ${context.duration}ms`);
      console.log('═══════════════════════════════════════\n');

      return {
        success: !context.error,
        result: context.result,
        metadata: {
          taskType: context.taskType,
          assignedAgent: context.assignedAgent,
          duration: context.duration,
          timestamp: context.endTime
        }
      };

    } catch (error) {
      console.error('❌ Error processing request:', error.message);
      return {
        success: false,
        error: error.message,
        result: 'An error occurred while processing your request.'
      };
    }
  }

  getSystemInfo() {
    return this.coordinator.getSystemStatus();
  }
}

module.exports = Orchestrator;
