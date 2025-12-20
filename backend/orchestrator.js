const TaskAnalyzerAgent = require("./taskAnalyzerAgent");
const WorkerAgent = require("./workerAgent");
const ResponseAgent = require("./responseAgent");

class Orchestrator {
    constructor(){
        this.context = {};
        this.agent = [
            new TaskAnalyzerAgent("TaskAnalyzer"),
            new WorkerAgent("Worker"),
            new ResponseAgent("Response")
        ];
    }
    async run (userInput){
        let data = userInput;

        for(const agent of this.agent){
            data = await agent.run(data, this.context);
        }
        return data;
    }
}

module.exports = Orchestrator;
