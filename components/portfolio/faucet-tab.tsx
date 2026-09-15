"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import FaucetStatus from "@/components/faucet-status"
import type { SynchronizedBalances } from "@/hooks/use-portfolio-data"
import { PORTFOLIO_STYLES } from "./portfolio-styles"
import { formatNumber } from "./portfolio-utils"

interface FaucetTabProps {
  userAddress: string | null
  balances: SynchronizedBalances
  onClaimSuccess: () => void
}

export function FaucetTab({ userAddress, balances, onClaimSuccess }: FaucetTabProps) {
  return (
    <div className="space-y-6">
      <FaucetStatus userAddress={userAddress} onClaimSuccess={onClaimSuccess} />

      <Card className={PORTFOLIO_STYLES.primaryCard}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-soft-white">Faucet Statistics</CardTitle>
          <CardDescription className="text-soft-white/50">Real-time faucet contract data.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`${PORTFOLIO_STYLES.innerCard} p-5`}>
              <div className={PORTFOLIO_STYLES.inputRow}>
                <span className={PORTFOLIO_STYLES.label}>Available Balance</span>
                <span className="font-semibold text-prosperity">
                  {formatNumber(balances.faucetStatus.availableBalance)} IDRT
                </span>
              </div>
              <div className={PORTFOLIO_STYLES.inputRow}>
                <span className={PORTFOLIO_STYLES.label}>Claim Amount</span>
                <span className="font-semibold text-gold">{formatNumber(balances.faucetStatus.claimAmount)} IDRT</span>
              </div>
              <div className={PORTFOLIO_STYLES.inputRow}>
                <span className={PORTFOLIO_STYLES.label}>Cooldown Period</span>
                <span className="text-soft-white">{Math.floor(balances.faucetStatus.cooldownPeriod / 3600)}h</span>
              </div>
            </div>
            <div className={`${PORTFOLIO_STYLES.innerCard} p-5`}>
              <div className={PORTFOLIO_STYLES.inputRow}>
                <span className={PORTFOLIO_STYLES.label}>Can Claim</span>
                <Badge
                  className={
                    balances.faucetStatus.canClaim
                      ? "border-prosperity/30 bg-prosperity/15 text-prosperity"
                      : "border-red-500/30 bg-red-500/15 text-red-400"
                  }
                >
                  {balances.faucetStatus.canClaim ? "Yes" : "No"}
                </Badge>
              </div>
              <div className={PORTFOLIO_STYLES.inputRow}>
                <span className={PORTFOLIO_STYLES.label}>Status</span>
                <Badge
                  className={
                    balances.faucetStatus.isPaused
                      ? "border-red-500/30 bg-red-500/15 text-red-400"
                      : "border-prosperity/30 bg-prosperity/15 text-prosperity"
                  }
                >
                  {balances.faucetStatus.isPaused ? "Paused" : "Active"}
                </Badge>
              </div>
              {balances.faucetStatus.nextClaimTime > 0 && (
                <div className={PORTFOLIO_STYLES.inputRow}>
                  <span className={PORTFOLIO_STYLES.label}>Next Claim</span>
                  <span className="flex items-center text-sm text-soft-white">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(balances.faucetStatus.nextClaimTime).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
