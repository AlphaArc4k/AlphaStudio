import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { AgentConfig } from "@alphaarc/types";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { AlphaArcSDK } from "@alphaarc/sdk";
import { z } from 'zod';

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

  const ts_start = new Date().getTime()

  const apiKey = config.llm.apiKey;

  logger.log('INFO', 'Initializing agent...');

  const buyToken = tool(async (input) => {
    logger.log('INFO', `Buying token ${input.address}..`)
    try {
      // TODO rpc helper
      const { data, error } = await sdk.post(`/rpc/trading/paper`, {
        id: '1',
        method: 'buy',
        params: {
          portfolio_uuid: '45ba3ed3-ed5e-43de-8ca2-a677cb034665',
          // TODO use agent id instead agent_uuid: config.id, 
          token_address: 'Cg93SZJkHePybZqGDuyXLf5Ag5sB2cpWfHUG8wNPpump',
          amount: 0.1 // sol
        }
      })
      if (error) {
        logger.log('ERROR', 'buyToken() tool: ' + error)
        return {
          error: error,
          status: 'error'
        }
      }
      logger.log('INFO', JSON.stringify(data, null, 2))
      return {
        status: 'success'
      }
    } catch (error: any) {
      const errorMessage = error.message
      logger.log('ERROR', errorMessage)
      return {
        error: errorMessage,
        status: 'error'
      }
    }
  }, {
    name: 'buy_token',
    description: 'Call to buy a token.',
    schema: z.object({
      address: z.string().describe("Solana token address of the token to buy"),
    })
  })

  const agentTools = [
    buyToken
  ];

  const provider = config.llm.provider
  logger.log('INFO', 'Using provider: "'+config.llm.provider+ '" model: "'+config.llm.model+'"')
  let agentModel
  if (provider === 'ollama') {
    agentModel = new ChatOllama({
      model: config.llm.model,
      temperature: 0,
      maxRetries: 2,
    })
  } else {
    agentModel = new ChatOpenAI({
      model: config.llm.model,
      openAIApiKey: apiKey,
      temperature: 0,
    });
  }
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
      logger.log('SUCCESS', 'Logged in as: ' + me.data.addressShort);

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
    return ''
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
      recursionLimit: 5,
    }
  );
  logger.log('TRACE', '', result)

  const response = result.messages[result.messages.length - 1]?.content;

  let duration =  (new Date().getTime() - ts_start) / 1000

  logger.log('SUCCESS', `Agent execution completed in ${duration} sec`);
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