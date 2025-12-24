const Orchestrator = require('./orchestrator');

async function runDemo() {
  const orchestrator = new Orchestrator();

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     MULTI-AGENT EDUCATIONAL ASSISTANT SYSTEM DEMO          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Display system info
  const systemInfo = orchestrator.getSystemInfo();
  console.log(`📊 System Status:`);
  console.log(`   Agents: ${systemInfo.totalAgents}`);
  console.log(`   Capabilities: ${systemInfo.capabilities.join(', ')}\n`);

  // Test cases demonstrating different agent types
  const testCases = [
    {
      name: 'Research Query',
      input: 'Research quantum computing and its applications'
    },
    {
      name: 'Tutoring Request',
      input: 'Explain how neural networks work with simple examples'
    },
    {
      name: 'Coding Help',
      input: 'Help me debug this JavaScript code that has an async error'
    },
    {
      name: 'Learning Plan',
      input: 'Create a 3-month study plan to learn Python for data science'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TEST: ${testCase.name}`);
    console.log(`${'='.repeat(60)}`);

    const response = await orchestrator.processRequest(testCase.input);

    if (response.success) {
      console.log('\n📄 RESULT:');
      console.log(response.result);
      console.log(`\n✅ Processed by: ${response.metadata.assignedAgent}`);
    } else {
      console.log(`\n❌ Error: ${response.error}`);
    }

    // Small delay between requests for readability
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n\n' + '═'.repeat(60));
  console.log('DEMO COMPLETE');
  console.log('═'.repeat(60) + '\n');
}

// Run the demo
runDemo().catch(console.error);