import fastify from 'fastify';
import cors from '@fastify/cors';
import { runAgent } from '@alphaarc/langchain-runtime';
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

const run = async () => {
  console.log('Starting server...');

  app.post('/api/run', async (request, reply) => {
    const { logger } = getRemoteLogger();

    const config = request.body;
    console.log("type of config", typeof config);
    runAgent({ logger, config });

    return new Response(logger.readable, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      }
    })
  });

  const port = parseInt(process.env.PORT || '3000', 10);

  app.listen({ port, host: '127.0.0.1' }, (err, address) => {
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