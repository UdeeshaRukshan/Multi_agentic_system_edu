const Agent = require("./agent");

class TaskAnalyzerAgent extends Agent {
async run (input, context){
    console.log("[TaskAnalyzer] analyzing task...");
    context.taskType = "simple_question";
    context.cleanedInput = input.trim();

    return context;
}
}
module.exports = TaskAnalyzerAgent;