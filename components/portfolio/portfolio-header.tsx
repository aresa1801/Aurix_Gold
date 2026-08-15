"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Database, RefreshCw } from "lucide-react"
import type { PortfolioMetrics } from "@/hooks/use-portfolio-data"
import { PORTFOLIO_STYLES, BUTTON_STYLES } from "./portfolio-styles"
import { formatNumber, shortenAddress, formatTime, getChangeColor } from "./portfolio-utils"

interface PortfolioHeaderProps {
  connectedAddress: string | null
  portfolioMetrics: PortfolioMetrics
  isSyncing: boolean
  syncProgress: number
  lastSyncTime: Date | null
  onRefresh: () => void
}

export function PortfolioHeader({
  connectedAddress,
  portfolioMetrics,
  isSyncing,
  syncProgress,
  lastSyncTime,
  onRefresh,
}: PortfolioHeaderProps) {

  return (
    <Card className={PORTFOLIO_STYLES.primaryCard}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              <Badge className="border-prosperity/20 bg-prosperity/10 text-prosperity">
                <Database className="mr-1 h-3.5 w-3.5" />
                Live Contract Sync
              </Badge>
              <h1 className="text-4xl font-bold text-soft-white">Portfolio Dashboard</h1>
              <p className="text-soft-white/50">Connected: {shortenAddress(connectedAddress)}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className={`${PORTFOLIO_STYLES.innerCard} min-w-[180px] p-4`}>
                <p className={`${PORTFOLIO_STYLES.label} text-xs uppercase tracking-[0.2em]`}>Portfolio value</p>
                <p className="mt-2 text-2xl font-bold text-soft-white">${formatNumber(portfolioMetrics.totalValueUSD)}</p>
                <p className="text-sm text-soft-white/50">≈ Rp {formatNumber(portfolioMetrics.totalValueIDR)}</p>
              </div>
              <div className={`${PORTFOLIO_STYLES.innerCard} min-w-[180px] p-4`}>
                <p className={`${PORTFOLIO_STYLES.label} text-xs uppercase tracking-[0.2em]`}>24h change</p>
                <p className={`mt-2 text-2xl font-bold ${getChangeColor(portfolioMetrics.portfolioChange24h)}`}>
                  {portfolioMetrics.portfolioChange24h}
                </p>
                <p className="text-sm text-soft-white/50">Dynamic estimate across wallet assets</p>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4 xl:min-w-[340px] xl:max-w-[360px]">
            <div className={`${PORTFOLIO_STYLES.innerCard} p-4 transition-all hover:bg-navy-900/50`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={`${PORTFOLIO_STYLES.label} text-xs uppercase tracking-[0.2em]`}>Sync status</p>
                  <p className="mt-1 font-semibold text-soft-white">{isSyncing ? "Synchronizing balances" : "Ready"}</p>
                </div>
                {lastSyncTime && (
                  <div className="text-right text-sm text-prosperity">
                    <p className="font-medium">Last sync</p>
                    <p className="text-soft-white/50">{formatTime(lastSyncTime.getTime())}</p>
                  </div>
                )}
              </div>
              {isSyncing && (
                <div className="mt-4 space-y-2">
                  <Progress value={syncProgress} className="h-2 bg-navy-950" />
                  <div className="flex items-center justify-between text-xs text-soft-white/50">
                    <span>Smart contract refresh in progress</span>
                    <span>{syncProgress}%</span>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={onRefresh}
              disabled={isSyncing}
              variant="outline"
              className={BUTTON_STYLES.outline}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              Sync Portfolio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
