import { useApi } from './useApi'
import { useEffect, useState } from 'react'

export interface Position {
  id: string;
  token: {
    symbol: string;
    name: string;
    image?: string;
    address: string;
  };
  amount: number;
  value: number;
  averagePrice: number;
  currentPrice: number;
  pnl: {
    value: number;
    percentage: number;
  };
  allocation: number;
}

export interface Portfolio {
  portfolio_sol_balance: number;
  positions: Position[];
  total_portfolio_value_usd: number;
}

export const usePaperPortfolio = (agentId?: string) => {
  
  const [portfolio, setPortfolio] = useState<Portfolio | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const { getPortfolioByAgentId } = useApi()

  useEffect(() => {
    if(!agentId) return
    setIsLoading(true)
    getPortfolioByAgentId(agentId)
      .then(portfolio => setPortfolio(portfolio))
      .catch(e => setError(e?.message || 'Unknown Error'))
      .finally(() => setIsLoading(false))
    return () => {}
  }, [agentId])
  
  return {
    portfolio,
    isLoading,
    error
  }
}