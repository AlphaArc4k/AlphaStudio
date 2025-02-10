import axios, { AxiosError, AxiosInstance } from "axios";
import { AuthManager } from "./auth";
import EventEmitter from "events";


export interface SDKConfig {
  apiKey: string;
  baseURL?: string;
  authURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Authenticated user API
class UserApi {

  constructor(private client: AxiosInstance) {}

  public async getAgents() {
    return this.client.get(`/me/agents`)
  }
}

export class AlphaArcSDK {
 
    private client: AxiosInstance;
    public authManager: AuthManager;
    public me: UserApi;

    constructor(config: SDKConfig) {
      this.authManager = new AuthManager(
        config.apiKey,
        config.authURL || `${config.baseURL || ''}/auth/exchange`
      );

      this.client = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout || 20_000,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        }
      });

      this.setupMiddleware();

      this.me = new UserApi(this.client)
    }

    private setupMiddleware() {
      this.client.interceptors.request.use(async (config) => {
        if (this.authManager.accessToken) {
          config.headers['Authorization'] = `Bearer ${this.authManager.accessToken}`;
        }
        return config;
      });

      this.client.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401) {
            await this.authManager.exchangeToken();
            return this.client.request(error.config);
          }
          return Promise.reject(error);
        }
      );
    }

    get isLoggedIn() {
      return !!this.authManager.accessToken;
    }

    async login() {
      await this.authManager.exchangeToken();
    }

    async get(url: string) {
      try {
        const res = await this.client.get(url);
        return { data: res.data, error: undefined };
      } catch (error: AxiosError | any) {
          // get response from axios error
          if (error.response) {
            if (!error.response.data) {
              throw error;
            }
            return { data: undefined, error: error.response?.data?.error };
          } else {
            throw error;
          }
      }
    }

    async post(url: string, data: any) {
      try {
        const { data: result } = await this.client.post(url, data);

        // handle json-rpc
        if (result.error) {
          return { data: undefined, error: result.error}
        }

        return { data: result, error: undefined };
      } catch (error: AxiosError | any) {
        // get response from axios error
        if (error.response) {
          if (!error.response.data) {
            throw error;
          }
          return { data: undefined, error: error.response?.data?.error };
        } else {
          throw error;
        }
      }
    }

    async query(query: string, timeInterval: { minutes: number, startBacktest: string }) {
      const result = await this.post('/data/query', { query, timeInterval });
      return {
        data: result.data,
        error: result.error
      }
    }

}