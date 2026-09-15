"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, TrendingUp, Coins, Database } from "lucide-react"
import type { SynchronizedBalances, PortfolioMetrics } from "@/hooks/use-portfolio-data"
import { PORTFOLIO_STYLES, BUTTON_STYLES } from "./portfolio-styles"
import { formatNumber } from "./portfolio-utils"

interface OverviewTabProps {
  balances: SynchronizedBalances
  portfolioMetrics: PortfolioMetrics
  isSyncing: boolean
  onSync: () => void
  onSwap?: () => void
  onStake?: () => void
  onRedeem?: () => void
}

export function OverviewTab({
  balances,
  portfolioMetrics,
  isSyncing,
  onSync,
  onSwap,
  onStake,
  onRedeem,
}: OverviewTabProps) {
  const assetBreakdown = [
    {
      title: "IDRT",
      subtitle: "Indonesian Rupiah Token",
      amount: formatNumber(balances.idrtBalance),
      allocation: portfolioMetrics.idrtPercentage,
      color: "bg-prosperity",
      accent: "text-prosperity",
      icon: <Coins className="h-4 w-4" />,
    },
    {
      title: "G-TOKEN",
      subtitle: "Tokenized gold exposure",
      amount: formatNumber(balances.goldTokenBalance),
      allocation: portfolioMetrics.goldTokenPercentage,
      color: "bg-gold",
      accent: "text-gold",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "BNB",
      subtitle: "Network gas reserve",
      amount: parseFloat(balances.bnbBalance).toFixed(4),
      allocation: portfolioMetrics.bnbPercentage,
      color: "bg-yellow-500",
      accent: "text-soft-white",
      icon: <Database className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
      <Card className={PORTFOLIO_STYLES.primaryCard}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-soft-white">Asset Breakdown</CardTitle>
          <CardDescription className="text-soft-white/50">
            A clearer view of how each synchronized balance contributes to your total portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          {assetBreakdown.map((asset) => (
            <div key={asset.title} className={`${PORTFOLIO_STYLES.innerCard} p-5 transition-all hover:bg-navy-900/50`}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className={`rounded-2xl border border-soft-white/10 bg-soft-white/5 p-3 ${asset.accent}`}>
                    {asset.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-soft-white">{asset.title}</p>
                    <p className="text-sm text-soft-white/50">{asset.subtitle}</p>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-xl font-bold text-soft-white">{asset.amount}</p>
                  <p className={`text-sm ${asset.accent}`}>{asset.allocation.toFixed(1)}% allocation</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-navy-950">
                <div className={`h-2 rounded-full ${asset.color} transition-all duration-500`} style={{ width: `${asset.allocation}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className={PORTFOLIO_STYLES.primaryCard}>
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-soft-white">Quick Actions</CardTitle>
            <CardDescription className="text-soft-white/50">Common actions for portfolio management and manual synchronization.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 pt-0">
            <Button onClick={onSwap} className={`w-full ${BUTTON_STYLES.primary}`}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Swap Tokens
            </Button>
            <Button onClick={onStake} className={`w-full ${BUTTON_STYLES.secondary}`}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Stake G-TOKEN
            </Button>
            <Button onClick={onRedeem} className={`w-full ${BUTTON_STYLES.tertiary}`}>
              <Coins className="mr-2 h-4 w-4" />
              Redeem Gold
            </Button>
            <Button onClick={onSync} disabled={isSyncing} className={`w-full ${BUTTON_STYLES.sync}`}>
              <Database className="mr-2 h-4 w-4" />
              Force Sync
            </Button>
          </CardContent>
        </Card>

        <Card className={PORTFOLIO_STYLES.primaryCard}>
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-soft-white">Allocation Snapshot</CardTitle>
            <CardDescription className="text-soft-white/50">Portfolio concentration and readiness signals for the current wallet state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-6 pt-0">
            <div className={`${PORTFOLIO_STYLES.innerCard} p-4 hover:bg-navy-900/50 transition-all`}>
              <p className={`${PORTFOLIO_STYLES.label} text-sm`}>Dominant asset</p>
              <p className="mt-1 font-semibold text-soft-white">
                {assetBreakdown.reduce((prev, current) => (current.allocation > prev.allocation ? current : prev)).title}
              </p>
            </div>
            <div className={`${PORTFOLIO_STYLES.innerCard} p-4 hover:bg-navy-900/50 transition-all`}>
              <p className={`${PORTFOLIO_STYLES.label} text-sm`}>Claim readiness</p>
              <p className="mt-1 font-semibold text-soft-white">
                {balances.faucetStatus.canClaim ? "Faucet claim available" : "Waiting for cooldown"}
              </p>
            </div>
            <div className={`${PORTFOLIO_STYLES.innerCard} p-4 hover:bg-navy-900/50 transition-all`}>
              <p className={`${PORTFOLIO_STYLES.label} text-sm`}>Auto refresh cadence</p>
              <p className="mt-1 font-semibold text-soft-white">Every 30 seconds</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
