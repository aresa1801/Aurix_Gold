"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Wallet,
  TrendingUp,
  Coins,
  ArrowUpDown,
  RefreshCw,
  DollarSign,
  Droplets,
  AlertTriangle,
  CheckCircle,
  PieChart,
  BarChart3,
  Activity,
  Clock,
  Zap,
  Database,
} from "lucide-react"
import { contractService } from "@/services/contracts"
import FaucetStatus from "@/components/faucet-status"
import { toast } from "@/hooks/use-toast"
import { useGoldPrice } from "@/hooks/use-gold-price"

interface SynchronizedBalances {
  idrtBalance: string
  goldTokenBalance: string
  bnbBalance: string
  faucetStatus: {
    canClaim: boolean
    nextClaimTime: number
    lastClaimTime: number
    claimAmount: string
    availableBalance: string
    isPaused: boolean
    cooldownPeriod: number
  }
  lastSyncTime: number
}

interface PortfolioMetrics {
  totalValueUSD: string
  totalValueIDR: string
  portfolioChange24h: string
  idrtPercentage: number
  goldTokenPercentage: number
  bnbPercentage: number
}

interface TransactionHistory {
  id: string
  type: "claim" | "swap" | "stake" | "redeem" | "transfer"
  amount: string
  token: string
  timestamp: number
  status: "completed" | "pending" | "failed"
  hash?: string
  fromAddress?: string
  toAddress?: string
}

const primaryCardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"
const innerCardClass = "rounded-2xl border border-soft-white/5 bg-navy-900/30"
const labelClass = "text-soft-white/50"
const headingClass = "font-bold text-soft-white"
const tabTriggerClass =
  "rounded-xl px-4 py-3 text-soft-white/60 data-[state=active]:bg-gold/15 data-[state=active]:text-gold data-[state=active]:shadow-none"
const inputRowClass = "flex items-center justify-between gap-4 border-b border-soft-white/5 py-3 last:border-b-0 last:pb-0 first:pt-0"

