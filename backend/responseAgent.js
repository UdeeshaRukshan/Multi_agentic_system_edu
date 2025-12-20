const Agent = require("./agent");

class ResponseAgent extends Agent {
  async run(input, context) {
    console.log("[ResponseAgent] formatting response...");

    return {
      response: context.result
    };
  }
}

module.exports = ResponseAgent;
