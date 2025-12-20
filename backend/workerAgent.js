const Agent = require("./agent");
class WorkerAgent extends Agent {
    async run(run,context){
        console.log("[Worker] processing task...");

        context.result = `Processed answer for: "${context.cleanedInput}"`;
        return context;
    }
}
module .exports = WorkerAgent;