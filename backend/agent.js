class Agent {
  constructor(name, role, capabilities = []) {
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
    this.memory = [];
  }

  async run(input, context) {
    throw new Error(`Agent ${this.name} must implement run() method`);
  }

  addToMemory(entry) {
    this.memory.push({
      timestamp: new Date().toISOString(),
      entry
    });
    if (this.memory.length > 100) {
      this.memory.shift();
    }
  }

  getMemory() {
    return this.memory;
  }

  canHandle(taskType) {
    return this.capabilities.includes(taskType);
  }

  log(message) {
    console.log(`[${this.name}] ${message}`);
  }
}

module.exports = Agent;