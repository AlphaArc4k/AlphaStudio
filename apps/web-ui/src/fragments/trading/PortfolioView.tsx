import { useEffect, useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { Table } from '../../components/Table'
import { format } from 'date-fns';
import { TrendingDown, TrendingUp } from 'lucide-react'
import { shortSolanaAddress } from '../../lib/utils';
import { CopyClipboard } from '../../components/CopyClipboard';
import { useAgentId } from '../../hooks/useAgentId';
import { usePaperPortfolio } from '../../hooks/usePaperPortfolio';

export function PortfolioView() {
  const { post } = useApi()

  const [trades, setTrades] = useState(undefined)
  const agentId = useAgentId()
  // TODO handle error
  const { portfolio, error: _portfolioError } = usePaperPortfolio(agentId)

  useEffect(() => {
    if (!agentId) return

    post('/rpc/trading/paper', {
      id: '1',
      method: 'getTrades',
      params: {
        agent_uuid: agentId
      }
    })
      .then(p => {
        if (p.data.result) {
          setTrades(p.data.result)
        } else {
          console.log(p)
        }
      })
      .catch(e => console.log(e))

    return () => {

    }
  }, [agentId])


  return (
    <div className="text-gray-200 p-8">

      <h1 className="text-3xl font-bold mb-2">Portfolio: Test 1</h1>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Balance Card */}
        <div className="p-3 rounded-l bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-800">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Balance</h3>
          <div className="text-2xl font-bold">{portfolio?.portfolio_sol_balance?.toLocaleString()} SOL</div>
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-green-400">+0.13 SOL</span>
            <span className="text-sm text-slate-400">Today</span>
          </div>
        </div>
      </div>

      <div
        className='mb-2 mt-2'
      >
        <Table
          title='Positions'
          data={portfolio?.positions}
          columns={[
            {
              key: '_asset',
              header: 'Asset',
              formatter(_value, position) {
                return (<div className="flex items-center space-x-3">
                  <img
                    src={position.token.image}
                    alt={position.token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">${position.token.symbol}</div>
                    <div className="text-sm text-slate-400">{position.token.name}</div>
                  </div>
                </div>)
              },
            },
            {
              key: 'amount',
              header: 'Amount',
              formatter: (value) => value.toLocaleString()
            },
            {
              key: 'value',
              header: 'Value',
              formatter: (value) => '$' + value.toLocaleString()
            },
            {
              key: 'averagePrice',
              header: 'Avg Price',
              formatter: value => '$' + value.toLocaleString(undefined, { minimumFractionDigits: 4 })
            },
            {
              key: 'currentPrice',
              header: 'Current Price',
              formatter: value => '$' + value.toLocaleString(undefined, { minimumFractionDigits: 4 })
            },
            {
              key: '_pl',
              header: 'P&L',
              formatter(_value, position) {
                return (
                  <div
                    className='flex flex-col items-end'
                  >
                    <div className={`flex items-center justify-center space-x-1 ${position.pnl.percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {position.pnl.percentage >= 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span className="font-medium">{position.pnl.percentage}%</span>
                    </div>
                    <div className="text-sm text-slate-400">
                      ${position.pnl.value.toLocaleString()}
                    </div>
                  </div>
                )
              },
            },
            {
              key: 'allocation',
              header: 'Allocation',
              formatter: value => `${value}%`
            },
            {
              key: '_actions',
              header: 'Actions',
              formatter(_value, _row) {
                return (
                  <div className="flex items-center justify-end space-x-2">
                  <button className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                    Buy
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    Sell
                  </button>
                </div>
                )
              },
            }
          ]}
        />
      </div>

      <Table
        title='Trade History'
        data={trades}
        columns={[
          {
            key: 'created_at',
            header: 'Time',
            formatter: (value) => format(new Date(value), 'yyyy/MM/dd HH:mm'),
          },
          {
            key: 'action',
            header: 'Type',
            formatter: (value) => value === 1 
              ? <div className="text-green-400">Buy</div>
              : <div className="text-red-400">Sell</div>
          },
          {
            key: 'token_address',
            header: 'Token',
            formatter: value => <CopyClipboard content={value} display={shortSolanaAddress(value)} />
          },
          {
            key: 'price',
            header: 'Price',
            formatter: (value) => value.toLocaleString(undefined, { minimumFractionDigits: 4 }),
          },
          {
            key: 'amount_in',
            header: 'Amount In',
            formatter: (value) => value.toLocaleString(),
          },
          {
            key: 'amount_out',
            header: 'Amount Out',
            formatter: (value) => value.toLocaleString(),
          },
        ]}
      />
    </div >
  )
}