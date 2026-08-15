"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  PieChart,
  BarChart3,
  Activity,
  Droplets,
  AlertTriangle,
} from "lucide-react"
import { contractService } from "@/services/contracts"
import { toast } from "@/hooks/use-toast"
import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { PortfolioHeader } from "@/components/portfolio/portfolio-header"
import { PortfolioMetricsCards } from "@/components/portfolio/portfolio-metrics-cards"
import { ContractSyncCard } from "@/components/portfolio/contract-sync-card"
import { OverviewTab } from "@/components/portfolio/overview-tab"
import { FaucetTab } from "@/components/portfolio/faucet-tab"
import { TransactionsTab } from "@/components/portfolio/transactions-tab"
import { AnalyticsTab } from "@/components/portfolio/analytics-tab"
import { NotConnectedState } from "@/components/portfolio/not-connected-state"
import { LoadingState } from "@/components/portfolio/loading-state"
import { PORTFOLIO_STYLES } from "@/components/portfolio/portfolio-styles"

export default function PortfolioPage() {
  const router = useRouter()
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const {
    balances,
    portfolioMetrics,
    transactionHistory,
    isSyncing,
    error,
    lastSyncTime,
    syncProgress,
    syncWalletBalances,
    setupEventListeners,
    loadTransactionHistory,
    resetPortfolioData,
  } = usePortfolioData(connectedAddress)

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        })

        if (accounts.length > 0) {
          return accounts[0]
        }
      }
      return null
    } catch (error) {
      console.error("Failed to check wallet connection:", error)
      return null
    }
  }

  const handleFaucetClaimSuccess = useCallback(async () => {
    console.log("🎉 Faucet claim successful, syncing balances...")
    if (connectedAddress) {
      setTimeout(() => {
        syncWalletBalances(connectedAddress, false)
      }, 2000)
    }
  }, [connectedAddress, syncWalletBalances])

  const connectWallet = async () => {
    try {
      setIsLoading(true)
      setConnectionError(null)

      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          setConnectedAddress(address)

          setupEventListeners(address)

          await syncWalletBalances(address)
          await loadTransactionHistory(address)
        }
      } else {
        const errorMessage = "MetaMask is not installed. Please install MetaMask to connect your wallet."
        setConnectionError(errorMessage)
        toast({
          title: "MetaMask Not Found",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setConnectionError(errorMessage)
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualRefresh = async () => {
    if (connectedAddress) {
      await syncWalletBalances(connectedAddress, true)
      await loadTransactionHistory(connectedAddress)
    }
  }

  // Initialize wallet connection on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      const address = await checkWalletConnection()
      if (address) {
        setConnectedAddress(address)
        setupEventListeners(address)
        await syncWalletBalances(address)
        await loadTransactionHistory(address)
      }
      setIsLoading(false)
    }

    init()

    return () => {
      // Always cleanup, regardless of current connection state
      contractService.cleanup()
    }
  }, [setupEventListeners, syncWalletBalances, loadTransactionHistory])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (connectedAddress) {
          contractService.removeEventListeners(connectedAddress)
        }

        if (accounts.length > 0) {
          const newAddress = accounts[0]
          setConnectedAddress(newAddress)
          setupEventListeners(newAddress)
          await syncWalletBalances(newAddress)
          await loadTransactionHistory(newAddress)
        } else {
          setConnectedAddress(null)
          resetPortfolioData()
        }
      }

      ;(window as any).ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        ;(window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [connectedAddress, setupEventListeners, syncWalletBalances, loadTransactionHistory, resetPortfolioData])

  // Auto-sync every 30 seconds
  useEffect(() => {
    if (!connectedAddress) return

    const interval = setInterval(() => {
      syncWalletBalances(connectedAddress, false)
    }, 30000)

    return () => clearInterval(interval)
  }, [connectedAddress, syncWalletBalances])

  if (isLoading) {
    return <LoadingState />
  }

  if (!connectedAddress) {
    return <NotConnectedState error={connectionError} onConnect={connectWallet} isLoading={isLoading} />
  }

  return (
    <section className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Portfolio Header */}
        <PortfolioHeader
          connectedAddress={connectedAddress}
          portfolioMetrics={portfolioMetrics}
          isSyncing={isSyncing}
          syncProgress={syncProgress}
          lastSyncTime={lastSyncTime}
          onRefresh={handleManualRefresh}
        />

        {/* Metrics Cards */}
        <PortfolioMetricsCards balances={balances} portfolioMetrics={portfolioMetrics} />

        {/* Contract Sync Status */}
        <ContractSyncCard balances={balances} />

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-soft-white/5 bg-navy-800/30 p-2 backdrop-blur-md lg:grid-cols-4">
            <TabsTrigger value="overview" className={PORTFOLIO_STYLES.tabTrigger}>
              <PieChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="faucet" className={PORTFOLIO_STYLES.tabTrigger}>
              <Droplets className="mr-2 h-4 w-4" />
              Faucet
            </TabsTrigger>
            <TabsTrigger value="transactions" className={PORTFOLIO_STYLES.tabTrigger}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className={PORTFOLIO_STYLES.tabTrigger}>
              <Activity className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab
              balances={balances}
              portfolioMetrics={portfolioMetrics}
              isSyncing={isSyncing}
              onSync={handleManualRefresh}
              onSwap={() => router.push("/swap")}
              onStake={() => router.push("/staking")}
              onRedeem={() => router.push("/redemption")}
            />
          </TabsContent>

          {/* Faucet Tab */}
          <TabsContent value="faucet" className="space-y-6">
            <FaucetTab
              userAddress={connectedAddress}
              balances={balances}
              onClaimSuccess={handleFaucetClaimSuccess}
            />
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <TransactionsTab transactions={transactionHistory} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab lastSyncTime={lastSyncTime} transactions={transactionHistory} />
          </TabsContent>
        </Tabs>

        {/* Error Alert */}
        {error && (
          <Alert className="rounded-2xl border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  )
}
