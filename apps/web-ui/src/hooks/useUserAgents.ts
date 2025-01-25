import useSWR from 'swr'
import { useApi } from './useApi'

export const useUserAgents = () => {

  const { fetcher } = useApi()

  const { data, error, isValidating } = useSWR(`/me/agents`, fetcher)

  if (error) {
    return {
      agents: [],
      isLoading: false,
      error: error.message || 'Unknown Error'
    }
  }

  if (isValidating) {
    return {
      agents: [],
      isLoading: true,
      error: null
    }
  }

  return {
    agents: data?.agents || [],
    isLoading: false,
    error: null
  }
}