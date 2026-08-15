"use client"

import { Activity, CheckCircle, ArrowUpDown, Droplets, TrendingUp, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TransactionHistory } from "@/hooks/use-portfolio-data"
import { PORTFOLIO_STYLES, TRANSACTION_STATUS_STYLES } from "./portfolio-styles"

interface TransactionsTabProps {
  transactions: TransactionHistory[]
}

export function TransactionsTab({ transactions }: TransactionsTabProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "claim":
        return <Droplets className="h-4 w-4" />
      case "swap":
        return <ArrowUpDown className="h-4 w-4" />
      case "stake":
        return <TrendingUp className="h-4 w-4" />
      case "redeem":
        return <Coins className="h-4 w-4" />
      case "transfer":
        return <ArrowUpDown className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className={PORTFOLIO_STYLES.primaryCard}>
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-soft-white">Transaction History</CardTitle>
        <CardDescription className="text-soft-white/50">
          Recent wallet activity with clearer transaction detail hierarchy.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-soft-white/5 bg-navy-900/20 px-6 py-12 text-center">
            <Activity className="mx-auto mb-4 h-12 w-12 text-soft-white/30" />
            <p className="font-semibold text-soft-white">No transactions yet</p>
            <p className="mt-1 text-sm text-soft-white/50">Start using the platform to populate your history.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className={`${PORTFOLIO_STYLES.primaryCard} bg-navy-900/25 transition-all hover:bg-navy-900/40`}>
                <div className="grid gap-4 p-5 lg:grid-cols-[1.6fr_1fr_auto] lg:items-center">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-gold/15 bg-gold/10 p-3 text-gold">{getTransactionIcon(tx.type)}</div>
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold capitalize text-soft-white">{tx.type}</p>
                        <p className="text-sm text-soft-white/50">
                          {tx.amount} {tx.token}
                        </p>
                      </div>
                      {tx.hash && <p className="font-mono text-xs text-soft-white/50">{tx.hash}</p>}
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-soft-white/50 sm:grid-cols-2 lg:grid-cols-1">
                    {tx.fromAddress && (
                      <div>
                        <p className="uppercase tracking-[0.18em]">From</p>
                        <p className="mt-1 text-soft-white">{tx.fromAddress.slice(0, 6)}...{tx.fromAddress.slice(-4)}</p>
                      </div>
                    )}
                    {tx.toAddress && (
                      <div>
                        <p className="uppercase tracking-[0.18em]">To</p>
                        <p className="mt-1 text-soft-white">{tx.toAddress.slice(0, 6)}...{tx.toAddress.slice(-4)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-left lg:text-right">
                    <Badge className={TRANSACTION_STATUS_STYLES[tx.status]}>
                      {tx.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {tx.status}
                    </Badge>
                    <p className="text-xs text-soft-white/50">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
