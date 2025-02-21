import React, { useState } from 'react';
import { ChartCandlestick } from 'lucide-react';
import { BaseTool } from './BaseTool';
import { LoadingButton } from '../../../components/LoadingButton';
import { sleep } from '../../../lib/utils';
import { Spinner } from '../../../components/Spinner';
import { useAgentId } from '../../../hooks/useAgentId';
import { usePaperPortfolio } from '../../../hooks/usePaperPortfolio';

interface PaperTradingToolProps { }

export const PaperTradingTool: React.FC<PaperTradingToolProps> = ({

}) => {

  const [isCreatingPortfolio, setIsCreatingPortfolio] = useState(false)
  const agentId = useAgentId()
  // TODO: add getBalance and use here for better perf
  const { portfolio, isLoading: isLoadingPortfolio, error: portfolioError } = usePaperPortfolio(agentId)

  async function handleCreatePortfolio() {
    console.log('create portfolio')
    setIsCreatingPortfolio(true)
    await sleep(4000)
    setIsCreatingPortfolio(false)
  }

  return (
    <BaseTool
      title="Paper Trading"
      description="Access to simulated token buy and sell operations"
      icon={<ChartCandlestick size={16} className="text-purple-400" />}
      isEnabled={true}
      error={undefined}
    >
      <div className="flex flex-1 space justify-center items-center">
        {isLoadingPortfolio
          ? <Spinner />
          : (
            portfolio
              ? <div>Balance {portfolio.portfolio_sol_balance?.toLocaleString()} SOL</div>
              : (
                // TODO distinguish loading error vs portfolio does not exist
                portfolioError
                  ? <div style={{ color: 'red' }}>Error: {portfolioError}</div>
                  : (
                    <LoadingButton
                      title='Create Portfolio'
                      loadingText='Creating portfolio..'
                      isLoading={isCreatingPortfolio}
                      onClick={handleCreatePortfolio}
                    >
                      Create Portfolio
                    </LoadingButton>
                  )
              )
          )
        }
      </div>
    </BaseTool>
  );
};
