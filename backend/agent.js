class Agent{
    constructor(name){
        this.name = name;
    }

    async run (input,context){
        throw new Error("run () not implemented")
    }

}

module.exports = Agent;