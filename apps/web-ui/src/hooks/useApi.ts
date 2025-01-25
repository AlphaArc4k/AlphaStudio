import axios, { AxiosError } from "axios"
import { AgentConfig } from "../lib/AgentConfig"

// TODO use type safe isomorphic SDK vs re-implementing all routes
export const useApi = () => {

  // FIXME get from dev host + port from settings or env
  const isProd = import.meta.env.MODE === 'production'
  const host = isProd ? `https://www.alphaarc.xyz/api/v1` : 'http://127.0.0.1:3000/api/v1'

  const client = axios.create({
    baseURL: host,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const fetcher = (url: string) => client.get(url, {
    withCredentials: isProd // include session cookies
  }).then((res) => res.data);

  const uploadAgentProfileImage = async () => {
    throw new Error("not implemented")
  }

  const getUser = async () => {
    try {
      const { data } = await client.get(`/me`, {
        withCredentials: isProd, // include session cookies
      })
      return data
    } catch (error) {
      console.log('Failed to get user', error)
    }
  }

  const saveConfig = async (config: AgentConfig) => {
    try {
      const { data } = await client.post(`/agents`, config)
      return {
        ...data
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error
        throw new Error(errorMessage || 'Unknown Server Error')
      } else {
        throw error
      }
    }
  }

  const getUserAgents = async () => {
    const { data } = await client.get(`/me/agents`)
    return data
  }

  const getUserAgentConfig = async (aid: string) => {
    const { data } = await client.get(`/me/agents/${aid}`)
    return data
  }

  const deployAgent = async () => {
    throw new Error("not implemented")
  }

  const queryData = async (userQuery: string, timeInterval: AgentConfig["data"]["timeRange"]["sliding"]) => {
    const { data } = await client.post(`/data/query`, { 
      query: userQuery,
      timeInterval,
    });
    return {
      ...data
    }
  }

  const getTwitterAuthLink = async (_aid: string) => {
   throw new Error('not implemented')
  }

  const getTwitterAuthCallback = async (_aid: string) => {
    throw new Error('not implemented')
  }

  return {
    host,
    fetcher,
    getUser,
    getUserAgents,
    getUserAgentConfig,
    uploadAgentProfileImage,
    saveConfig,
    deployAgent,
    queryData,
    getTwitterAuthLink,
    getTwitterAuthCallback
  }
}