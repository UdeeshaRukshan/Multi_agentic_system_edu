const Agent = require('./agent');

class TutorAgent extends Agent {
  constructor() {
    super('Tutor Agent', 'Educational Explainer', ['tutoring', 'explanation', 'teaching']);
  }

  async run(input, context) {
    this.log('👨‍🏫 Preparing educational explanation...');

    const analysis = this.analyzeRequest(input);
    
    context.difficulty = analysis.difficulty;
    context.explanationStyle = analysis.style;
    context.topic = analysis.topic;

    this.log(`Style: ${analysis.style} | Difficulty: ${analysis.difficulty}`);

    const explanation = await this.createExplanation(input, analysis);
    
    context.result = explanation;
    context.includesExamples = analysis.needsExamples;

    this.addToMemory({ topic: analysis.topic, difficulty: analysis.difficulty });
    this.log('✓ Explanation ready');

    return context;
  }

  analyzeRequest(input) {
    const lower = input.toLowerCase();
    
    const difficulty = this.assessDifficulty(lower);
    const style = this.selectStyle(lower);
    const topic = this.extractTopic(input);
    const needsExamples = lower.match(/example|show|demonstrate/) !== null;
    const needsAnalogy = lower.match(/like|similar to|analogy|compare/) !== null;

    return { difficulty, style, topic, needsExamples, needsAnalogy };
  }

  assessDifficulty(lower) {
    if (lower.match(/beginner|simple|basic|eli5|for dummies|intro/)) return 'beginner';
    if (lower.match(/advanced|expert|complex|technical|deep|detailed/)) return 'advanced';
    return 'intermediate';
  }

  selectStyle(lower) {
    if (lower.match(/example|practical|show me/)) return 'example-driven';
    if (lower.match(/step by step|guide|tutorial/)) return 'step-by-step';
    if (lower.match(/analogy|like|simple terms/)) return 'analogy-based';
    if (lower.match(/technical|precise|formal/)) return 'technical';
    return 'conversational';
  }

  extractTopic(input) {
    const match = input.match(/(?:explain|what is|about|understand|learn)\s+([a-zA-Z0-9\s]+)(?:\?|$|in|for)/i);
    return match ? match[1].trim() : 'the requested topic';
  }

  async createExplanation(input, analysis) {
    const { topic, difficulty, style, needsExamples, needsAnalogy } = analysis;

    let explanation = `# 📚 ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n`;
    
    // Introduction based on difficulty
    explanation += `## ${this.getIntroHeader(difficulty)}\n`;
    explanation += this.generateIntro(topic, difficulty) + '\n\n';

    // Main explanation
    explanation += `## Understanding ${topic}\n`;
    explanation += this.generateMainContent(topic, difficulty, style) + '\n\n';

    // Examples if needed
    if (needsExamples || style === 'example-driven') {
      explanation += `## Examples\n`;
      explanation += this.generateExamples(topic, difficulty) + '\n\n';
    }

    // Analogy if requested
    if (needsAnalogy && difficulty !== 'advanced') {
      explanation += `## Think of it like this...\n`;
      explanation += this.generateAnalogy(topic) + '\n\n';
    }

    // Key takeaways
    explanation += `## Key Takeaways\n`;
    explanation += this.generateTakeaways(topic, difficulty) + '\n\n';

    // Next steps
    explanation += `## What's Next?\n`;
    explanation += this.suggestNextSteps(topic, difficulty);

    return explanation;
  }

  getIntroHeader(difficulty) {
    const headers = {
      'beginner': 'The Basics',
      'intermediate': 'Core Concepts',
      'advanced': 'In-Depth Analysis'
    };
    return headers[difficulty] || 'Overview';
  }

  generateIntro(topic, difficulty) {
    const intros = {
      'beginner': `Let's start from the ground up and explore ${topic} in a simple, easy-to-understand way.`,
      'intermediate': `${topic} is an important concept that builds on fundamental principles. Let's dive into how it works.`,
      'advanced': `This is a comprehensive technical exploration of ${topic}, including nuanced details and edge cases.`
    };
    return intros[difficulty] || `Let's explore ${topic} together.`;
  }

  generateMainContent(topic, difficulty, style) {
    let content = `${topic} is a concept that helps us solve specific problems in its domain.\n\n`;
    
    if (style === 'step-by-step') {
      content += `**Step 1:** Understand the fundamental problem it addresses\n`;
      content += `**Step 2:** Learn the core components and how they interact\n`;
      content += `**Step 3:** See how it's applied in practice\n`;
      content += `**Step 4:** Practice with real-world scenarios\n`;
    } else if (style === 'technical') {
      content += `**Definition:** Formal specification and requirements\n`;
      content += `**Architecture:** Structural components and relationships\n`;
      content += `**Implementation:** Technical considerations and patterns\n`;
      content += `**Performance:** Optimization and scalability factors\n`;
    } else {
      content += `Think of ${topic} as a tool that helps you accomplish specific goals. `;
      content += `It works by combining several key principles that work together to produce results.`;
    }

    return content;
  }

  generateExamples(topic, difficulty) {
    let examples = `### Example 1: Basic Usage\n`;
    examples += `Here's a simple, practical example of ${topic} in action:\n`;
    examples += `- Set up the basic components\n`;
    examples += `- Apply the core concepts\n- Observe the results\n\n`;
    
    if (difficulty !== 'beginner') {
      examples += `### Example 2: Real-World Application\n`;
      examples += `In a production environment, ${topic} might be used to:\n`;
      examples += `- Handle complex scenarios\n`;
      examples += `- Optimize for performance\n`;
      examples += `- Integrate with other systems\n`;
    }

    return examples;
  }

  generateAnalogy(topic) {
    return `Imagine ${topic} as similar to organizing a library. Just as a library has systems for cataloging and retrieving books, ${topic} provides structure and methods for managing its domain. The librarian (the system) helps you find exactly what you need when you need it.`;
  }

  generateTakeaways(topic, difficulty) {
    let takeaways = `✓ ${topic} serves a specific purpose in its domain\n`;
    takeaways += `✓ Understanding the fundamentals is key to effective usage\n`;
    takeaways += `✓ Practical application reinforces theoretical knowledge\n`;
    
    if (difficulty === 'advanced') {
      takeaways += `✓ Edge cases and optimization require deeper exploration\n`;
      takeaways += `✓ Integration patterns matter for production systems\n`;
    }

    return takeaways;
  }

  suggestNextSteps(topic, difficulty) {
    let steps = `1. Practice with hands-on exercises\n`;
    steps += `2. Explore related concepts and advanced topics\n`;
    steps += `3. Build a small project using ${topic}\n`;
    steps += `4. Review best practices and common patterns\n`;
    
    return steps;
  }
}

module.exports = TutorAgent;