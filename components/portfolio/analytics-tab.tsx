"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import type { TransactionHistory } from "@/hooks/use-portfolio-data"

interface AnalyticsTabProps {
  lastSyncTime: Date | null
  transactions: TransactionHistory[]
}

const primaryCardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"
const innerCardClass = "rounded-2xl border border-soft-white/5 bg-navy-900/30"
const labelClass = "text-soft-white/50"
const inputRowClass = "flex items-center justify-between gap-4 border-b border-soft-white/5 py-3 last:border-b-0 last:pb-0 first:pt-0"

export function AnalyticsTab({ lastSyncTime, transactions }: AnalyticsTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className={primaryCardClass}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-soft-white">Synchronization Metrics</CardTitle>
          <CardDescription className="text-soft-white/50">
            Operational visibility for real-time contract synchronization.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className={`${innerCardClass} p-5`}>
            <div className={inputRowClass}>
              <span className={labelClass}>Last Sync</span>
              <span className="font-semibold text-soft-white">
                {lastSyncTime ? lastSyncTime.toLocaleTimeString() : "Never"}
              </span>
            </div>
            <div className={inputRowClass}>
              <span className={labelClass}>Sync Frequency</span>
              <span className="font-semibold text-prosperity">30 seconds</span>
            </div>
            <div className={inputRowClass}>
              <span className={labelClass}>Event Listeners</span>
              <span className="font-semibold text-prosperity">Active</span>
            </div>
            <div className={inputRowClass}>
              <span className={labelClass}>Real-time Updates</span>
              <Badge className="border-prosperity/30 bg-prosperity/15 text-prosperity">
                <Zap className="mr-1 h-3 w-3" />
                Enabled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={primaryCardClass}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-soft-white">Platform Usage</CardTitle>
          <CardDescription className="text-soft-white/50">
            A cleaner summary of recent activity across key portfolio flows.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`${innerCardClass} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${labelClass} text-sm`}>Total Transactions</p>
              <p className="mt-2 text-2xl font-bold text-soft-white">{transactions.length}</p>
            </div>
            <div className={`${innerCardClass} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${labelClass} text-sm`}>Faucet Claims</p>
              <p className="mt-2 text-2xl font-bold text-soft-white">
                {transactions.filter((tx) => tx.type === "claim").length}
              </p>
            </div>
            <div className={`${innerCardClass} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${labelClass} text-sm`}>Token Swaps</p>
              <p className="mt-2 text-2xl font-bold text-soft-white">
                {transactions.filter((tx) => tx.type === "swap").length}
              </p>
            </div>
            <div className={`${innerCardClass} p-5 hover:bg-navy-900/50 transition-all`}>
              <p className={`${labelClass} text-sm`}>Success Rate</p>
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
