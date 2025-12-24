# Copilot instructions for Multi-Agent System (backend)

Purpose: Give AI coding agents the minimal, actionable context to work effectively in this repo's backend implementation.

Quick start ✅
- Install deps: `cd backend && npm install` 🔧
- Run the orchestrator (example pipeline): `node backend/index.js`
- Run the MCP server (stdlib transport): `node backend/server.js` (file uses ESM and top-level await)

High-level architecture 🏗️
- Two complementary implementations of the same multi-agent idea live in `backend/`:
  - Orchestrator pipeline: `backend/orchestrator.js` composes agents (`TaskAnalyzerAgent`, `WorkerAgent`, `ResponseAgent`) and passes a mutable `context` object between them. See `backend/index.js` for an example run.
  - MCP server (Model Context Protocol): `backend/server.js` defines tools using `@modelcontextprotocol/sdk` and `zod` schemas that mutate a `sharedContext` object. The server uses `StdioServerTransport` (stdin/stdout) so tools can be driven by an MCP client.

Key files & roles 🔎
- `backend/agent.js` — base Agent class; agents must extend this and implement `async run(input, context)`.
- `backend/taskAnalyzerAgent.js` — sets `context.taskType` and `context.cleanedInput`.
- `backend/workerAgent.js` — produces `context.result`.
- `backend/responseAgent.js` — formats final response object `{ response: ... }`.
- `backend/orchestrator.js` — wires agents together and calls them in order.
- `backend/server.js` — MCP server with tool definitions: each tool is `{ name, description, inputSchema, handler }` and manipulates `sharedContext`.
- `backend/package.json` — dependencies include `@modelcontextprotocol/sdk` and `zod`.

Project-specific conventions & patterns 🧭
- Agent classes: file names use `camelCase` and class names use `CamelCase` ending with `Agent` (e.g., `TaskAnalyzerAgent` in `taskAnalyzerAgent.js`).
- Agents follow the same contract: `async run(input, context)` — they may return the mutated `context` or a final response object.
- Shared context keys: `taskType`, `cleanedInput`, `result`. Keep these keys consistent when adding handlers or agents to avoid breaking existing flows.
- MCP tools follow the pattern in `server.js`: include a `zod` `inputSchema` and keep handlers small and idempotent (return lightweight status or final response).
- Module format mismatch: The repo uses both CommonJS (`require`/`module.exports`) and ESM (`import`/top-level await in `server.js`). Be consistent when adding files: match the style of adjacent files or resolve module type in `package.json` before converting many files.

How to extend (concrete examples) ✍️
- Add a new Agent:
  - Create `backend/myNewAgent.js` that `const Agent = require('./agent'); class MyNewAgent extends Agent { async run(input, context) { /* mutate context */ return context; } } module.exports = MyNewAgent;`
  - Register it in `backend/orchestrator.js` by adding `new MyNewAgent("MyNewAgent")` to the agent array.
- Add a new MCP tool:
  - Follow `taskAnalyzerTool`/`workerTool` examples in `server.js`. Include `inputSchema: z.object({...})` and mutate `sharedContext` in `handler`.

Debugging & workflows 🐛
- There are no automated tests or CI scripts in this repo; use the example entrypoints (`index.js` and `server.js`) for manual verification.
- Logging: agents use `console.log`; add informative logs when changing control flow.
- Be prepared to address module type errors if you run `index.js` vs `server.js` because of the CommonJS/ESM mixture.

What not to assume ❗
- There are no hidden build steps — running is manual via `node`. Don't assume availability of tests or linting unless you add them explicitly.

PR tips & expectations ✅
- Preserve the agent contract (`run(input,context)`), keep `sharedContext` keys consistent, and add small examples or integration scripts when adding new agents/tools so humans can run them quickly.
- If you change module format (to full ESM or full CommonJS), update `package.json` and convert adjacent files in the same PR rather than mixing styles in one change.

If anything here is unclear or you want additional examples (e.g., a template for a new tool or agent), tell me which part and I’ll iterate. ✨