// backend/planningAgent.js - Creates learning plans and roadmaps
const Agent = require('./agent');

class PlanningAgent extends Agent {
  constructor() {
    super('Planning Agent', 'Learning Path Designer', ['planning', 'curriculum', 'roadmap']);
  }

  async run(input, context) {
    this.log('📋 Creating learning plan...');

    const planDetails = this.analyzePlanRequest(input);
    
    context.subject = planDetails.subject;
    context.timeframe = planDetails.timeframe;
    context.skillLevel = planDetails.skillLevel;
    context.goals = planDetails.goals;

    this.log(`Subject: ${planDetails.subject} | Level: ${planDetails.skillLevel} | Duration: ${planDetails.timeframe}`);

    const plan = await this.createLearningPlan(input, planDetails);
    
    context.result = plan;
    context.includesMilestones = true;

    this.addToMemory({ subject: planDetails.subject, timeframe: planDetails.timeframe });
    this.log('✓ Learning plan complete');

    return context;
  }

  analyzePlanRequest(input) {
    const lower = input.toLowerCase();
    
    const subject = this.extractSubject(input);
    const timeframe = this.detectTimeframe(lower);
    const skillLevel = this.detectSkillLevel(lower);
    const goals = this.extractGoals(input);
    const hasDeadline = lower.match(/by|before|until/) !== null;

    return { subject, timeframe, skillLevel, goals, hasDeadline };
  }

  extractSubject(input) {
    const match = input.match(/(?:learn|study|master|about)\s+([a-zA-Z0-9\s]+?)(?:\s+in|\s+by|\s+for|$)/i);
    return match ? match[1].trim() : 'the specified subject';
  }

  detectTimeframe(lower) {
    if (lower.match(/1\s*week|7\s*days?/)) return '1 week';
    if (lower.match(/2\s*weeks?|14\s*days?/)) return '2 weeks';
    if (lower.match(/1\s*month|30\s*days?/)) return '1 month';
    if (lower.match(/3\s*months?|quarter/)) return '3 months';
    if (lower.match(/6\s*months?|half\s+year/)) return '6 months';
    if (lower.match(/1\s*year|12\s*months?/)) return '1 year';
    return '1 month'; // default
  }

  detectSkillLevel(lower) {
    if (lower.match(/beginner|start|new to|never/)) return 'beginner';
    if (lower.match(/intermediate|some experience|familiar/)) return 'intermediate';
    if (lower.match(/advanced|expert|master|deep/)) return 'advanced';
    return 'beginner'; // safe default
  }

  extractGoals(input) {
    const goals = [];
    const lower = input.toLowerCase();

    if (lower.match(/job|career|work/)) goals.push('Career advancement');
    if (lower.match(/project|build|create/)) goals.push('Build projects');
    if (lower.match(/exam|test|certification/)) goals.push('Pass certification');
    if (lower.match(/understand|knowledge|learn/)) goals.push('Deep understanding');

    return goals.length > 0 ? goals : ['General knowledge'];
  }

  async createLearningPlan(input, details) {
    let plan = `# 📚 Learning Plan: ${details.subject}\n\n`;
    
    plan += `**Skill Level:** ${details.skillLevel.charAt(0).toUpperCase() + details.skillLevel.slice(1)}\n`;
    plan += `**Duration:** ${details.timeframe}\n`;
    plan += `**Goals:** ${details.goals.join(', ')}\n\n`;
    plan += `---\n\n`;

    // Overview
    plan += `## 🎯 Overview\n\n`;
    plan += this.generateOverview(details);
    plan += `\n\n`;

    // Phases
    const phases = this.generatePhases(details);
    plan += `## 📅 Learning Phases\n\n`;
    
    phases.forEach((phase, idx) => {
      plan += `### Phase ${idx + 1}: ${phase.name} (${phase.duration})\n\n`;
      plan += `**Objectives:**\n`;
      phase.objectives.forEach(obj => {
        plan += `- ${obj}\n`;
      });
      plan += `\n**Topics to Cover:**\n`;
      phase.topics.forEach(topic => {
        plan += `- ${topic}\n`;
      });
      plan += `\n**Practical Exercises:**\n`;
      phase.exercises.forEach(ex => {
        plan += `- ${ex}\n`;
      });
      plan += `\n**Milestone:** ${phase.milestone}\n\n`;
    });

    // Resources
    plan += `## 📖 Recommended Resources\n\n`;
    plan += this.generateResources(details);
    plan += `\n\n`;

    // Study Tips
    plan += `## 💡 Study Tips\n\n`;
    plan += this.generateStudyTips(details);
    plan += `\n\n`;

    // Progress Tracking
    plan += `## ✅ Progress Tracking\n\n`;
    plan += this.generateProgressTracking(details);

    return plan;
  }

  generateOverview(details) {
    return `This ${details.timeframe} learning plan is designed for ${details.skillLevel} learners who want to master ${details.subject}. The plan is structured to build your knowledge progressively, from foundational concepts to advanced applications. Each phase includes hands-on exercises to reinforce learning.`;
  }

