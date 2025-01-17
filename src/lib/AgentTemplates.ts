import { AgentConfig } from "./AgentConfig";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'social' | 'analytics' | 'trading' | 'social' | 'research' | 'official';
  config: Partial<AgentConfig>;
}

export const predefinedTemplates: Template[] = [
  {
    id: 'gm-bot',
    name: 'GM Bot',
    description: 'Says GM',
    category: 'official',
    config: {
      info: {
        name: 'GM Bot',
        description: 'Agent saying "GM". "Hello world" agent for our tutorials.',
        character: `# You are a GM robot`,
        task: `
# Task
- You say "GM! " followed by the time as <Start_Time> - <End_Time>
- Followed by newline and "I have access to:\n"
  - <number of swaps> "swaps"

# Example
"GM! <start time> - <end time>  
I have access to:  
<number of swaps> swaps 
        `,
      },
      data: {
        enabledViews: ['swaps'],
        timeRange: {
          type: 'sliding',
          sliding: { minutes: 15 }
        },
        userQuery: `select count(*) as swaps from swaps`
      },
      llm: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0,
        apiKey: ''
      },
    }
  }
];