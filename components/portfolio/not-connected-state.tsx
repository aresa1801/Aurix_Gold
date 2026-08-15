"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, AlertTriangle } from "lucide-react"
import { PORTFOLIO_STYLES } from "./portfolio-styles"

interface NotConnectedStateProps {
  error: string | null
  onConnect: () => void
  isLoading: boolean
}

export function NotConnectedState({ error, onConnect, isLoading }: NotConnectedStateProps) {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-8 text-center">
          <div className="space-y-3">
            <Badge className="border-gold/20 bg-gold/10 px-4 py-1.5 text-gold">Portfolio</Badge>
            <h1 className="text-4xl font-bold text-soft-white sm:text-5xl">Portfolio Dashboard</h1>
            <p className="mx-auto max-w-2xl text-soft-white/50">
              Connect your wallet to view synchronized balances, faucet activity, and contract-backed portfolio insights.
            </p>
          </div>

          <Card className={`${PORTFOLIO_STYLES.primaryCard} mx-auto max-w-lg`}>
            <CardHeader className="p-6 pb-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                <Wallet className="h-6 w-6" />
              </div>
              <CardTitle className="text-center text-2xl font-bold text-soft-white">Connect Wallet</CardTitle>
              <CardDescription className="text-center text-soft-white/50">
                Connect MetaMask to access your synchronized DeFi portfolio with real-time smart contract updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              <Button
                onClick={onConnect}
                disabled={isLoading}
                className="w-full rounded-xl bg-prosperity text-navy-900 hover:bg-prosperity/80 transition-all active:scale-95 disabled:opacity-50"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isLoading ? "Connecting..." : "Connect MetaMask"}
              </Button>

              {error && (
                <Alert className="rounded-2xl border-red-500/20 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
