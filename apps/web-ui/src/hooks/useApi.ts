import axios, { AxiosError } from "axios"
import { AgentConfig } from "../lib/AgentConfig"

export const useApi = () => {

  // FIXME get from dev host + port from settings or env
  const host = import.meta.env.MODE === 'production' ? `https://alphaarc.xyz/api/v1` : 'http://127.0.0.1:3000/api/v1'

  const uploadAgentProfileImage = async () => {
    throw new Error("not implemented")
  }

  const getUser = async () => {
    try {
      const { data } = await axios.get(`${host}/me`)
      return data
    } catch (error) {
      console.log('Failed to get user', error)
    }
  }

  const saveConfig = async (config: AgentConfig) => {
    try {
      const { data } = await axios.post(`${host}/agents`, config)
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

  const deployAgent = async () => {
    throw new Error("not implemented")
  }

  const queryData = async (userQuery: string, timeInterval: AgentConfig["data"]["timeRange"]["sliding"]) => {
    const { data } = await axios.post(`${host}/data/query`, { 
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
    getUser,
    uploadAgentProfileImage,
    saveConfig,
    deployAgent,
    queryData,
    getTwitterAuthLink,
    getTwitterAuthCallback
  }
}