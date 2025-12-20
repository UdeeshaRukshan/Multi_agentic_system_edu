const Orchestrator = require("./orchestrator")
async function main(){
    const orchestrator = new Orchestrator();
    const result = await orchestrator.run("what is a multi-agent system?");
    console.log("\nFinal Output:",result);
}
main();