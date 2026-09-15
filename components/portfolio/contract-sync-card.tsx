"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import type { SynchronizedBalances } from "@/hooks/use-portfolio-data"
import { PORTFOLIO_STYLES } from "./portfolio-styles"
import { formatNumber } from "./portfolio-utils"

interface ContractSyncCardProps {
  balances: SynchronizedBalances
}

export function ContractSyncCard({ balances }: ContractSyncCardProps) {
  return (
    <Card className={PORTFOLIO_STYLES.primaryCard}>
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-soft-white">
              <Zap className="h-5 w-5 text-prosperity" />
              Smart Contract Synchronization
            </CardTitle>
            <CardDescription className="text-soft-white/50">
              Real-time balance synchronization across IDRT, faucet, and event listeners.
            </CardDescription>
          </div>
          <Badge className="border-prosperity/20 bg-prosperity/10 text-prosperity">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          <div className={`${PORTFOLIO_STYLES.innerCard} p-5`}>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-prosperity animate-pulse" />
              <div>
                <p className="font-semibold text-soft-white">IDRT Contract</p>
                <p className="text-sm text-soft-white/50">Balance: {formatNumber(balances.idrtBalance)} IDRT</p>
              </div>
            </div>
          </div>
          <div className={`${PORTFOLIO_STYLES.innerCard} p-5`}>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-gold animate-pulse" />
              <div>
                <p className="font-semibold text-soft-white">Faucet Contract</p>
                <p className="text-sm text-soft-white/50">
                  Status: <span className="text-soft-white">{balances.faucetStatus.canClaim ? "Ready" : "Cooldown"}</span>
                </p>
              </div>
            </div>
          </div>
          <div className={`${PORTFOLIO_STYLES.innerCard} p-5`}>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
              <div>
                <p className="font-semibold text-soft-white">Event Listeners</p>
                <p className="text-sm text-soft-white/50">Active and monitoring wallet updates</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
