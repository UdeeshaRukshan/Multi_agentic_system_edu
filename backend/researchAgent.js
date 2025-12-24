// backend/researchAgent.js - Gathers and synthesizes information
const Agent = require('./agent');

class ResearchAgent extends Agent {
  constructor() {
    super('Research Agent', 'Information Gatherer & Synthesizer', ['research']);
  }

  async run(input, context) {
    this.log('🔍 Starting research process...');

    const topics = this.extractTopics(input);
    const searchQueries = this.generateSearchQueries(input, topics);

    context.researchTopics = topics;
    context.searchQueries = searchQueries;

    this.log(`Topics identified: ${topics.join(', ')}`);

    const findings = await this.gatherInformation(topics, input);
    const synthesis = this.synthesizeInformation(findings, input);
    
    context.researchFindings = findings;
    context.result = this.formatOutput(synthesis, findings);

    this.addToMemory({ topics, queryCount: searchQueries.length });
    this.log('✓ Research complete');

    return context;
  }

  extractTopics(input) {
    const words = input.toLowerCase()
      .replace(/[?!.,;:]/g, '')
      .split(' ')
      .filter(word => word.length > 3);

    const stopWords = ['what', 'when', 'where', 'which', 'who', 'how', 'does', 'this', 'that', 'with', 'from', 'about', 'have', 'been', 'were', 'their', 'there'];
    
    return [...new Set(words.filter(word => !stopWords.includes(word)))].slice(0, 5);
  }

  generateSearchQueries(input, topics) {
    const queries = [
      input,
      `${topics[0]} definition explanation`,
      `${topics.slice(0, 2).join(' ')} overview`,
      `how ${topics[0]} works`,
      `${topics[0]} examples use cases`
    ];
    return queries.filter(Boolean);
  }

  async gatherInformation(topics, query) {
    // Simulated research - in production, integrate APIs
    const mainTopic = topics[0] || 'general topic';
    
    return {
      summary: `${mainTopic} is a fundamental concept that plays a crucial role in its domain. It involves understanding core principles and practical applications.`,
      
      sources: [
        { 
          title: `Understanding ${mainTopic}`, 
          type: 'article',
          relevance: 0.95,
          snippet: `Comprehensive guide covering the basics and advanced aspects of ${mainTopic}.`
        },
        { 
          title: `${mainTopic} in Practice`, 
          type: 'tutorial',
          relevance: 0.87,
          snippet: `Real-world examples and case studies demonstrating practical applications.`
        },
        {
          title: `History and Evolution of ${mainTopic}`,
          type: 'reference',
          relevance: 0.78,
          snippet: `Historical context and how the concept has developed over time.`
        }
      ],
      
      keyFacts: [
        `${mainTopic} originated from practical needs in the field`,
        'It has evolved significantly with technological advances',
        'Multiple approaches and methodologies exist',
        'Widely applicable across various domains',
        'Continues to be an active area of development'
      ],
      
      relatedTopics: topics.slice(1).concat(['applications', 'best practices', 'common patterns']),
      
      confidence: 0.85,
      depth: 'comprehensive'
    };
  }

  synthesizeInformation(findings, originalQuery) {
    return {
      mainAnswer: `Based on the research, ${findings.summary}`,
      detailedExplanation: findings.keyFacts.join('\n• '),
      sources: findings.sources,
      furtherReading: findings.relatedTopics
    };
  }

  formatOutput(synthesis, findings) {
    let output = `# 🔍 Research Results\n\n`;
    output += `## Summary\n${synthesis.mainAnswer}\n\n`;
    output += `## Key Findings\n`;
    output += `• ${findings.keyFacts.join('\n• ')}\n\n`;
    output += `## Sources (${findings.sources.length})\n`;
    
    findings.sources.forEach((source, idx) => {
      output += `${idx + 1}. **${source.title}** (${source.type}, ${(source.relevance * 100).toFixed(0)}% relevant)\n`;
      output += `   ${source.snippet}\n\n`;
    });
    
    output += `## Related Topics to Explore\n`;
    output += `${findings.relatedTopics.map(t => `- ${t}`).join('\n')}\n\n`;
    output += `*Research Confidence: ${(findings.confidence * 100).toFixed(0)}% | Depth: ${findings.depth}*`;
    
    return output;
  }
}

module.exports = ResearchAgent;