  generatePhases(details) {
    const phaseCount = this.getPhaseCount(details.timeframe);
    const phases = [];

    if (details.skillLevel === 'beginner') {
      phases.push({
        name: 'Fundamentals',
        duration: this.calculatePhaseDuration(details.timeframe, phaseCount, 0),
        objectives: [
          'Understand core concepts and terminology',
          'Set up development environment',
          'Complete basic exercises'
        ],
        topics: [
          'Introduction and key concepts',
          'Basic syntax and structure',
          'Essential tools and setup',
          'Simple examples and patterns'
        ],
        exercises: [
          'Follow guided tutorials',
          'Complete beginner exercises',
          'Build a simple project'
        ],
        milestone: 'Complete foundational knowledge assessment'
      });

      if (phaseCount >= 2) {
        phases.push({
          name: 'Intermediate Concepts',
          duration: this.calculatePhaseDuration(details.timeframe, phaseCount, 1),
          objectives: [
            'Apply concepts to real scenarios',
            'Understand best practices',
            'Build confidence with hands-on work'
          ],
          topics: [
            'Intermediate patterns and techniques',
            'Error handling and debugging',
            'Working with libraries/frameworks',
            'Project organization'
          ],
          exercises: [
            'Build 2-3 medium-sized projects',
            'Contribute to open source',
            'Solve practice problems'
          ],
          milestone: 'Complete a portfolio project'
        });
      }

      if (phaseCount >= 3) {
        phases.push({
          name: 'Advanced Application',
          duration: this.calculatePhaseDuration(details.timeframe, phaseCount, 2),
          objectives: [
            'Master advanced techniques',
            'Build production-ready solutions',
            'Develop personal expertise'
          ],
          topics: [
            'Advanced patterns and architectures',
            'Performance optimization',
            'Testing and deployment',
            'Real-world applications'
          ],
          exercises: [
            'Build a comprehensive capstone project',
            'Optimize existing projects',
            'Teach concepts to others'
          ],
          milestone: 'Deploy a production application'
        });
      }
    } else {
      // For intermediate/advanced learners
      phases.push({
        name: 'Core Mastery',
        duration: this.calculatePhaseDuration(details.timeframe, phaseCount, 0),
        objectives: [
          'Deepen understanding of advanced topics',
          'Learn industry best practices',
          'Work on complex problems'
        ],
        topics: [
          'Advanced concepts and techniques',
          'Architecture and design patterns',
          'Performance and scalability',
          'Security considerations'
        ],
        exercises: [
          'Solve advanced challenges',
          'Refactor complex codebases',
          'Implement design patterns'
        ],
        milestone: 'Complete advanced certification or project'
      });

      if (phaseCount >= 2) {
        phases.push({
          name: 'Specialization',
          duration: this.calculatePhaseDuration(details.timeframe, phaseCount, 1),
          objectives: [
            'Specialize in chosen area',
            'Contribute to community',
            'Build expertise'
          ],
          topics: [
            'Specialized domain knowledge',
            'Cutting-edge techniques',
            'Research and innovation',
            'Leadership and mentoring'
          ],
          exercises: [
            'Lead a complex project',
            'Write technical articles/tutorials',
            'Mentor others'
          ],
          milestone: 'Become recognized expert in the field'
        });
      }
    }

    return phases;
  }

  getPhaseCount(timeframe) {
    if (timeframe.includes('week')) return 1;
    if (timeframe === '1 month') return 2;
    if (timeframe === '3 months' || timeframe === '6 months') return 3;
    return 4;
  }

  calculatePhaseDuration(totalTime, phaseCount, phaseIndex) {
    // Simple equal distribution
    const unit = totalTime.split(' ')[1]; // 'weeks', 'months', etc
    const duration = parseInt(totalTime.split(' ')[0]);
    const perPhase = Math.ceil(duration / phaseCount);
    
    if (unit.includes('week')) {
      return `${perPhase} week${perPhase > 1 ? 's' : ''}`;
    } else if (unit.includes('month')) {
      return `${perPhase} month${perPhase > 1 ? 's' : ''}`;
    }
    return `${perPhase} ${unit}`;
  }

  generateResources(details) {
    let resources = `### Online Courses\n`;
    resources += `- Interactive platforms (Coursera, Udemy, edX)\n`;
    resources += `- Video tutorials (YouTube, freeCodeCamp)\n`;
    resources += `- Official documentation and guides\n\n`;
    
    resources += `### Books\n`;
    resources += `- Beginner-friendly introductions\n`;
    resources += `- In-depth technical references\n`;
    resources += `- Best practices and patterns\n\n`;
    
    resources += `### Practice Platforms\n`;
    resources += `- Coding challenges (LeetCode, HackerRank)\n`;
    resources += `- Project-based learning sites\n`;
    resources += `- Community forums (Stack Overflow, Reddit)\n`;

    return resources;
  }

  generateStudyTips(details) {
    let tips = `- **Consistency is key:** Study a little bit every day rather than cramming\n`;
    tips += `- **Practice actively:** Build projects and solve problems, don't just read\n`;
    tips += `- **Join communities:** Connect with others learning the same subject\n`;
    tips += `- **Teach others:** Explaining concepts solidifies your understanding\n`;
    tips += `- **Take breaks:** Use the Pomodoro technique (25min work, 5min break)\n`;
    tips += `- **Review regularly:** Revisit previous topics to reinforce learning\n`;
    tips += `- **Track progress:** Keep a learning journal or use project milestones\n`;

    return tips;
  }

  generateProgressTracking(details) {
    let tracking = `**Weekly Goals:**\n`;
    tracking += `- [ ] Complete assigned topics for the week\n`;
    tracking += `- [ ] Finish practice exercises\n`;
    tracking += `- [ ] Review and document learnings\n\n`;
    
    tracking += `**Monthly Review:**\n`;
    tracking += `- Assess understanding of covered material\n`;
    tracking += `- Identify areas needing more practice\n`;
    tracking += `- Adjust plan based on progress\n\n`;
    
    tracking += `**Final Assessment:**\n`;
    tracking += `- Complete capstone project\n`;
    tracking += `- Self-evaluate against learning objectives\n`;
    tracking += `- Plan next steps for continued growth\n`;

    return tracking;
  }
}

module.exports = PlanningAgent;