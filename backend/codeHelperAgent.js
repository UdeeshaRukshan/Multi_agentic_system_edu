// backend/codeHelperAgent.js - Assists with programming tasks
const Agent = require('./agent');

class CodeHelperAgent extends Agent {
  constructor() {
    super('Code Helper', 'Programming Assistant', ['coding', 'debugging', 'programming']);
  }

  async run(input, context) {
    this.log('💻 Analyzing coding request...');

    const codeAnalysis = this.analyzeCodeRequest(input);
    
    context.language = codeAnalysis.language;
    context.taskType = codeAnalysis.taskType;
    context.codeSnippet = codeAnalysis.codeSnippet;

    this.log(`Language: ${codeAnalysis.language || 'general'} | Task: ${codeAnalysis.taskType}`);

    const assistance = await this.provideAssistance(input, codeAnalysis);
    
    context.result = assistance;
    context.includesCode = true;

    this.addToMemory({ language: codeAnalysis.language, taskType: codeAnalysis.taskType });
    this.log('✓ Code assistance ready');

    return context;
  }

  analyzeCodeRequest(input) {
    const lower = input.toLowerCase();
    
    const language = this.detectLanguage(lower);
    const taskType = this.detectTaskType(lower);
    const codeSnippet = this.extractCodeSnippet(input);
    const hasError = lower.match(/error|bug|fix|debug|broken|doesn't work/) !== null;

    return { language, taskType, codeSnippet, hasError };
  }

  detectLanguage(lower) {
    if (lower.match(/\b(javascript|js|node|react|vue|angular)\b/)) return 'JavaScript';
    if (lower.match(/\b(python|py|django|flask)\b/)) return 'Python';
    if (lower.match(/\b(java|spring|hibernate)\b/)) return 'Java';
    if (lower.match(/\b(c\+\+|cpp)\b/)) return 'C++';
    if (lower.match(/\b(c#|csharp|\.net)\b/)) return 'C#';
    if (lower.match(/\b(typescript|ts)\b/)) return 'TypeScript';
    if (lower.match(/\b(ruby|rails)\b/)) return 'Ruby';
    if (lower.match(/\b(go|golang)\b/)) return 'Go';
    return null;
  }

  detectTaskType(lower) {
    if (lower.match(/debug|error|fix|bug|issue/)) return 'debugging';
    if (lower.match(/implement|create|build|write|code/)) return 'implementation';
    if (lower.match(/explain|understand|how.*work|what.*do/)) return 'explanation';
    if (lower.match(/optimize|improve|refactor|better/)) return 'optimization';
    if (lower.match(/review|check|correct/)) return 'review';
    return 'general';
  }

  extractCodeSnippet(input) {
    const codeBlock = input.match(/```[\s\S]*?```/);
    return codeBlock ? codeBlock[0] : null;
  }

  async provideAssistance(input, analysis) {
    let response = `# 💻 Code Assistance\n\n`;

    response += `**Task:** ${analysis.taskType}\n`;
    if (analysis.language) {
      response += `**Language:** ${analysis.language}\n`;
    }
    response += `\n---\n\n`;

    switch (analysis.taskType) {
      case 'debugging':
        response += this.provideDebuggingHelp(input, analysis);
        break;
      case 'implementation':
        response += this.provideImplementationHelp(input, analysis);
        break;
      case 'explanation':
        response += this.provideCodeExplanation(input, analysis);
        break;
      case 'optimization':
        response += this.provideOptimizationSuggestions(input, analysis);
        break;
      default:
        response += this.provideGeneralHelp(input, analysis);
    }

    response += `\n\n## 💡 Best Practices\n`;
    response += this.getBestPractices(analysis.language);

    response += `\n\n## 📖 Resources\n`;
    response += this.getResources(analysis.language);

    return response;
  }

  provideDebuggingHelp(input, analysis) {
    let help = `## 🐛 Debugging Guidance\n\n`;
    help += `### Common Issues to Check:\n\n`;
    help += `1. **Syntax Errors**\n   - Check for missing brackets, parentheses, or semicolons\n   - Verify proper indentation\n\n`;
    help += `2. **Logic Errors**\n   - Review conditional statements\n   - Check loop boundaries\n   - Verify variable assignments\n\n`;
    help += `3. **Runtime Errors**\n   - Check for null/undefined values\n   - Verify type compatibility\n   - Review error stack traces\n\n`;
    
    if (analysis.codeSnippet) {
      help += `### Your Code Analysis:\n`;
      help += `I can see you've provided code. Here's what to look for:\n`;
      help += `- Variable scope issues\n- Type mismatches\n- Edge case handling\n- Error handling blocks\n`;
    }

    help += `\n### Debugging Steps:\n`;
    help += `1. Add console.log/print statements to trace execution\n`;
    help += `2. Use a debugger to step through the code\n`;
    help += `3. Test with simple inputs first\n`;
    help += `4. Check documentation for the libraries/APIs used\n`;

    return help;
  }

  provideImplementationHelp(input, analysis) {
    let help = `## 🏗️ Implementation Guide\n\n`;
    
    const langTemplate = this.getLanguageTemplate(analysis.language);
    
    help += `### Suggested Approach:\n\n`;
    help += `1. **Plan the structure**\n   - Define inputs and outputs\n   - Identify key components\n   - Consider edge cases\n\n`;
    help += `2. **Write the code**\n\n`;
    
    if (langTemplate) {
      help += `\`\`\`${analysis.language.toLowerCase()}\n${langTemplate}\n\`\`\`\n\n`;
    }

    help += `3. **Test thoroughly**\n   - Unit tests for individual functions\n   - Integration tests for workflows\n   - Edge case validation\n\n`;
    help += `4. **Refine and optimize**\n   - Review for efficiency\n   - Add error handling\n   - Document the code\n`;

    return help;
  }

  provideCodeExplanation(input, analysis) {
    let explanation = `## 📖 Code Explanation\n\n`;
    explanation += `Let me break down the concept for you:\n\n`;
    explanation += `### How it Works:\n`;
    explanation += `The code accomplishes its task by following a structured approach:\n\n`;
    explanation += `1. **Initialization** - Setting up necessary variables and state\n`;
    explanation += `2. **Processing** - Executing the core logic\n`;
    explanation += `3. **Output** - Returning or displaying results\n\n`;
    explanation += `### Key Concepts:\n`;
    explanation += `- Variables store data that changes\n`;
    explanation += `- Functions encapsulate reusable logic\n`;
    explanation += `- Control flow determines execution order\n`;
    explanation += `- Data structures organize information efficiently\n`;

    return explanation;
  }

  provideOptimizationSuggestions(input, analysis) {
    let suggestions = `## ⚡ Optimization Suggestions\n\n`;
    suggestions += `### Performance Improvements:\n\n`;
    suggestions += `1. **Time Complexity**\n   - Review algorithm efficiency (Big O notation)\n   - Consider using more efficient data structures\n   - Minimize nested loops where possible\n\n`;
    suggestions += `2. **Space Complexity**\n   - Reduce unnecessary variable declarations\n   - Reuse objects when appropriate\n   - Clean up unused references\n\n`;
    suggestions += `3. **Code Quality**\n   - Remove duplicate code\n   - Extract reusable functions\n   - Improve naming for readability\n   - Add meaningful comments\n\n`;
    suggestions += `4. **Language-Specific**\n`;
    
    if (analysis.language === 'JavaScript') {
      suggestions += `   - Use const/let instead of var\n`;
      suggestions += `   - Leverage array methods (map, filter, reduce)\n`;
      suggestions += `   - Consider async/await for promises\n`;
    } else if (analysis.language === 'Python') {
      suggestions += `   - Use list comprehensions\n`;
      suggestions += `   - Leverage built-in functions\n`;
      suggestions += `   - Consider generators for large datasets\n`;
    }

    return suggestions;
  }

  provideGeneralHelp(input, analysis) {
    let help = `## 🎯 General Programming Guidance\n\n`;
    help += `Based on your request, here's how to approach it:\n\n`;
    help += `### Planning Phase:\n`;
    help += `- Clearly define the problem\n`;
    help += `- Break it into smaller sub-problems\n`;
    help += `- Identify required inputs and expected outputs\n\n`;
    help += `### Implementation Phase:\n`;
    help += `- Start with a simple solution\n`;
    help += `- Test incrementally\n`;
    help += `- Refactor for clarity\n\n`;
    help += `### Testing Phase:\n`;
    help += `- Test normal cases\n`;
    help += `- Test edge cases\n`;
    help += `- Test error conditions\n`;

    return help;
  }

  getLanguageTemplate(language) {
    const templates = {
      'JavaScript': `// Function template
function solveProblem(input) {
  // Validate input
  if (!input) {
    throw new Error('Invalid input');
  }
  
  // Process
  const result = processData(input);
  
  // Return result
  return result;
}

function processData(data) {
  // Implementation here
  return data;
}`,
      'Python': `def solve_problem(input_data):
    """
    Solve the problem with given input.
    
    Args:
        input_data: The input to process
        
    Returns:
        The processed result
    """
    # Validate input
    if not input_data:
        raise ValueError("Invalid input")
    
    # Process
    result = process_data(input_data)
    
    return result

def process_data(data):
    """Process the data."""
    # Implementation here
    return data`
    };

    return templates[language] || null;
  }

  getBestPractices(language) {
    let practices = `- Write clean, readable code\n`;
    practices += `- Use meaningful variable and function names\n`;
    practices += `- Keep functions small and focused\n`;
    practices += `- Handle errors gracefully\n`;
    practices += `- Write tests for your code\n`;
    practices += `- Document complex logic\n`;

    return practices;
  }

  getResources(language) {
    const resources = {
      'JavaScript': `- [MDN Web Docs](https://developer.mozilla.org/)\n- [JavaScript.info](https://javascript.info/)\n- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)`,
      'Python': `- [Python Official Docs](https://docs.python.org/)\n- [Real Python](https://realpython.com/)\n- [Python PEP 8 Style Guide](https://pep8.org/)`,
      'Java': `- [Oracle Java Docs](https://docs.oracle.com/javase/)\n- [Baeldung](https://www.baeldung.com/)\n- [Effective Java](https://www.oreilly.com/library/view/effective-java/9780134686097/)`
    };

    return resources[language] || `- Search for "${language} documentation"\n- Explore online tutorials and courses\n- Practice with coding challenges`;
  }
}

module.exports = CodeHelperAgent;