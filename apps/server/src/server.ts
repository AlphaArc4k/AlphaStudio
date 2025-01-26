import fastify from 'fastify';
import cors from '@fastify/cors';
import { AlphaArcSDK } from '@alphaarc/sdk';
import { AlphaArcRuntimeManager } from '@alphaarc/core';
import configUser from '../../../alpha.config';
import { AgentConfig } from '@alphaarc/types';

const app = fastify({
  logger: true
});

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

const getRemoteLogger = () => {

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  return {
    logger: {
      readable,
      writer,
      log: (type: string, msg: string, data?: any) => {
        writer.write(new TextEncoder().encode(JSON.stringify({ 
          timestamp: new Date().toISOString(),
          type, 
          message: msg, 
          data 
        }) + '\n'));
      },
      close: () => writer.close()
    }
  }
}

interface AppConfig {
  apiKey: string;
  baseURL: string;
  host: string;
  port: string;
  runtime: 'langchain' | 'rig' | string;
  binaryPath?: string;
}

const configDefault: AppConfig = {
  apiKey: '',
  baseURL: 'https://alphaarc.xyz/api/v1',
  host: '127.0.0.1',
  port: process.env.PORT || '3000',
  runtime: 'langchain'
}

const config: AppConfig = {
  ...configDefault,
  ...configUser
}

const run = async () => {
  console.log('Starting server...');

  const sdk = new AlphaArcSDK({
    apiKey: config.apiKey,
    baseURL: config.baseURL
  });

  await sdk.login()

  const runtimeManager = new AlphaArcRuntimeManager();

  const runtimeConfig = {
    binaryPath: config.runtime === 'rig' ? `${process.cwd()}/../../packages/arc-runtime/target/debug/arc-runtime` : '',
    runtime: config.runtime
  }

  app.post('/api/v1/rpc/agents/run', async (request, reply) => {
    const { logger } = getRemoteLogger();

    const config = request.body as AgentConfig;

    if(configUser.openAiApiKey && config) {
      config.llm.apiKey = configUser.openAiApiKey
    }

    runtimeManager.runAgentWithRuntime(runtimeConfig, { logger, config, sdk })
      .then(() => {
        // logger.log('SUCCESS', 'Agent execution completed');
      })
      .catch((err) => {
        logger.log('ERROR', 'Agent execution failed: Unknown error');
      })
      .finally(() => {
        logger.close();
      });

    return new Response(logger.readable, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      }
    })
  });

  // proxy the /query endpoint to the AlphaArc API
  app.post('/api/v1/data/query', async (request, reply) => {
    try {
      const params : any = request.body;
      const response = await sdk.query(params.query, params.timeInterval);
      return response.data;
    } catch (error) {
      return reply.status(500).send({
        error: error?.message || 'Unknown Error 1'
      });
    }
  });

  app.get('*', async (request, reply) => {
    if (!request.url.startsWith('/api/v1')) {
      return reply.status(400).send({
        error: 'Unknown API'
      });
    }
    try {
      const result = await sdk.get(request.url.replace('/api/v1', ''))
      if (result.error) {
        throw new Error(result.error)
      }
      return result.data
    } catch (error) {
      return reply.status(500).send({
        error: error?.message || 'Unknown Error 1'
      });
    }
  })

  app.post('*', async (request, reply) => {
    if (!request.url.startsWith('/api/v1')) {
      return reply.status(400).send({
        error: 'Unknown API'
      });
    }
    try {
      const data = request.body;
      const result = await sdk.post(request.url.replace('/api/v1', ''), data)
      return result
    } catch (error) {
      return reply.status(500).send({
        error: error?.message || 'Unknown Error 2'
      });
    }
  })

  const port = parseInt(config.port, 10);

  app.listen({ port, host: config.host }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at: ${address}`);
  });

};

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });