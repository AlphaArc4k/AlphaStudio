export type { AgentConfig } from "@alphaarc/types";

export const validateConfig = (config: any) => {
  const configProperties = ['info', 'data', 'llm']
  for (const prop of configProperties) {
    if (!config[prop]) {
      return { error: `Invalid config:\nmissing property: ${prop}`, valid: false };
    }
  }

  if (!config.info.name) {
    return { error: 'Invalid config:\nmissing agent name', valid: false };
  }

  if (!config.info.description) {
    return { error: 'Invalid config:\nmissing agent description', valid: false };
  }

  if (!config.llm?.provider) {
    return { error: 'Invalid config:\nmissing llm provider', valid: false };
  }
  if (!config.llm.apiKey) {
    return { error: 'Invalid config:\nmissing llm apiKey', valid: false };
  }

  return { valid: true };
}