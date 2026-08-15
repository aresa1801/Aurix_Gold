"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import FaucetStatus from "@/components/faucet-status"
import type { SynchronizedBalances } from "@/hooks/use-portfolio-data"

interface FaucetTabProps {
  userAddress: string | null
  balances: SynchronizedBalances
  onClaimSuccess: () => void
}

const primaryCardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"
const innerCardClass = "rounded-2xl border border-soft-white/5 bg-navy-900/30"
const labelClass = "text-soft-white/50"
const inputRowClass = "flex items-center justify-between gap-4 border-b border-soft-white/5 py-3 last:border-b-0 last:pb-0 first:pt-0"

export function FaucetTab({ userAddress, balances, onClaimSuccess }: FaucetTabProps) {
  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(2)}M`
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(2)}K`
    }
    return n.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <FaucetStatus userAddress={userAddress} onClaimSuccess={onClaimSuccess} />

      <Card className={primaryCardClass}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-soft-white">Faucet Statistics</CardTitle>
          <CardDescription className="text-soft-white/50">Real-time faucet contract data.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`${innerCardClass} p-5`}>
              <div className={inputRowClass}>
                <span className={labelClass}>Available Balance</span>
                <span className="font-semibold text-prosperity">
                  {formatNumber(balances.faucetStatus.availableBalance)} IDRT
                </span>
              </div>
              <div className={inputRowClass}>
                <span className={labelClass}>Claim Amount</span>
                <span className="font-semibold text-gold">{formatNumber(balances.faucetStatus.claimAmount)} IDRT</span>
              </div>
              <div className={inputRowClass}>
                <span className={labelClass}>Cooldown Period</span>
                <span className="text-soft-white">{Math.floor(balances.faucetStatus.cooldownPeriod / 3600)}h</span>
              </div>
            </div>
            <div className={`${innerCardClass} p-5`}>
              <div className={inputRowClass}>
                <span className={labelClass}>Can Claim</span>
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
              <div className={inputRowClass}>
                <span className={labelClass}>Status</span>
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
                <div className={inputRowClass}>
                  <span className={labelClass}>Next Claim</span>
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
