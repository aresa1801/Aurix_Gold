"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Wallet, TrendingUp, Coins, ArrowUpDown, RefreshCw, DollarSign, Droplets, AlertTriangle, CheckCircle, PieChart, BarChart3, Activity, Clock, Zap, Database } from 'lucide-react'
import { contractService } from "@/services/contracts"
import { useLanguage } from "@/contexts/language-context"
import FaucetStatus from "@/components/faucet-status"
import { toast } from "@/hooks/use-toast"
import { useGoldPrice } from "@/hooks/use-gold-price" // Import useGoldPrice

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

export default function PortfolioPage() {
  const { t } = useLanguage()
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
      cooldownPeriod: 86400
    },
    lastSyncTime: 0
  })
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalValueUSD: "0",
    totalValueIDR: "0",
    portfolioChange24h: "+0.00%",
    idrtPercentage: 0,
    goldTokenPercentage: 0,
    bnbPercentage: 0
  })
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [syncProgress, setSyncProgress] = useState(0)

  // Use the gold price hook for real-time data
  const { data: goldPriceData } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
  })

  // Check wallet connection
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

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = useCallback((balanceData: SynchronizedBalances): PortfolioMetrics => {
    const currentGoldPriceIDR = goldPriceData?.buyPrice || 1085000; // Use real gold price or fallback

    const idrtValue = parseFloat(balanceData.idrtBalance)
    const goldValue = parseFloat(balanceData.goldTokenBalance) * currentGoldPriceIDR // Use dynamic gold price
    const bnbValue = parseFloat(balanceData.bnbBalance) * 15000000 // 1 BNB ≈ 15M IDRT

    const totalValueIDR = idrtValue + goldValue + bnbValue
    const totalValueUSD = totalValueIDR / 15000 // Rough USD conversion

    // Calculate percentages
    const idrtPercentage = totalValueIDR > 0 ? (idrtValue / totalValueIDR) * 100 : 0
    const goldTokenPercentage = totalValueIDR > 0 ? (goldValue / totalValueIDR) * 100 : 0
    const bnbPercentage = totalValueIDR > 0 ? (bnbValue / totalValueIDR) * 100 : 0

    // Simulate 24h change (in real app, this would come from historical data)
    const change24h = (Math.random() - 0.5) * 10 // Random change between -5% to +5%

    return {
      totalValueUSD: totalValueUSD.toFixed(2),
      totalValueIDR: totalValueIDR.toFixed(0),
      portfolioChange24h: change24h >= 0 ? `+${change24h.toFixed(2)}%` : `${change24h.toFixed(2)}%`,
      idrtPercentage,
      goldTokenPercentage,
      bnbPercentage
    }
  }, [goldPriceData]) // Add goldPriceData to dependencies

  // Synchronized balance loading with progress tracking
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

      // Sync all balances using the enhanced contract service
      const syncedBalances = await contractService.syncWalletBalances(address)
      if (showProgress) setSyncProgress(80)

      // Update state with synchronized data
      setBalances(syncedBalances)
      setLastSyncTime(new Date())
      
      // Calculate portfolio metrics
      const metrics = calculatePortfolioMetrics(syncedBalances)
      setPortfolioMetrics(metrics)
      
      if (showProgress) setSyncProgress(100)

      console.log("✅ Wallet balance synchronization completed")
      
      toast({
        title: "Balances Synchronized",
        description: "All wallet balances have been updated from smart contracts",
        position: "bottom-right" as const,
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

  // Handle balance updates from contract events
  const handleBalanceUpdate = useCallback((updatedBalances: SynchronizedBalances) => {
    console.log("📡 Received balance update from contract events")
    setBalances(updatedBalances)
    setLastSyncTime(new Date())
    
    const metrics = calculatePortfolioMetrics(updatedBalances)
    setPortfolioMetrics(metrics)

    toast({
      title: "Balance Updated",
      description: "Your balance has been updated automatically",
      position: "bottom-right" as const,
    })
  }, [calculatePortfolioMetrics])

  // Setup real-time event listeners
  const setupEventListeners = useCallback((address: string) => {
    try {
      contractService.setupEventListeners(address, handleBalanceUpdate)
      console.log("🎧 Real-time event listeners activated")
    } catch (error) {
      console.error("Failed to setup event listeners:", error)
    }
  }, [handleBalanceUpdate])

  // Load transaction history (enhanced with real contract events)
  const loadTransactionHistory = async (address: string) => {
    try {
      // In a real implementation, this would fetch from blockchain events
      // For now, we'll use mock data but structure it for real integration
      const mockTransactions: TransactionHistory[] = [
        {
          id: "1",
          type: "claim",
          amount: balances.faucetStatus.claimAmount,
          token: "IDRT",
          timestamp: balances.faucetStatus.lastClaimTime || Date.now() - 3600000,
          status: "completed",
          hash: "0x1234...5678",
          toAddress: address
        },
        {
          id: "2",
          type: "transfer",
          amount: "500000",
          token: "IDRT",
          timestamp: Date.now() - 7200000,
          status: "completed",
          hash: "0x2345...6789",
          fromAddress: address
        },
        {
          id: "3",
          type: "swap",
          amount: "0.5",
          token: "G-TOKEN",
          timestamp: Date.now() - 86400000,
          status: "completed",
          hash: "0x3456...7890"
        }
      ]

      setTransactionHistory(mockTransactions)
    } catch (error) {
      console.error("Failed to load transaction history:", error)
    }
  }

  // Handle faucet claim success with immediate sync
  const handleFaucetClaimSuccess = useCallback(async () => {
    console.log("🎉 Faucet claim successful, syncing balances...")
    if (connectedAddress) {
      // Wait a moment for blockchain confirmation
      setTimeout(() => {
        syncWalletBalances(connectedAddress, false)
      }, 2000)
    }
  }, [connectedAddress, syncWalletBalances]) // Add syncWalletBalances to dependencies

  // Connect wallet
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
          
          // Setup event listeners first
          setupEventListeners(address)
          
          // Then sync balances
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

  // Manual refresh with full synchronization
  const handleManualRefresh = async () => {
    if (connectedAddress) {
      await syncWalletBalances(connectedAddress, true)
      await loadTransactionHistory(connectedAddress)
    }
  }

  // Format numbers for display
  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(2)}M`
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(2)}K`
    }
    return n.toLocaleString()
  }

  // Format transaction type
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

  // Initialize on component mount
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

    // Cleanup event listeners on unmount
    return () => {
      contractService.cleanup()
    }
  }, [setupEventListeners, syncWalletBalances]) // Add syncWalletBalances to dependencies

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        // Cleanup previous listeners
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
              cooldownPeriod: 86400
            },
            lastSyncTime: 0
          })
          setPortfolioMetrics({
            totalValueUSD: "0",
            totalValueIDR: "0",
            portfolioChange24h: "+0.00%",
            idrtPercentage: 0,
            goldTokenPercentage: 0,
            bnbPercentage: 0
          })
        }
      }

      ;(window as any).ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        ;(window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [connectedAddress, setupEventListeners, syncWalletBalances]) // Add syncWalletBalances to dependencies

  // Auto-sync every 30 seconds
  useEffect(() => {
    if (!connectedAddress) return

    const interval = setInterval(() => {
      syncWalletBalances(connectedAddress, false)
    }, 30000)

    return () => clearInterval(interval)
  }, [connectedAddress, syncWalletBalances]) // Add syncWalletBalances to dependencies

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="text-soft-white">Loading portfolio...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!connectedAddress) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-soft-white">Portfolio Dashboard</h1>
              <p className="text-soft-white/70">Connect your wallet to view synchronized balances</p>
            </div>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-gold flex items-center justify-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </CardTitle>
                <CardDescription className="text-soft-white/70 text-center">
                  Connect your wallet to access synchronized DeFi portfolio with real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={connectWallet}
                  className="w-full bg-prosperity hover:bg-prosperity/80 text-navy-900"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect MetaMask
                </Button>
                
                {error && (
                  <Alert className="mt-4 border-red-500/20 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header with Sync Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-soft-white mb-2">Portfolio Dashboard</h1>
              <div className="flex items-center space-x-4">
                <p className="text-soft-white/70">
                  Connected: {connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}
                </p>
                {lastSyncTime && (
                  <div className="flex items-center text-sm text-prosperity">
                    <Database className="h-4 w-4 mr-1" />
                    Last sync: {lastSyncTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isSyncing && (
                <div className="flex items-center space-x-2">
                  <div className="w-32">
                    <Progress value={syncProgress} className="h-2" />
                  </div>
                  <span className="text-sm text-soft-white/70">Syncing...</span>
                </div>
              )}
              <Button
                onClick={handleManualRefresh}
                disabled={isSyncing}
                variant="outline"
                className="border-gold/20 text-soft-white hover:bg-gold/10 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Balance Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center text-lg">
                <DollarSign className="h-5 w-5 mr-2" />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-soft-white">
                ${formatNumber(portfolioMetrics.totalValueUSD)}
              </div>
              <div className="text-sm text-soft-white/70">
                ≈ Rp {formatNumber(portfolioMetrics.totalValueIDR)}
              </div>
              <div className={`text-sm mt-1 flex items-center ${
                portfolioMetrics.portfolioChange24h.startsWith('+') 
                  ? 'text-prosperity' 
                  : 'text-red-400'
              }`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {portfolioMetrics.portfolioChange24h} (24h)
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center text-lg">
                <Coins className="h-5 w-5 mr-2" />
                IDRT Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-soft-white">
                {formatNumber(balances.idrtBalance)}
              </div>
              <div className="text-sm text-soft-white/70">Indonesian Rupiah Token</div>
              <div className="flex items-center mt-2">
                <div className="w-full bg-navy-900/50 rounded-full h-2 mr-2">
                  <div 
                    className="bg-prosperity h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${portfolioMetrics.idrtPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-soft-white/70">{portfolioMetrics.idrtPercentage.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2" />
                Gold Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-soft-white">
                {formatNumber(balances.goldTokenBalance)}
              </div>
              <div className="text-sm text-soft-white/70">G-TOKEN</div>
              <div className="flex items-center mt-2">
                <div className="w-full bg-navy-900/50 rounded-full h-2 mr-2">
                  <div 
                    className="bg-gold h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${portfolioMetrics.goldTokenPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-soft-white/70">{portfolioMetrics.goldTokenPercentage.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-gold flex items-center text-lg">
                <Wallet className="h-5 w-5 mr-2" />
                BNB Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-soft-white">
                {parseFloat(balances.bnbBalance).toFixed(4)}
              </div>
              <div className="text-sm text-soft-white/70">Binance Coin</div>
              <div className="flex items-center mt-2">
                <div className="w-full bg-navy-900/50 rounded-full h-2 mr-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${portfolioMetrics.bnbPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-soft-white/70">{portfolioMetrics.bnbPercentage.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Synchronization Status */}
        <Card className="bg-navy-800/50 border-prosperity/20 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-prosperity flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Smart Contract Synchronization
            </CardTitle>
            <CardDescription className="text-soft-white/70">
              Real-time balance synchronization with IDRT and Faucet contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-prosperity animate-pulse"></div>
                <div>
                  <div className="text-sm font-medium text-soft-white">IDRT Contract</div>
                  <div className="text-xs text-soft-white/70">Balance: {formatNumber(balances.idrtBalance)} IDRT</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-gold animate-pulse"></div>
                <div>
                  <div className="text-sm font-medium text-soft-white">Faucet Contract</div>
                  <div className="text-xs text-soft-white/70">
                    Status: {balances.faucetStatus.canClaim ? "Ready" : "Cooldown"}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                <div>
                  <div className="text-sm font-medium text-soft-white">Event Listeners</div>
                  <div className="text-xs text-soft-white/70">Active & Monitoring</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-navy-800/50 border-gold/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <PieChart className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="faucet" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Droplets className="h-4 w-4 mr-2" />
              Faucet
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <BarChart3 className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Activity className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Portfolio Allocation</CardTitle>
                  <CardDescription className="text-soft-white/70">
                    Real-time distribution of your synchronized assets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-prosperity"></div>
                        <span className="text-soft-white/70">IDRT</span>
                      </div>
                      <div className="text-right">
                        <div className="text-soft-white font-semibold">
                          {formatNumber(balances.idrtBalance)}
                        </div>
                        <div className="text-xs text-soft-white/50">
                          {portfolioMetrics.idrtPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gold"></div>
                        <span className="text-soft-white/70">G-TOKEN</span>
                      </div>
                      <div className="text-right">
                        <div className="text-soft-white font-semibold">
                          {formatNumber(balances.goldTokenBalance)}
                        </div>
                        <div className="text-xs text-soft-white/50">
                          {portfolioMetrics.goldTokenPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-soft-white/70">BNB</span>
                      </div>
                      <div className="text-right">
                        <div className="text-soft-white font-semibold">
                          {parseFloat(balances.bnbBalance).toFixed(4)}
                        </div>
                        <div className="text-xs text-soft-white/50">
                          {portfolioMetrics.bnbPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Quick Actions</CardTitle>
                  <CardDescription className="text-soft-white/70">
                    Common portfolio actions with real-time updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-prosperity hover:bg-prosperity/80 text-navy-900">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Swap Tokens
                  </Button>
                  <Button className="w-full bg-gold hover:bg-gold-600 text-navy-900">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Stake G-TOKEN
                  </Button>
                  <Button className="w-full bg-soft-white hover:bg-soft-white/80 text-navy-900">
                    <Coins className="h-4 w-4 mr-2" />
                    Redeem Gold
                  </Button>
                  <Button 
                    onClick={handleManualRefresh}
                    disabled={isSyncing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Force Sync
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Faucet Tab with Enhanced Synchronization */}
          <TabsContent value="faucet" className="space-y-6">
            <FaucetStatus 
              userAddress={connectedAddress} 
              onClaimSuccess={handleFaucetClaimSuccess}
            />
            
            {/* Faucet Statistics */}
            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold">Faucet Statistics</CardTitle>
                <CardDescription className="text-soft-white/70">
                  Real-time faucet contract data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Available Balance:</span>
                      <span className="text-prosperity font-semibold">
                        {formatNumber(balances.faucetStatus.availableBalance)} IDRT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Claim Amount:</span>
                      <span className="text-gold font-semibold">
                        {formatNumber(balances.faucetStatus.claimAmount)} IDRT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Cooldown Period:</span>
                      <span className="text-soft-white">
                        {Math.floor(balances.faucetStatus.cooldownPeriod / 3600)}h
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Can Claim:</span>
                      <Badge className={
                        balances.faucetStatus.canClaim 
                          ? "bg-prosperity/20 text-prosperity border-prosperity/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }>
                        {balances.faucetStatus.canClaim ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Status:</span>
                      <Badge className={
                        balances.faucetStatus.isPaused
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-prosperity/20 text-prosperity border-prosperity/30"
                      }>
                        {balances.faucetStatus.isPaused ? "Paused" : "Active"}
                      </Badge>
                    </div>
                    {balances.faucetStatus.nextClaimTime > 0 && (
                      <div className="flex justify-between">
                        <span className="text-soft-white/70">Next Claim:</span>
                        <span className="text-soft-white text-sm">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(balances.faucetStatus.nextClaimTime).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold">Transaction History</CardTitle>
                <CardDescription className="text-soft-white/70">
                  Your recent DeFi activities with smart contract integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactionHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-soft-white/30 mx-auto mb-4" />
                    <p className="text-soft-white/70">No transactions yet</p>
                    <p className="text-soft-white/50 text-sm">
                      Start using the platform to see your transaction history
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactionHistory.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-navy-900/30 border border-gold/10"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-full bg-gold/20">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <div className="font-medium text-soft-white capitalize">
                              {tx.type}
                            </div>
                            <div className="text-sm text-soft-white/70">
                              {tx.amount} {tx.token}
                            </div>
                            {tx.hash && (
                              <div className="text-xs text-soft-white/50 font-mono">
                                {tx.hash}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              tx.status === "completed"
                                  ? "bg-prosperity/20 text-prosperity border-prosperity/30"
                                  : tx.status === "pending"
                                  ? "bg-gold/20 text-gold border-gold/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }
                          >
                            {tx.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {tx.status}
                          </Badge>
                          <div className="text-xs text-soft-white/50 mt-1">
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Synchronization Metrics</CardTitle>
                  <CardDescription className="text-soft-white/70">
                    Smart contract synchronization performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Last Sync:</span>
                      <span className="text-soft-white font-semibold">
                        {lastSyncTime ? lastSyncTime.toLocaleTimeString() : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Sync Frequency:</span>
                      <span className="text-prosperity font-semibold">30 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Event Listeners:</span>
                      <span className="text-prosperity font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Real-time Updates:</span>
                      <Badge className="bg-prosperity/20 text-prosperity border-prosperity/30">
                        <Zap className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Platform Usage</CardTitle>
                  <CardDescription className="text-soft-white/70">
                    Your activity across different features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Total Transactions:</span>
                      <span className="text-soft-white font-semibold">{transactionHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Faucet Claims:</span>
                      <span className="text-soft-white font-semibold">
                        {transactionHistory.filter(tx => tx.type === "claim").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Token Swaps:</span>
                      <span className="text-soft-white font-semibold">
                        {transactionHistory.filter(tx => tx.type === "swap").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-white/70">Success Rate:</span>
                      <span className="text-prosperity font-semibold">
                        {transactionHistory.length > 0 
                          ? Math.round((transactionHistory.filter(tx => tx.status === "completed").length / transactionHistory.length) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
