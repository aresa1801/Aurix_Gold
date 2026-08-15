import { useState, useEffect, useCallback } from "react"
import { contractService } from "@/services/contracts"
import { toast } from "@/hooks/use-toast"
import { useGoldPrice } from "@/hooks/use-gold-price"

// Conversion rate constants
const BNB_TO_IDR_RATE = 15000000 // 1 BNB = 15,000,000 IDR
const IDR_TO_USD_RATE = 15000 // 1 USD = 15,000 IDR

export interface SynchronizedBalances {
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

export interface PortfolioMetrics {
  totalValueUSD: string
  totalValueIDR: string
  portfolioChange24h: string
  idrtPercentage: number
  goldTokenPercentage: number
  bnbPercentage: number
}

export interface TransactionHistory {
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

export function usePortfolioData(connectedAddress: string | null) {
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
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [syncProgress, setSyncProgress] = useState(0)

  const { data: goldPriceData } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000,
  })

  const calculatePortfolioMetrics = useCallback(
    (balanceData: SynchronizedBalances): PortfolioMetrics => {
      const currentGoldPriceIDR = goldPriceData?.buyPrice || 1085000

      const idrtValue = parseFloat(balanceData.idrtBalance)
      const goldValue = parseFloat(balanceData.goldTokenBalance) * currentGoldPriceIDR
      const bnbValue = parseFloat(balanceData.bnbBalance) * BNB_TO_IDR_RATE

      const totalValueIDR = idrtValue + goldValue + bnbValue
      const totalValueUSD = totalValueIDR / IDR_TO_USD_RATE

      const idrtPercentage = totalValueIDR > 0 ? (idrtValue / totalValueIDR) * 100 : 0
      const goldTokenPercentage = totalValueIDR > 0 ? (goldValue / totalValueIDR) * 100 : 0
      const bnbPercentage = totalValueIDR > 0 ? (bnbValue / totalValueIDR) * 100 : 0

      // 24h change calculation based on gold price data (stable value)
      const goldPriceChange = goldPriceData?.change24h || 0

      return {
        totalValueUSD: totalValueUSD.toFixed(2),
        totalValueIDR: totalValueIDR.toFixed(0),
        portfolioChange24h: goldPriceChange >= 0 ? `+${goldPriceChange.toFixed(2)}%` : `${goldPriceChange.toFixed(2)}%`,
        idrtPercentage,
        goldTokenPercentage,
        bnbPercentage,
      }
    },
    [goldPriceData],
  )

  const syncWalletBalances = useCallback(
    async (address: string, showProgress = true) => {
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
    },
    [calculatePortfolioMetrics],
  )

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

  const setupEventListeners = useCallback((address: string) => {
    try {
      contractService.setupEventListeners(address, handleBalanceUpdate)
      console.log("🎧 Real-time event listeners activated")
    } catch (error) {
      console.error("Failed to setup event listeners:", error)
    }
  }, [handleBalanceUpdate])

  const loadTransactionHistory = useCallback(async (address: string) => {
    try {
      // TODO: Replace with real transaction history fetched from blockchain
      // This is mock data for demonstration - should be replaced with actual transaction queries
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
  }, [balances.faucetStatus.claimAmount, balances.faucetStatus.lastClaimTime])

  const resetPortfolioData = useCallback(() => {
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
  }, [])

  return {
    balances,
    portfolioMetrics,
    transactionHistory,
    isSyncing,
    error,
    lastSyncTime,
    syncProgress,
    syncWalletBalances,
    handleBalanceUpdate,
    setupEventListeners,
    loadTransactionHistory,
    resetPortfolioData,
  }
}
