"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import type { TransactionHistory } from "@/hooks/use-portfolio-data"
import { PORTFOLIO_STYLES } from "./portfolio-styles"

interface AnalyticsTabProps {
  lastSyncTime: Date | null
  transactions: TransactionHistory[]
}

export function AnalyticsTab({ lastSyncTime, transactions }: AnalyticsTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className={PORTFOLIO_STYLES.primaryCard}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-soft-white">Synchronization Metrics</CardTitle>
          <CardDescription className="text-soft-white/50">
            Operational visibility for real-time contract synchronization.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className={`${PORTFOLIO_STYLES.innerCard} p-5`}>
            <div className={PORTFOLIO_STYLES.inputRow}>
              <span className={PORTFOLIO_STYLES.label}>Last Sync</span>
              <span className="font-semibold text-soft-white">
                {lastSyncTime ? lastSyncTime.toLocaleTimeString() : "Never"}
              </span>
            </div>
            <div className={PORTFOLIO_STYLES.inputRow}>
              <span className={PORTFOLIO_STYLES.label}>Sync Frequency</span>
              <span className="font-semibold text-prosperity">30 seconds</span>
            </div>
            <div className={PORTFOLIO_STYLES.inputRow}>
              <span className={PORTFOLIO_STYLES.label}>Event Listeners</span>
              <span className="font-semibold text-prosperity">Active</span>
            </div>
            <div className={PORTFOLIO_STYLES.inputRow}>
              <span className={PORTFOLIO_STYLES.label}>Real-time Updates</span>
              <Badge className="border-prosperity/30 bg-prosperity/15 text-prosperity">
                <Zap className="mr-1 h-3 w-3" />
                Enabled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={PORTFOLIO_STYLES.primaryCard}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-soft-white">Platform Usage</CardTitle>
          <CardDescription className="text-soft-white/50">
            A cleaner summary of recent activity across key portfolio flows.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${PORTFOLIO_STYLES.innerCard} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${PORTFOLIO_STYLES.label} text-sm`}>Total Transactions</p>
              <p className="mt-2 text-2xl font-bold text-soft-white">{transactions.length}</p>
            </div>
            <div className={`${PORTFOLIO_STYLES.innerCard} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${PORTFOLIO_STYLES.label} text-sm`}>Faucet Claims</p>
              <p className="mt-2 text-2xl font-bold text-soft-white">
                {transactions.filter((tx) => tx.type === "claim").length}
              </p>
            </div>
            <div className={`${PORTFOLIO_STYLES.innerCard} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${PORTFOLIO_STYLES.label} text-sm`}>Token Swaps</p>
              <p className="mt-2 text-2xl font-bold text-soft-white">
                {transactions.filter((tx) => tx.type === "swap").length}
              </p>
            </div>
            <div className={`${PORTFOLIO_STYLES.innerCard} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${PORTFOLIO_STYLES.label} text-sm`}>Success Rate</p>
              <p className="mt-2 text-2xl font-bold text-prosperity">
                {transactions.length > 0
                  ? Math.round(
                      (transactions.filter((tx) => tx.status === "completed").length / transactions.length) * 100,
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
