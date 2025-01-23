import { ChatOpenAI } from "@langchain/openai";
import { AgentConfig } from "@alphaarc/types";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { AlphaArcSDK } from "@alphaarc/sdk";

export interface RuntimeEnvironment {
  config: AgentConfig;
  logger: any;
  sdk: AlphaArcSDK;
}

const isEmptyData = (data: any) => {
  if (!data) return true;
  if (Array.isArray(data) && data.length === 0) return true;
  if (Object.keys(data).length === 0) return true;
  return false;
}

const _runAgent = async (ctx: RuntimeEnvironment) => {
  const { logger, config, sdk } = ctx;

  const apiKey = config.llm.apiKey;

  logger.log('INFO', 'Initializing agent...');
  const agentTools: Array<DynamicStructuredTool> = [];
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

  try {
    if (!sdk.isLoggedIn) {
      logger.log('INFO', 'SDK login...');
      await sdk.login()

      const me = await sdk.get('/me')
      logger.log('SUCCESS', 'Logged in as: ' + me.addressShort);

    }
  } catch (error) {
    logger.log('ERROR', 'Failed to authenticate SDK with server', error);
  }

  // get data from the SDK
  let injectedData = {};
  if (config.data.userQuery !== undefined) {
    const minutes = config.data.timeRange?.sliding?.minutes;
    if (!minutes) {
      logger.log('ERROR', 'Data Error: Time range not set');
      return
    }
    const startBacktest = config.data.timeRange?.sliding?.startBacktest;
    if (!startBacktest) {
      logger.log('ERROR', 'Data Error: Datetime offset not set');
      return
    }
    let parts = startBacktest.split('T');
    // TODO improve date formatting
    logger.log('INFO', `Fetching data for ${parts[0]} ${parts[1].split('.')[0]} on ${minutes} minute interval`);
    const timeInterval = { minutes, startBacktest };
    const { data, error: queryError } = await sdk.query(config.data.userQuery, timeInterval);
    if (queryError) {
      logger.log('ERROR', 'Failed to fetch data from server: ' + queryError);
      return
    }
    injectedData = data.result.data;
    logger.log('SUCCESS', `Received data from server in ${data.result.time}`);
  }

  const dataToJsonPrompt = () => {
    const jsonPrompt = `
# Data to analyze:
## Time Frame:
Start_Date: ${config.data.timeRange?.sliding?.startBacktest}
## Data:`
    if (isEmptyData(injectedData)) {
      return jsonPrompt + `
No data available`;
    }
    return jsonPrompt +`
\`\`\`json
${JSON.stringify(injectedData, null, 2)}
\`\`\`
`
  };

  logger.log('INFO', 'Building prompt...');
  const prompt = `
${config.info.character}
${config.info.task}
${dataToJsonPrompt()}
  `
  logger.log('SUCCESS', 'Prompt available');
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

  logger.log('SUCCESS', 'Agent execution completed');
  logger.log('RESULT', 'Agent execution completed', response);
}

export const runAgent = async (ctx: RuntimeEnvironment) => {

  const { logger, config, sdk } = ctx;
  try {
    await _runAgent(ctx);
  } catch (error) {
    // log error case by case
    console.error(error);
    logger.log('ERROR', 'Agent execution failed: Unknown error');
  }
  finally {
  }

};