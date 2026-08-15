"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Shield,
  Coins,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  DollarSign,
  Plus,
  Minus,
  Clock,
  User,
} from "lucide-react"
import { contractService } from "@/services/contracts"
import { toast } from "@/hooks/use-toast"

const ADMIN_ADDRESS = "0xcd3FF5f1b21fEAF1610402De0eF5ac4d5EeC4aB3"
const primaryCardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"
const innerCardClass = "rounded-2xl border border-soft-white/5 bg-navy-900/30"
const labelClass = "text-soft-white/50"
const tabTriggerClass =
  "rounded-xl px-4 py-3 text-soft-white/60 data-[state=active]:bg-gold/15 data-[state=active]:text-gold data-[state=active]:shadow-none"
const dataRowClass = "flex items-center justify-between gap-4 border-b border-soft-white/5 py-3 last:border-b-0 last:pb-0 first:pt-0"
const inputClass = "h-11 rounded-xl border-gold/15 bg-navy-900/50 text-soft-white placeholder:text-soft-white/30"

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connectedAddress, setConnectedAddress] = useState("")

  const [vaultStats, setVaultStats] = useState({
    totalReserveGrams: 0,
    reserveUsed: 0,
    availableGrams: 0,
  })

  const [faucetStats, setFaucetStats] = useState({
    availableBalance: "0",
    claimAmount: "0",
    totalDistributed: "0",
    claimCooldown: 86400,
    isPaused: false,
    owner: "",
    pendingOwner: "",
  })

  const [goldTokenStats, setGoldTokenStats] = useState({
    totalSupply: "0",
    name: "",
    symbol: "",
  })

  const [swapStats, setSwapStats] = useState({
    feePercent: 0,
  })

  const [newReserve, setNewReserve] = useState("")
  const [newGoldPrice, setNewGoldPrice] = useState("")
  const [newSwapFee, setNewSwapFee] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [fundAmount, setFundAmount] = useState("")

  useEffect(() => {
    checkAdminAccess()
    loadContractData()
  }, [])

  const checkAdminAccess = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0].toLowerCase()
          setConnectedAddress(address)
          setIsAdmin(address === ADMIN_ADDRESS.toLowerCase())
        }
      }
    } catch (error) {
      console.error("Failed to check admin access:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadContractData = async () => {
    const safeCall = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
      try {
        await contractService.initialize()
        return await fn()
      } catch (err) {
        console.warn("Admin loadContractData silent failure:", err)
        return fallback
      }
    }

    try {
      const [
        vault,
        faucetBalance,
        faucetClaim,
        faucetDistributed,
        faucetCooldown,
        faucetPaused,
        faucetOwner,
        faucetPendingOwner,
        goldSupply,
        goldName,
        goldSymbol,
        swapFee,
      ] = await Promise.all([
        safeCall(() => contractService.getVaultStats(), { totalReserveGrams: 0, reserveUsed: 0, availableGrams: 0 }),
        safeCall(() => contractService.getFaucetAvailableBalance(), "0"),
        safeCall(() => contractService.getFaucetClaimAmount(), "0"),
        safeCall(() => contractService.getFaucetTotalDistributed(), "0"),
        safeCall(() => contractService.getFaucetClaimCooldown(), 86400),
        safeCall(() => contractService.getFaucetStats().then((stats) => stats.isPaused), false),
        safeCall(() => contractService.getFaucetOwner(), ""),
        safeCall(() => contractService.getFaucetPendingOwner(), ""),
        safeCall(() => contractService.getGoldTokenTotalSupply(), "0"),
        safeCall(() => contractService.getGoldTokenName(), "Gold Token"),
        safeCall(() => contractService.getGoldTokenSymbol(), "G-TOKEN"),
        safeCall(() => contractService.getSwapFeePercent(), 2),
      ])

      setVaultStats(vault)
      setFaucetStats({
        availableBalance: faucetBalance,
        claimAmount: faucetClaim,
        totalDistributed: faucetDistributed,
        claimCooldown: faucetCooldown,
        isPaused: faucetPaused,
        owner: faucetOwner,
        pendingOwner: faucetPendingOwner,
      })
      setGoldTokenStats({ totalSupply: goldSupply, name: goldName, symbol: goldSymbol })
      setSwapStats({ feePercent: swapFee })
    } catch (error) {
      console.error("Failed to load contract data:", error)
    }
  }

  const updateVaultReserve = async () => {
    if (!newReserve) return

    try {
      await contractService.setTotalReserve(newReserve)
      toast({
        title: "Reserve Updated",
        description: `Vault reserve updated to ${newReserve} grams`,
      })
      setNewReserve("")
      loadContractData()
    } catch (error) {
      console.error("Failed to update reserve:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update vault reserve",
        variant: "destructive",
      })
    }
  }

  const updateGoldPrice = async () => {
    if (!newGoldPrice) return

    try {
      await contractService.setGoldPrice(newGoldPrice)
      toast({
        title: "Gold Price Updated",
        description: `Gold price updated to ${newGoldPrice} IDRT`,
      })
      setNewGoldPrice("")
      loadContractData()
    } catch (error) {
      console.error("Failed to update gold price:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update gold price",
        variant: "destructive",
      })
    }
  }

  const updateSwapFee = async () => {
    if (!newSwapFee) return

    try {
      await contractService.updateSwapFeePercent(Number(newSwapFee))
      toast({
        title: "Swap Fee Updated",
        description: `Swap fee updated to ${newSwapFee}%`,
      })
      setNewSwapFee("")
      loadContractData()
    } catch (error) {
      console.error("Failed to update swap fee:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update swap fee",
        variant: "destructive",
      })
    }
  }

  const withdrawFromFaucet = async () => {
    if (!withdrawAmount) return

    try {
      await contractService.withdrawFromFaucet(withdrawAmount)
      toast({
        title: "Withdrawal Successful",
        description: `Withdrew ${withdrawAmount} IDRT from faucet`,
      })
      setWithdrawAmount("")
      loadContractData()
    } catch (error) {
      console.error("Failed to withdraw from faucet:", error)
      toast({
        title: "Withdrawal Failed",
        description: "Failed to withdraw from faucet",
        variant: "destructive",
      })
    }
  }

  const fundFaucet = async () => {
    if (!fundAmount) return

    try {
      await contractService.fundFaucet(fundAmount)
      toast({
        title: "Faucet Funded Successfully",
        description: `Added ${fundAmount} IDRT to faucet pool`,
      })
      setFundAmount("")
      loadContractData()
    } catch (error) {
      console.error("Failed to fund faucet:", error)
      toast({
        title: "Fund Failed",
        description: "Failed to fund faucet. Make sure you have sufficient IDRT balance and allowance.",
        variant: "destructive",
      })
    }
  }

  const toggleFaucetPause = async () => {
    try {
      await contractService.toggleFaucetPause()
      toast({
        title: "Faucet Status Updated",
        description: `Faucet ${faucetStats.isPaused ? "unpaused" : "paused"} successfully`,
      })
      loadContractData()
    } catch (error) {
      console.error("Failed to toggle faucet pause:", error)
      toast({
        title: "Toggle Failed",
        description: "Failed to toggle faucet pause status",
        variant: "destructive",
      })
    }
  }

  const acceptOwnership = async () => {
    try {
      await contractService.acceptFaucetOwnership()
      toast({
        title: "Ownership Accepted",
        description: "Successfully accepted faucet ownership",
      })
      loadContractData()
    } catch (error) {
      console.error("Failed to accept ownership:", error)
      toast({
        title: "Accept Failed",
        description: "Failed to accept ownership",
        variant: "destructive",
      })
    }
  }

  const formatNumber = (num: number | string) => {
    const n = typeof num === "string" ? Number.parseFloat(num) : num
    return new Intl.NumberFormat("id-ID").format(n)
  }

  const formatAddress = (address: string) => {
    if (!address) return "Not set"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatCooldown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (isLoading) {
    return (
      <section className="min-h-screen px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <Card className={primaryCardClass}>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
              <RefreshCw className="h-10 w-10 animate-spin text-gold" />
              <div className="space-y-1">
                <p className="font-bold text-soft-white">Loading admin panel</p>
                <p className="text-soft-white/50">Connecting to wallet permissions and contract data.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="min-h-screen px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <Alert className="rounded-2xl border-red-500/20 bg-red-500/10 p-6">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              Access Denied. Only admin address {ADMIN_ADDRESS} can access this panel.
              <br />
              Connected: {connectedAddress || "No wallet connected"}
            </AlertDescription>
          </Alert>
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
              <div className="space-y-3">
                <Badge className="w-fit border-prosperity/20 bg-prosperity/10 text-prosperity">
                  <CheckCircle className="mr-1 h-3.5 w-3.5" />
                  Admin Access Granted
                </Badge>
                <div>
                  <h1 className="text-4xl font-bold text-soft-white">Admin Dashboard</h1>
                  <p className="mt-2 text-soft-white/50">Manage Aurix Finance smart contracts from a cleaner control surface.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
                <div className={`${innerCardClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-soft-white/50">Connected admin</p>
                  <p className="mt-2 font-semibold text-soft-white">{formatAddress(connectedAddress)}</p>
                </div>
                <div className={`${innerCardClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-soft-white/50">Faucet status</p>
                  <p className={`mt-2 font-semibold ${faucetStats.isPaused ? "text-red-400" : "text-prosperity"}`}>
                    {faucetStats.isPaused ? "Paused" : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-soft-white/5 bg-navy-800/30 p-2 backdrop-blur-md xl:grid-cols-5">
            <TabsTrigger value="overview" className={tabTriggerClass}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="vault" className={tabTriggerClass}>
              Vault
            </TabsTrigger>
            <TabsTrigger value="faucet" className={tabTriggerClass}>
              Faucet
            </TabsTrigger>
            <TabsTrigger value="swap" className={tabTriggerClass}>
              Swap
            </TabsTrigger>
            <TabsTrigger value="tokens" className={tabTriggerClass}>
              Tokens
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Card className={primaryCardClass}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={labelClass}>Vault Reserve</p>
                      <p className="mt-3 text-3xl font-bold text-soft-white">{formatNumber(vaultStats.totalReserveGrams)}g</p>
                      <p className="mt-1 text-sm text-soft-white/50">Total gold reserve</p>
                    </div>
                    <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 text-gold">
                      <Shield className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={labelClass}>G-TOKEN Supply</p>
                      <p className="mt-3 text-3xl font-bold text-soft-white">{formatNumber(goldTokenStats.totalSupply)}</p>
                      <p className="mt-1 text-sm text-soft-white/50">Total minted supply</p>
                    </div>
                    <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 text-gold">
                      <Coins className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={labelClass}>Faucet Balance</p>
                      <p className="mt-3 text-3xl font-bold text-soft-white">{formatNumber(faucetStats.availableBalance)}</p>
                      <p className="mt-1 text-sm text-soft-white/50">IDRT available</p>
                    </div>
                    <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 text-gold">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={labelClass}>Swap Fee</p>
                      <p className="mt-3 text-3xl font-bold text-soft-white">{swapStats.feePercent}%</p>
                      <p className="mt-1 text-sm text-soft-white/50">Current exchange fee</p>
                    </div>
                    <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 text-gold">
                      <ArrowUpDown className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">System Overview</CardTitle>
                  <CardDescription className="text-soft-white/50">Organized contract metrics for quick operational checks.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-2">
                  <div className={`${innerCardClass} p-5`}>
                    <p className="mb-3 font-semibold text-soft-white">Vault</p>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Total Reserve</span>
                      <span className="font-semibold text-gold">{formatNumber(vaultStats.totalReserveGrams)} grams</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Reserve Used</span>
                      <span className="text-soft-white">{formatNumber(vaultStats.reserveUsed)} grams</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Available</span>
                      <span className="font-semibold text-prosperity">{formatNumber(vaultStats.availableGrams)} grams</span>
                    </div>
                  </div>

                  <div className={`${innerCardClass} p-5`}>
                    <p className="mb-3 font-semibold text-soft-white">Faucet</p>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Claim Amount</span>
                      <span className="font-semibold text-prosperity">{formatNumber(faucetStats.claimAmount)} IDRT</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Cooldown</span>
                      <span className="text-soft-white">{formatCooldown(faucetStats.claimCooldown)}</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Status</span>
                      <Badge
                        className={
                          faucetStats.isPaused
                            ? "border-red-500/30 bg-red-500/15 text-red-400"
                            : "border-prosperity/30 bg-prosperity/15 text-prosperity"
                        }
                      >
                        {faucetStats.isPaused ? "Paused" : "Active"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Quick Actions</CardTitle>
                  <CardDescription className="text-soft-white/50">Common controls for refreshing and navigating admin workflows.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 p-6 pt-0">
                  <Button onClick={loadContractData} className="w-full rounded-xl bg-prosperity text-navy-900 hover:bg-prosperity/80">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl border-gold/20 bg-transparent text-soft-white hover:bg-gold/10">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vault" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Vault Statistics</CardTitle>
                  <CardDescription className="text-soft-white/50">Reserve health and allocation in a cleaner data layout.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className={`${innerCardClass} p-5`}>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Total Reserve</span>
                      <span className="font-semibold text-gold">{formatNumber(vaultStats.totalReserveGrams)} grams</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Reserve Used</span>
                      <span className="text-soft-white">{formatNumber(vaultStats.reserveUsed)} grams</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Available</span>
                      <span className="font-semibold text-prosperity">{formatNumber(vaultStats.availableGrams)} grams</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Update Reserve</CardTitle>
                  <CardDescription className="text-soft-white/50">Set total gold reserve in grams.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  <div className="space-y-2">
                    <Label className="text-soft-white/50">New Reserve (grams)</Label>
                    <Input
                      type="number"
                      placeholder="Enter reserve amount"
                      value={newReserve}
                      onChange={(e) => setNewReserve(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <Button
                    onClick={updateVaultReserve}
                    disabled={!newReserve}
                    className="w-full rounded-xl bg-gold text-navy-900 hover:bg-gold-600"
                  >
                    Update Reserve
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faucet" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Faucet Statistics</CardTitle>
                  <CardDescription className="text-soft-white/50">Operational faucet metrics with improved scanability.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className={`${innerCardClass} p-5`}>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Available Balance</span>
                      <span className="font-semibold text-gold">{formatNumber(faucetStats.availableBalance)} IDRT</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Claim Amount</span>
                      <span className="font-semibold text-prosperity">{formatNumber(faucetStats.claimAmount)} IDRT</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Total Distributed</span>
                      <span className="text-soft-white">{formatNumber(faucetStats.totalDistributed)} IDRT</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Claim Cooldown</span>
                      <span className="flex items-center text-soft-white">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatCooldown(faucetStats.claimCooldown)}
                      </span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Status</span>
                      <Badge
                        className={
                          faucetStats.isPaused
                            ? "border-red-500/30 bg-red-500/15 text-red-400"
                            : "border-prosperity/30 bg-prosperity/15 text-prosperity"
                        }
                      >
                        {faucetStats.isPaused ? "Paused" : "Active"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Ownership Information</CardTitle>
                  <CardDescription className="text-soft-white/50">Current control and pending ownership transfer state.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  <div className={`${innerCardClass} p-5`}>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Current Owner</span>
                      <span className="font-mono text-sm text-gold">{formatAddress(faucetStats.owner)}</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Pending Owner</span>
                      <span className="font-mono text-sm text-soft-white">{formatAddress(faucetStats.pendingOwner)}</span>
                    </div>
                  </div>
                  {faucetStats.pendingOwner &&
                    faucetStats.pendingOwner !== "0x0000000000000000000000000000000000000000" && (
                      <Button onClick={acceptOwnership} className="w-full rounded-xl bg-prosperity text-navy-900 hover:bg-prosperity/80">
                        <User className="mr-2 h-4 w-4" />
                        Accept Ownership
                      </Button>
                    )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="flex items-center gap-2 text-soft-white">
                    <Plus className="h-5 w-5 text-prosperity" />
                    Fund Faucet
                  </CardTitle>
                  <CardDescription className="text-soft-white/50">Transfer IDRT tokens to the faucet pool.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  <div className="space-y-2">
                    <Label className="text-soft-white/50">Amount (IDRT)</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount to fund"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <Button onClick={fundFaucet} disabled={!fundAmount} className="w-full rounded-xl bg-prosperity text-navy-900 hover:bg-prosperity/80">
                    <Plus className="mr-2 h-4 w-4" />
                    Fund Faucet
                  </Button>
                  <Alert className="rounded-2xl border-prosperity/20 bg-prosperity/10">
                    <CheckCircle className="h-4 w-4 text-prosperity" />
                    <AlertDescription className="text-sm text-prosperity">
                      This will transfer IDRT from your wallet to the faucet contract. Approval required.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="flex items-center gap-2 text-soft-white">
                    <Minus className="h-5 w-5 text-gold" />
                    Withdraw from Faucet
                  </CardTitle>
                  <CardDescription className="text-soft-white/50">Withdraw IDRT tokens from the faucet contract.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  <div className="space-y-2">
                    <Label className="text-soft-white/50">Amount (IDRT)</Label>
                    <Input
                      type="number"
                      placeholder="Enter withdrawal amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <Button onClick={withdrawFromFaucet} disabled={!withdrawAmount} className="w-full rounded-xl bg-gold text-navy-900 hover:bg-gold-600">
                    <Minus className="mr-2 h-4 w-4" />
                    Withdraw Tokens
                  </Button>
                  <Alert className="rounded-2xl border-gold/20 bg-gold/10">
                    <AlertTriangle className="h-4 w-4 text-gold" />
                    <AlertDescription className="text-sm text-gold">
                      This will transfer IDRT from the faucet contract to your wallet.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <Card className={primaryCardClass}>
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-soft-white">Faucet Controls</CardTitle>
                <CardDescription className="text-soft-white/50">Pause or resume faucet operations.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Button
                  onClick={toggleFaucetPause}
                  className={`w-full rounded-xl ${faucetStats.isPaused ? "bg-prosperity hover:bg-prosperity/80" : "bg-red-500 hover:bg-red-600"} text-navy-900`}
                >
                  {faucetStats.isPaused ? "Resume Faucet" : "Pause Faucet"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swap" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Swap Configuration</CardTitle>
                  <CardDescription className="text-soft-white/50">Current fee settings for the swap contract.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className={`${innerCardClass} p-5`}>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Current Fee</span>
                      <span className="font-semibold text-gold">{swapStats.feePercent}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={primaryCardClass}>
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-soft-white">Update Swap Fee</CardTitle>
                  <CardDescription className="text-soft-white/50">Set swap fee percentage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  <div className="space-y-2">
                    <Label className="text-soft-white/50">Fee Percentage</Label>
                    <Input
                      type="number"
                      placeholder="Enter fee percentage"
                      value={newSwapFee}
                      onChange={(e) => setNewSwapFee(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <Button onClick={updateSwapFee} disabled={!newSwapFee} className="w-full rounded-xl bg-gold text-navy-900 hover:bg-gold-600">
                    Update Fee
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className={primaryCardClass}>
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-soft-white">Update Gold Price</CardTitle>
                <CardDescription className="text-soft-white/50">Set gold price in IDRT for redemption calculations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-0">
                <div className="space-y-2">
                  <Label className="text-soft-white/50">Gold Price (IDRT per gram)</Label>
                  <Input
                    type="number"
                    placeholder="Enter gold price"
                    value={newGoldPrice}
                    onChange={(e) => setNewGoldPrice(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <Button onClick={updateGoldPrice} disabled={!newGoldPrice} className="w-full rounded-xl bg-gold text-navy-900 hover:bg-gold-600">
                  Update Gold Price
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <Card className={primaryCardClass}>
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-soft-white">Gold Token Information</CardTitle>
                <CardDescription className="text-soft-white/50">Cleaner token reference data for admin checks.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className={`${innerCardClass} p-5`}>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Name</span>
                      <span className="font-semibold text-soft-white">{goldTokenStats.name}</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Symbol</span>
                      <span className="font-semibold text-soft-white">{goldTokenStats.symbol}</span>
                    </div>
                  </div>
                  <div className={`${innerCardClass} p-5`}>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Total Supply</span>
                      <span className="font-semibold text-gold">{formatNumber(goldTokenStats.totalSupply)}</span>
                    </div>
                    <div className={dataRowClass}>
                      <span className={labelClass}>Decimals</span>
                      <span className="font-semibold text-soft-white">18</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
