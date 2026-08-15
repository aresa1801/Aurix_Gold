"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, TrendingUp, Coins, Wallet } from "lucide-react"
import type { SynchronizedBalances, PortfolioMetrics } from "@/hooks/use-portfolio-data"

interface PortfolioMetricsCardsProps {
  balances: SynchronizedBalances
  portfolioMetrics: PortfolioMetrics
}

const primaryCardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"
const labelClass = "text-soft-white/50"

export function PortfolioMetricsCards({ balances, portfolioMetrics }: PortfolioMetricsCardsProps) {
  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(2)}M`
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(2)}K`
    }
    return n.toLocaleString()
  }

  const assetBreakdown = [
    {
      title: "IDRT",
      subtitle: "Indonesian Rupiah Token",
      amount: formatNumber(balances.idrtBalance),
      allocation: portfolioMetrics.idrtPercentage,
      color: "bg-prosperity",
      accent: "text-prosperity",
      icon: <Coins className="h-5 w-5" />,
    },
    {
      title: "G-TOKEN",
      subtitle: "Tokenized gold exposure",
      amount: formatNumber(balances.goldTokenBalance),
      allocation: portfolioMetrics.goldTokenPercentage,
      color: "bg-gold",
      accent: "text-gold",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      title: "BNB",
      subtitle: "Network gas reserve",
      amount: parseFloat(balances.bnbBalance).toFixed(4),
      allocation: portfolioMetrics.bnbPercentage,
      color: "bg-yellow-500",
      accent: "text-soft-white",
      icon: <Wallet className="h-5 w-5" />,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Card className={primaryCardClass}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`${labelClass} text-sm`}>Total Value</p>
              <p className="mt-3 text-3xl font-bold text-soft-white">${formatNumber(portfolioMetrics.totalValueUSD)}</p>
              <p className="mt-1 text-sm text-soft-white/50">≈ Rp {formatNumber(portfolioMetrics.totalValueIDR)}</p>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 text-gold">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
              portfolioMetrics.portfolioChange24h.startsWith("+")
                ? "bg-prosperity/15 text-prosperity"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            {portfolioMetrics.portfolioChange24h} (24h)
          </div>
        </CardContent>
      </Card>

      {assetBreakdown.map((asset) => (
        <Card key={asset.title} className={primaryCardClass}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`${labelClass} text-sm`}>{asset.title}</p>
                <p className="mt-3 text-3xl font-bold text-soft-white">{asset.amount}</p>
                <p className="mt-1 text-sm text-soft-white/50">{asset.subtitle}</p>
              </div>
              <div className={`rounded-2xl border border-soft-white/10 bg-soft-white/5 p-3 ${asset.accent}`}>
                {asset.icon}
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={labelClass}>Allocation</span>
                <span className={asset.accent}>{asset.allocation.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-navy-950">
                <div className={`h-2 rounded-full ${asset.color} transition-all duration-500`} style={{ width: `${asset.allocation}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
