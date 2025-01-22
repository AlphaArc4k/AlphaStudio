import { ChatOpenAI } from "@langchain/openai";
import { AgentConfig } from "@alphaarc/types";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

export interface RuntimeEnvironment {
  config: AgentConfig;
  logger: any;
}

export const runAgent = async (ctx: RuntimeEnvironment) => {

  const { logger, config } = ctx;
  const apiKey = config.llm.apiKey;

  logger.log('INFO', 'Initializing agent...');
  const agentTools : Array<DynamicStructuredTool> = [];
  const agentModel = new ChatOpenAI({
    model: config.llm.model,
    openAIApiKey: apiKey,
    temperature: 0,
  });
  const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
  });
  logger.log('INFO', 'Agent initialized.');

  logger.log('INFO', 'Building prompt...');
  const prompt = `
${config.info.character}
${config.info.task}
  `
  logger.log('PROMPT', prompt);

  logger.log('INFO', 'Invoking agent...');

  const result = await agent.invoke(
    {
    messages: [
      new HumanMessage(prompt),
    ],
    },
    {
      recursionLimit: 2,
    }
  );

  const response = result.messages[result.messages.length - 1]?.content;

  logger.log('RESULT', 'Agent execution completed', response);

  logger.close();
};