export default function PortfolioPage() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const [balances, setBalances] = useState<SynchronizedBalances>({
    idrtBalance: "0",
    goldTokenBalance: "0",
    bnbBalance: "0",
    faucetStatus: {
      canClaim: false,
      nextClaimTime: 0,
      lastClaimTime: 0,
      claimAmount: "1000000",
      availableBalance: "0",
      isPaused: false,
      cooldownPeriod: 86400,
    },
    lastSyncTime: 0,
  })
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalValueUSD: "0",
    totalValueIDR: "0",
    portfolioChange24h: "+0.00%",
    idrtPercentage: 0,
    goldTokenPercentage: 0,
    bnbPercentage: 0,
  })
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [syncProgress, setSyncProgress] = useState(0)

  const { data: goldPriceData } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000,
  })

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

  const calculatePortfolioMetrics = useCallback(
    (balanceData: SynchronizedBalances): PortfolioMetrics => {
      const currentGoldPriceIDR = goldPriceData?.buyPrice || 1085000

      const idrtValue = parseFloat(balanceData.idrtBalance)
      const goldValue = parseFloat(balanceData.goldTokenBalance) * currentGoldPriceIDR
      const bnbValue = parseFloat(balanceData.bnbBalance) * 15000000

      const totalValueIDR = idrtValue + goldValue + bnbValue
      const totalValueUSD = totalValueIDR / 15000

      const idrtPercentage = totalValueIDR > 0 ? (idrtValue / totalValueIDR) * 100 : 0
      const goldTokenPercentage = totalValueIDR > 0 ? (goldValue / totalValueIDR) * 100 : 0
      const bnbPercentage = totalValueIDR > 0 ? (bnbValue / totalValueIDR) * 100 : 0

      const change24h = (Math.random() - 0.5) * 10

      return {
        totalValueUSD: totalValueUSD.toFixed(2),
        totalValueIDR: totalValueIDR.toFixed(0),
        portfolioChange24h: change24h >= 0 ? `+${change24h.toFixed(2)}%` : `${change24h.toFixed(2)}%`,
        idrtPercentage,
        goldTokenPercentage,
        bnbPercentage,
      }
    },
    [goldPriceData],
  )

  const syncWalletBalances = async (address: string, showProgress = true) => {
    try {
      if (showProgress) {
        setIsSyncing(true)
        setSyncProgress(0)
      }
      setError(null)

      console.log("🔄 Starting wallet balance synchronization...")

      await contractService.initialize()
      if (showProgress) setSyncProgress(20)

      const syncedBalances = await contractService.syncWalletBalances(address)
      if (showProgress) setSyncProgress(80)

      setBalances(syncedBalances)
      setLastSyncTime(new Date())

      const metrics = calculatePortfolioMetrics(syncedBalances)
      setPortfolioMetrics(metrics)

      if (showProgress) setSyncProgress(100)

      console.log("✅ Wallet balance synchronization completed")

      toast({
        title: "Balances Synchronized",
        description: "All wallet balances have been updated from smart contracts",
      })
    } catch (error) {
      console.error("❌ Failed to sync wallet balances:", error)
      setError("Failed to synchronize wallet balances")

      toast({
        title: "Sync Failed",
        description: "Failed to synchronize balances with smart contracts",
        variant: "destructive",
      })
    } finally {
      if (showProgress) {
        setTimeout(() => {
          setIsSyncing(false)
          setSyncProgress(0)
        }, 500)
      }
    }
  }

  const handleBalanceUpdate = useCallback(
    (updatedBalances: SynchronizedBalances) => {
      console.log("📡 Received balance update from contract events")
      setBalances(updatedBalances)
      setLastSyncTime(new Date())

      const metrics = calculatePortfolioMetrics(updatedBalances)
      setPortfolioMetrics(metrics)

      toast({
        title: "Balance Updated",
        description: "Your balance has been updated automatically",
      })
    },
    [calculatePortfolioMetrics],
  )

  const setupEventListeners = useCallback(
    (address: string) => {
      try {
        contractService.setupEventListeners(address, handleBalanceUpdate)
        console.log("🎧 Real-time event listeners activated")
      } catch (error) {
        console.error("Failed to setup event listeners:", error)
      }
    },
    [handleBalanceUpdate],
  )

  const loadTransactionHistory = async (address: string) => {
    try {
      const mockTransactions: TransactionHistory[] = [
        {
          id: "1",
          type: "claim",
          amount: balances.faucetStatus.claimAmount,
          token: "IDRT",
          timestamp: balances.faucetStatus.lastClaimTime || Date.now() - 3600000,
          status: "completed",
          hash: "0x1234...5678",
          toAddress: address,
        },
        {
          id: "2",
          type: "transfer",
          amount: "500000",
          token: "IDRT",
          timestamp: Date.now() - 7200000,
          status: "completed",
          hash: "0x2345...6789",
          fromAddress: address,
        },
        {
          id: "3",
          type: "swap",
          amount: "0.5",
          token: "G-TOKEN",
          timestamp: Date.now() - 86400000,
          status: "completed",
          hash: "0x3456...7890",
        },
      ]

      setTransactionHistory(mockTransactions)
    } catch (error) {
      console.error("Failed to load transaction history:", error)
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
        setError("MetaMask not detected. Please install MetaMask.")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setError("Failed to connect wallet")
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

  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(2)}M`
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(2)}K`
    }
    return n.toLocaleString()
  }

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

  const getStatusBadgeClass = (status: TransactionHistory["status"]) => {
    if (status === "completed") return "border-prosperity/30 bg-prosperity/15 text-prosperity"
    if (status === "pending") return "border-gold/30 bg-gold/15 text-gold"
    return "border-red-500/30 bg-red-500/15 text-red-400"
  }

  const assetBreakdown = [
    {
      title: "IDRT",
      subtitle: "Indonesian Rupiah Token",
      amount: formatNumber(balances.idrtBalance),
      allocation: portfolioMetrics.idrtPercentage,
      color: "bg-prosperity",
      accent: "text-prosperity",
      icon: <Coins className="h-4 w-4" />,
    },
    {
      title: "G-TOKEN",
      subtitle: "Tokenized gold exposure",
      amount: formatNumber(balances.goldTokenBalance),
      allocation: portfolioMetrics.goldTokenPercentage,
      color: "bg-gold",
      accent: "text-gold",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: "BNB",
      subtitle: "Network gas reserve",
      amount: parseFloat(balances.bnbBalance).toFixed(4),
      allocation: portfolioMetrics.bnbPercentage,
      color: "bg-yellow-500",
      accent: "text-soft-white",
      icon: <Wallet className="h-4 w-4" />,
    },
  ]

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
      contractService.cleanup()
    }
  }, [setupEventListeners, syncWalletBalances])

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
          setBalances({
            idrtBalance: "0",
            goldTokenBalance: "0",
            bnbBalance: "0",
            faucetStatus: {
              canClaim: false,
              nextClaimTime: 0,
              lastClaimTime: 0,
              claimAmount: "1000000",
              availableBalance: "0",
              isPaused: false,
              cooldownPeriod: 86400,
            },
            lastSyncTime: 0,
          })
          setPortfolioMetrics({
            totalValueUSD: "0",
            totalValueIDR: "0",
            portfolioChange24h: "+0.00%",
            idrtPercentage: 0,
            goldTokenPercentage: 0,
            bnbPercentage: 0,
          })
        }
      }

      ;(window as any).ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        ;(window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [connectedAddress, setupEventListeners, syncWalletBalances])

  useEffect(() => {
    if (!connectedAddress) return

    const interval = setInterval(() => {
      syncWalletBalances(connectedAddress, false)
    }, 30000)

    return () => clearInterval(interval)
  }, [connectedAddress, syncWalletBalances])

  if (isLoading) {
    return (
      <section className="min-h-screen px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <Card className={primaryCardClass}>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gold" />
              <div className="space-y-1">
                <p className={headingClass}>Loading portfolio</p>
                <p className={labelClass}>Synchronizing wallet balances and contract state.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (!connectedAddress) {
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

            <Card className={`${primaryCardClass} mx-auto max-w-lg`}>
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
                <Button onClick={connectWallet} className="w-full rounded-xl bg-prosperity text-navy-900 hover:bg-prosperity/80">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect MetaMask
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

  return (
    <section className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-7xl space-y-8">
        <Card className={primaryCardClass}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Badge className="border-prosperity/20 bg-prosperity/10 text-prosperity">
                    <Database className="mr-1 h-3.5 w-3.5" />
                    Live Contract Sync
                  </Badge>
                  <h1 className="text-4xl font-bold text-soft-white">Portfolio Dashboard</h1>
                  <p className="text-soft-white/50">
                    Connected: {connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className={`${innerCardClass} min-w-[180px] p-4`}>
                    <p className={`${labelClass} text-xs uppercase tracking-[0.2em]`}>Portfolio value</p>
                    <p className="mt-2 text-2xl font-bold text-soft-white">${formatNumber(portfolioMetrics.totalValueUSD)}</p>
                    <p className="text-sm text-soft-white/50">≈ Rp {formatNumber(portfolioMetrics.totalValueIDR)}</p>
                  </div>
                  <div className={`${innerCardClass} min-w-[180px] p-4`}>
                    <p className={`${labelClass} text-xs uppercase tracking-[0.2em]`}>24h change</p>
                    <p
                      className={`mt-2 text-2xl font-bold ${
                        portfolioMetrics.portfolioChange24h.startsWith("+") ? "text-prosperity" : "text-red-400"
                      }`}
                    >
                      {portfolioMetrics.portfolioChange24h}
                    </p>
                    <p className="text-sm text-soft-white/50">Dynamic estimate across wallet assets</p>
                  </div>
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-4 xl:min-w-[340px] xl:max-w-[360px]">
                <div className={`${innerCardClass} p-4`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className={`${labelClass} text-xs uppercase tracking-[0.2em]`}>Sync status</p>
                      <p className="mt-1 font-semibold text-soft-white">{isSyncing ? "Synchronizing balances" : "Ready"}</p>
                    </div>
                    {lastSyncTime && (
                      <div className="text-right text-sm text-prosperity">
                        <p className="font-medium">Last sync</p>
                        <p className="text-soft-white/50">{lastSyncTime.toLocaleTimeString()}</p>
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
                  onClick={handleManualRefresh}
                  disabled={isSyncing}
                  variant="outline"
                  className="rounded-xl border-gold/20 bg-transparent text-soft-white hover:bg-gold/10"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                  Sync Portfolio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card className={primaryCardClass}>
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
              <div className={`${innerCardClass} p-5`}>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-prosperity animate-pulse" />
                  <div>
                    <p className="font-semibold text-soft-white">IDRT Contract</p>
                    <p className="text-sm text-soft-white/50">Balance: {formatNumber(balances.idrtBalance)} IDRT</p>
                  </div>
                </div>
              </div>
              <div className={`${innerCardClass} p-5`}>
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
              <div className={`${innerCardClass} p-5`}>
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-soft-white/5 bg-navy-800/30 p-2 backdrop-blur-md lg:grid-cols-4">
            <TabsTrigger value="overview" className={tabTriggerClass}>
              <PieChart className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="faucet" className={tabTriggerClass}>
              <Droplets className="mr-2 h-4 w-4" />
              Faucet
            </TabsTrigger>
            <TabsTrigger value="transactions" className={tabTriggerClass}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className={tabTriggerClass}>
              <Activity className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Asset Breakdown</CardTitle>
                  <CardDescription className="text-soft-white/50">
                    A clearer view of how each synchronized balance contributes to your total portfolio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  {assetBreakdown.map((asset) => (
                    <div key={asset.title} className={`${innerCardClass} p-5`}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`rounded-2xl border border-soft-white/10 bg-soft-white/5 p-3 ${asset.accent}`}>
                            {asset.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-soft-white">{asset.title}</p>
                            <p className="text-sm text-soft-white/50">{asset.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-left lg:text-right">
                          <p className="text-xl font-bold text-soft-white">{asset.amount}</p>
                          <p className={`text-sm ${asset.accent}`}>{asset.allocation.toFixed(1)}% allocation</p>
                        </div>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-navy-950">
                        <div className={`h-2 rounded-full ${asset.color} transition-all duration-500`} style={{ width: `${asset.allocation}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className={primaryCardClass}>
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-soft-white">Quick Actions</CardTitle>
                    <CardDescription className="text-soft-white/50">
                      Common actions for portfolio management and manual synchronization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 p-6 pt-0">
                    <Button className="w-full rounded-xl bg-prosperity text-navy-900 hover:bg-prosperity/80">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Swap Tokens
                    </Button>
                    <Button className="w-full rounded-xl bg-gold text-navy-900 hover:bg-gold-600">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Stake G-TOKEN
                    </Button>
                    <Button className="w-full rounded-xl bg-soft-white text-navy-900 hover:bg-soft-white/80">
                      <Coins className="mr-2 h-4 w-4" />
                      Redeem Gold
                    </Button>
                    <Button
                      onClick={handleManualRefresh}
                      disabled={isSyncing}
                      className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Force Sync
                    </Button>
                  </CardContent>
                </Card>

                <Card className={primaryCardClass}>
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-soft-white">Allocation Snapshot</CardTitle>
                    <CardDescription className="text-soft-white/50">
                      Portfolio concentration and readiness signals for the current wallet state.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 p-6 pt-0">
                    <div className={`${innerCardClass} p-4`}>
                      <p className={`${labelClass} text-sm`}>Dominant asset</p>
                      <p className="mt-1 font-semibold text-soft-white">
                        {assetBreakdown.reduce((prev, current) =>
                          current.allocation > prev.allocation ? current : prev,
                        ).title}
                      </p>
                    </div>
                    <div className={`${innerCardClass} p-4`}>
                      <p className={`${labelClass} text-sm`}>Claim readiness</p>
                      <p className="mt-1 font-semibold text-soft-white">
                        {balances.faucetStatus.canClaim ? "Faucet claim available" : "Waiting for cooldown"}
                      </p>
                    </div>
                    <div className={`${innerCardClass} p-4`}>
                      <p className={`${labelClass} text-sm`}>Auto refresh cadence</p>
                      <p className="mt-1 font-semibold text-soft-white">Every 30 seconds</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faucet" className="space-y-6">
            <FaucetStatus userAddress={connectedAddress} onClaimSuccess={handleFaucetClaimSuccess} />

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
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className={primaryCardClass}>
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-soft-white">Transaction History</CardTitle>
                <CardDescription className="text-soft-white/50">
                  Recent wallet activity with clearer transaction detail hierarchy.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {transactionHistory.length === 0 ? (
                  <div className="rounded-2xl border border-soft-white/5 bg-navy-900/20 px-6 py-12 text-center">
                    <Activity className="mx-auto mb-4 h-12 w-12 text-soft-white/30" />
                    <p className="font-semibold text-soft-white">No transactions yet</p>
                    <p className="mt-1 text-sm text-soft-white/50">Start using the platform to populate your history.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactionHistory.map((tx) => (
                      <div key={tx.id} className={`${primaryCardClass} bg-navy-900/25`}>
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
                            <Badge className={getStatusBadgeClass(tx.status)}>
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
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
                    <div className={`${innerCardClass} p-5`}>
                      <p className={`${labelClass} text-sm`}>Total Transactions</p>
                      <p className="mt-2 text-2xl font-bold text-soft-white">{transactionHistory.length}</p>
                    </div>
                    <div className={`${innerCardClass} p-5`}>
                      <p className={`${labelClass} text-sm`}>Faucet Claims</p>
                      <p className="mt-2 text-2xl font-bold text-soft-white">
                        {transactionHistory.filter((tx) => tx.type === "claim").length}
                      </p>
                    </div>
                    <div className={`${innerCardClass} p-5`}>
                      <p className={`${labelClass} text-sm`}>Token Swaps</p>
                      <p className="mt-2 text-2xl font-bold text-soft-white">
                        {transactionHistory.filter((tx) => tx.type === "swap").length}
                      </p>
                    </div>
                    <div className={`${innerCardClass} p-5`}>
                      <p className={`${labelClass} text-sm`}>Success Rate</p>
                      <p className="mt-2 text-2xl font-bold text-prosperity">
                        {transactionHistory.length > 0
                          ? Math.round(
                              (transactionHistory.filter((tx) => tx.status === "completed").length /
                                transactionHistory.length) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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
