import axios, { AxiosError, AxiosInstance } from "axios";
import { AuthManager } from "./auth";


export interface SDKConfig {
  apiKey: string;
  baseURL?: string;
  authURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class AlphaArcSDK {
 
    private client: AxiosInstance;
    public authManager: AuthManager;

    constructor(config: SDKConfig) {
      this.authManager = new AuthManager(
        config.apiKey,
        config.authURL || `${config.baseURL || ''}/auth/exchange`
      );

      this.client = axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout || 10000,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        }
      });

      this.setupMiddleware();
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
      const res = await this.client.get(url);
      return res.data;
    }

    async post(url: string, data: any) {
      try {
        const res = await this.client.post(url, data);
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

    async query(query: string, timeInterval: { minutes: number, startBacktest: string }) {
      const result = await this.post('/data/query', { query, timeInterval });
      return {
        data: result.data,
        error: result.error
      }
    }

}