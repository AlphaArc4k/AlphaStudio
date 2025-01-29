import { spawn } from 'child_process';
import { AgentConfig, Model } from '@alphaarc/types';
import { AlphaArcSDK } from '@alphaarc/sdk';
import { runAgent } from '@alphaarc/langchain-runtime';
import ollama from 'ollama'

// FIXME duplicated code
export interface RuntimeEnvironment {
  config: AgentConfig;
  logger: any;
  sdk: AlphaArcSDK;
}

export interface RuntimeConfig {
  binaryPath: string;
  runtime: 'langchain' | 'rig';
}

const runAgentBinary = async (binaryPath: string, ctx: RuntimeEnvironment) => {
  const { config, logger, sdk } = ctx;

  const _process = spawn(binaryPath, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: false,
    shell: false,
  });

  let buffer = '';
  _process.stdout.on('data', (data) => {
    try {
      // Append new data to the buffer
      buffer += data.toString();

      const lines = buffer.split(':log:\n');

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';

      lines.forEach((line: string) => {
        if (!line.trim()) return; // Skip empty lines
        try {
          console.log('parse', line); // Debugging
          const log_obj = JSON.parse(line);
          if (log_obj.log_type) {
            logger.log(log_obj.log_type, log_obj.message, log_obj.data);
          }
        } catch (error) {
          console.log('log parse error', error);
          logger.log('INFO', line); // Log raw line on failure
        }
      });
    } catch (error) {
      console.log("log parse error", error)
      logger.log('INFO', data.toString());
    }
  });

  _process.stderr.on('data', (data) => {
    logger.log('ERROR', data.toString());
  });

  _process.on('close', (code) => {
    console.log('Agent process exited with code', code);
    logger.log('INFO', `Agent process exited with code ${code}`);
  });

  _process.on('error', (err) => {
    console.log('Agent process error', err.toString());
    logger.log('ERROR', err.toString());
  });

  // if node process exits, kill the agent process
  process.on('exit', () => {
    console.log('Node process exited, killing agent process');
    _process.kill();
  });
  process.on('SIGINT', () => {
    _process.kill();
  });
  process.on('SIGTERM', () => {
    _process.kill();
  });

  // Send config to the agent process
  const stdin: any = _process.stdin;
  if (!stdin) {
    logger.log('ERROR', 'Failed to open stdin');
    return;
  }
  try {
    stdin.write(JSON.stringify(config));
    stdin.end(); // Signal the end of input
  } catch (error) {
    logger.log('ERROR', 'Failed to write config to stdin');    
  }

  // await process close
  await new Promise((resolve) => {
    _process.on('close', (code) => {
      resolve(code);
    });
  });
};

// TODO utils
function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

export class AlphaArcRuntimeManager {

  public async listModels() : Promise<Model[]> {
    const list = await ollama.list()
    // TODO load from file or api
    const availableModels : Model[] = [
      {
        name: 'deepseek-r1:8b',
        model: 'deepseek-r1:8b',
        status: 'available',
        size: '4.7GB'
      },
      {
        name: 'llama3.2:latest',
        model: 'llama3.2:latest',
        status: 'available',
        size: '1.88GB'
      },
      {
        name: 'phi4',
        model: 'phi4',
        status: 'available',
        size: '9.1GB'
      }
    ]
    const installedModels: Model[] = list.models.map(model => ({
      name: model.name,
      model: model.name,
      status: 'installed',
      installedAt: model.modified_at,
      size: formatBytes(model.size),
      details: model.details
    }))
    const installedModelNames = new Set(installedModels.map(m => m.name));
  
    // Filter out available models that are already installed
    const newAvailableModels = availableModels.filter(model => 
      !installedModelNames.has(model.name)
    )
    return [
      ...newAvailableModels,
      ...installedModels
    ]
  }

  public async installModel(model: string) {
    const response = await ollama.pull({
      model: model,
      stream: true
    })
    return response
  }

  public async runAgentWithRuntime({
    runtime = 'langchain',
    binaryPath
  } : RuntimeConfig, ctx: RuntimeEnvironment) {

    const { config, logger, sdk } = ctx;

    try {
      if (runtime === 'langchain') {
        logger.log('INFO', `Running agent "${config.info.name}" with Langchain runtime 🦜⛓️`);
        await runAgent(ctx);
      } else {
        // rig runtime
        logger.log('INFO', `Running agent "${config.info.name}" with Arc/RIG runtime 🦀`);
        await runAgentBinary(binaryPath, ctx);
      }
    } catch (error) {
      console.error('Failed to run agent binary', error);
    }
  }

}
