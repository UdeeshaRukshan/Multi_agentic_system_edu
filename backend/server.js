// backend/server.js - Updated MCP server with real agents
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Orchestrator = require('./orchestrator.js');

// Initialize the orchestrator with all agents
const orchestrator = new Orchestrator();

// Enhanced context with full agent capabilities
const sharedContext = {
  taskType: null,
  assignedAgent: null,
  result: null,
  history: [],
  sessionId: Date.now()
};

function logToHistory(action, data) {
  sharedContext.history.push({
    timestamp: new Date().toISOString(),
    action,
    data
  });
  // Keep last 50 entries
  if (sharedContext.history.length > 50) {
    sharedContext.history.shift();
  }
}

// Tool 1: Process any educational request using the multi-agent system
const processRequestTool = {
  name: "process_educational_request",
  description: "Process any educational request using specialized AI agents (research, tutoring, coding help, or learning plans). This is the main entry point for all educational queries.",
  inputSchema: z.object({
    request: z.string().describe("The user's educational request or question")
  }),
  handler: async ({ request }) => {
    console.log(`[MCP Server] Processing request: "${request}"`);
    
    const response = await orchestrator.processRequest(request);
    
    sharedContext.taskType = response.metadata?.taskType;
    sharedContext.assignedAgent = response.metadata?.assignedAgent;
    sharedContext.result = response.result;
    
    logToHistory('process_request', { request, response: response.metadata });
    
    return {
      success: response.success,
      result: response.result,
      agent: response.metadata?.assignedAgent,
      taskType: response.metadata?.taskType,
      processingTime: response.metadata?.duration
    };
  }
};

// Tool 2: Get system status and available capabilities
const getSystemStatusTool = {
  name: "get_system_status",
  description: "Get information about available agents, their capabilities, and system status",
  inputSchema: z.object({}),
  handler: async () => {
    const status = orchestrator.getSystemInfo();
    
    logToHistory('get_status', status);
    
    return {
      totalAgents: status.totalAgents,
      agents: status.agents,
      capabilities: status.capabilities,
      sessionId: sharedContext.sessionId,
      historyEntries: sharedContext.history.length
    };
  }
};

// Tool 3: Get session history
const getHistoryTool = {
  name: "get_session_history",
  description: "Retrieve the history of requests processed in this session",
  inputSchema: z.object({
    limit: z.number().optional().describe("Maximum number of history entries to return (default: 10)")
  }),
  handler: async ({ limit = 10 }) => {
    const recentHistory = sharedContext.history.slice(-limit);
    
    return {
      sessionId: sharedContext.sessionId,
      totalEntries: sharedContext.history.length,
      entries: recentHistory
    };
  }
};

// Tool 4: Research-specific tool
const researchTool = {
  name: "research_topic",
  description: "Specifically invoke the Research Agent to gather information about a topic",
  inputSchema: z.object({
    topic: z.string().describe("The topic to research")
  }),
  handler: async ({ topic }) => {
    const request = `Research ${topic}`;
    const response = await orchestrator.processRequest(request);
    
    logToHistory('research', { topic });
    
    return {
      result: response.result,
      topics: response.metadata?.researchTopics
    };
  }
};

// Tool 5: Get learning plan
const learningPlanTool = {
  name: "create_learning_plan",
  description: "Create a structured learning plan for a subject",
  inputSchema: z.object({
    subject: z.string().describe("The subject to create a learning plan for"),
    duration: z.string().optional().describe("Duration (e.g., '1 month', '3 months')"),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe("Skill level")
  }),
  handler: async ({ subject, duration, level }) => {
    let request = `Create a study plan for ${subject}`;
    if (duration) request += ` in ${duration}`;
    if (level) request += ` at ${level} level`;
    
    const response = await orchestrator.processRequest(request);
    
    logToHistory('learning_plan', { subject, duration, level });
    
    return {
      result: response.result,
      subject: subject,
      duration: duration || 'flexible'
    };
  }
};

// Tool 6: Code assistance
const codeHelpTool = {
  name: "get_code_help",
  description: "Get programming assistance for debugging, implementation, or code explanation",
  inputSchema: z.object({
    request: z.string().describe("Description of the coding problem or question"),
    language: z.string().optional().describe("Programming language (e.g., JavaScript, Python)")
  }),
  handler: async ({ request, language }) => {
    let fullRequest = request;
    if (language) fullRequest += ` in ${language}`;
    
    const response = await orchestrator.processRequest(fullRequest);
    
    logToHistory('code_help', { request, language });
    
    return {
      result: response.result,
      language: language || 'general'
    };
  }
};

// Initialize MCP server with all tools
const server = new Server(
  {
    name: "educational-multi-agent-system",
    version: "2.0.0"
  },
  {
    tools: [
      processRequestTool,
      getSystemStatusTool,
      getHistoryTool,
      researchTool,
      learningPlanTool,
      codeHelpTool
    ]
  }
);

console.log('🚀 MCP Server starting with Multi-Agent System...');
console.log(`📋 Available tools: ${server.server.tools.size}`);
console.log('✅ Server ready\n');

const transport = new StdioServerTransport();
await server.connect(transport);
