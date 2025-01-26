import axios, { AxiosError } from "axios"
import { AgentConfig } from "../lib/AgentConfig"

// TODO use type safe isomorphic SDK vs re-implementing all routes
export const useApi = () => {

  // FIXME get from dev host + port from settings or env
  const isProd = import.meta.env.MODE === 'production'
  const host = isProd ? `https://www.alphaarc.xyz/api/v1` : 'http://127.0.0.1:3000/api/v1'

  const client = axios.create({
    baseURL: host,
    withCredentials: isProd,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const post = async (url: string, data: any) => {
    try {
      const { data: result } = await client.post(url, {
        ...data
      })
      return result
    } catch(error: any) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error
        throw new Error(errorMessage || 'Unknown Server Error')
      } else {
        throw error
      }
    }
  }
  
  const fetcher = (url: string) => client.get(url, {
    withCredentials: isProd // include session cookies
  }).then((res) => res.data);

  const uploadAgentProfileImage = async () => {
    throw new Error("not implemented")
  }

  const getUser = async () => {
    try {
      const { data } = await client.get(`/me`)
      return data
    } catch (error) {
      console.log('Failed to get user', error)
    }
  }

  const saveConfig = async (config: AgentConfig) => {
    const data = await post(`/me/agents`, config)
    if (data.error) {
      throw new Error(data.error)
    }
    return data.data
  }

  const getUserAgents = async () => {
    const { data } = await client.get(`/me/agents`)
    return data
  }

  const getUserAgentConfig = async (aid: string) => {
    const { data } = await client.get(`/me/agents/${aid}`)
    return data
  }

  const queryData = async (userQuery: string, timeInterval: AgentConfig["data"]["timeRange"]["sliding"]) => {
    if (!userQuery) {
      throw new Error('Query is required.')
    }
    const data = await post(`/data/query`, { 
      query: userQuery,
      timeInterval,
    })
    return data
  }

  const getTwitterAuthLink = async (aid: string) => {
    const { data } = await client.get(`/me/agents/${aid}/integrations/x`)
    return data?.authUrl
  }

  const getTwitterAuthCallback = async (aid: string) => {
    const { data } = await client.get(`/me/agents/${aid}/integrations/x?callback=true`)
    return data?.callbackUrl
  }

  return {
    isProd,
    host,
    fetcher,
    getUser,
    getUserAgents,
    getUserAgentConfig,
    uploadAgentProfileImage,
    saveConfig,
    queryData,
    getTwitterAuthLink,
    getTwitterAuthCallback
  }
}