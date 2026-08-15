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

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connectedAddress, setConnectedAddress] = useState("")

  // Contract states
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

  // Form states
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-soft-white">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              Access Denied. Only admin address {ADMIN_ADDRESS} can access this panel.
              <br />
              Connected: {connectedAddress || "No wallet connected"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-soft-white mb-2">Admin Dashboard</h1>
          <p className="text-soft-white/70">Manage Aurix Finance smart contracts</p>
          <Badge className="bg-prosperity/20 text-prosperity border-prosperity/30 mt-2">
            <CheckCircle className="h-3 w-3 mr-1" />
            Admin Access Granted
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-navy-800/50 border-gold/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              Overview
            </TabsTrigger>
            <TabsTrigger value="vault" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              Vault
            </TabsTrigger>
            <TabsTrigger value="faucet" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              Faucet
            </TabsTrigger>
            <TabsTrigger value="swap" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              Swap
            </TabsTrigger>
            <TabsTrigger value="tokens" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              Tokens
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gold flex items-center text-lg">
                    <Shield className="h-5 w-5 mr-2" />
                    Vault Reserve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-soft-white">
                    {formatNumber(vaultStats.totalReserveGrams)}g
                  </div>
                  <div className="text-sm text-soft-white/70">Total Gold Reserve</div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gold flex items-center text-lg">
                    <Coins className="h-5 w-5 mr-2" />
                    G-TOKEN Supply
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-soft-white">{formatNumber(goldTokenStats.totalSupply)}</div>
                  <div className="text-sm text-soft-white/70">Total Minted</div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gold flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Faucet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-soft-white">{formatNumber(faucetStats.availableBalance)}</div>
                  <div className="text-sm text-soft-white/70">IDRT Available</div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gold flex items-center text-lg">
                    <ArrowUpDown className="h-5 w-5 mr-2" />
                    Swap Fee
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-soft-white">{swapStats.feePercent}%</div>
                  <div className="text-sm text-soft-white/70">Current Rate</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button onClick={loadContractData} className="bg-prosperity hover:bg-prosperity/80 text-navy-900">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Button variant="outline" className="border-gold/20 text-soft-white hover:bg-gold/10 bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vault Management Tab */}
          <TabsContent value="vault" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Vault Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Total Reserve:</span>
                    <span className="text-gold font-semibold">{formatNumber(vaultStats.totalReserveGrams)} grams</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Reserve Used:</span>
                    <span className="text-soft-white">{formatNumber(vaultStats.reserveUsed)} grams</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Available:</span>
                    <span className="text-prosperity font-semibold">
                      {formatNumber(vaultStats.availableGrams)} grams
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Update Reserve</CardTitle>
                  <CardDescription className="text-soft-white/70">Set total gold reserve in grams</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-soft-white">New Reserve (grams)</Label>
                    <Input
                      type="number"
                      placeholder="Enter reserve amount"
                      value={newReserve}
                      onChange={(e) => setNewReserve(e.target.value)}
                      className="bg-navy-900/50 border-gold/20 text-soft-white"
                    />
                  </div>
                  <Button
                    onClick={updateVaultReserve}
                    disabled={!newReserve}
                    className="w-full bg-gold hover:bg-gold-600 text-navy-900"
                  >
                    Update Reserve
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Faucet Management Tab */}
          <TabsContent value="faucet" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Faucet Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Available Balance:</span>
                    <span className="text-gold font-semibold">{formatNumber(faucetStats.availableBalance)} IDRT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Claim Amount:</span>
                    <span className="text-prosperity">{formatNumber(faucetStats.claimAmount)} IDRT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Total Distributed:</span>
                    <span className="text-soft-white">{formatNumber(faucetStats.totalDistributed)} IDRT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Claim Cooldown:</span>
                    <span className="text-soft-white flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatCooldown(faucetStats.claimCooldown)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Status:</span>
                    <Badge
                      className={
                        faucetStats.isPaused
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-prosperity/20 text-prosperity border-prosperity/30"
                      }
                    >
                      {faucetStats.isPaused ? "Paused" : "Active"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Ownership Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Current Owner:</span>
                    <span className="text-gold font-mono text-sm">{formatAddress(faucetStats.owner)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Pending Owner:</span>
                    <span className="text-soft-white font-mono text-sm">{formatAddress(faucetStats.pendingOwner)}</span>
                  </div>
                  {faucetStats.pendingOwner &&
                    faucetStats.pendingOwner !== "0x0000000000000000000000000000000000000000" && (
                      <Button
                        onClick={acceptOwnership}
                        className="w-full bg-prosperity hover:bg-prosperity/80 text-navy-900"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Accept Ownership
                      </Button>
                    )}
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Fund Faucet
                  </CardTitle>
                  <CardDescription className="text-soft-white/70">Transfer IDRT tokens to faucet pool</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-soft-white">Amount (IDRT)</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount to fund"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="bg-navy-900/50 border-gold/20 text-soft-white"
                    />
                  </div>
                  <Button
                    onClick={fundFaucet}
                    disabled={!fundAmount}
                    className="w-full bg-prosperity hover:bg-prosperity/80 text-navy-900"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Fund Faucet
                  </Button>
                  <Alert className="border-prosperity/20 bg-prosperity/10">
                    <CheckCircle className="h-4 w-4 text-prosperity" />
                    <AlertDescription className="text-prosperity text-sm">
                      This will transfer IDRT from your wallet to the faucet contract. Approval required.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center">
                    <Minus className="h-5 w-5 mr-2" />
                    Withdraw from Faucet
                  </CardTitle>
                  <CardDescription className="text-soft-white/70">
                    Withdraw IDRT tokens from faucet contract
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-soft-white">Amount (IDRT)</Label>
                    <Input
                      type="number"
                      placeholder="Enter withdrawal amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-navy-900/50 border-gold/20 text-soft-white"
                    />
                  </div>
                  <Button
                    onClick={withdrawFromFaucet}
                    disabled={!withdrawAmount}
                    className="w-full bg-gold hover:bg-gold-600 text-navy-900"
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Withdraw Tokens
                  </Button>
                  <Alert className="border-gold/20 bg-gold/10">
                    <AlertTriangle className="h-4 w-4 text-gold" />
                    <AlertDescription className="text-gold text-sm">
                      This will transfer IDRT from the faucet contract to your wallet.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold">Faucet Controls</CardTitle>
                <CardDescription className="text-soft-white/70">Manage faucet operations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={toggleFaucetPause}
                  className={`w-full ${faucetStats.isPaused ? "bg-prosperity hover:bg-prosperity/80" : "bg-red-500 hover:bg-red-600"} text-navy-900`}
                >
                  {faucetStats.isPaused ? "Resume Faucet" : "Pause Faucet"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Swap Management Tab */}
          <TabsContent value="swap" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Swap Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Current Fee:</span>
                    <span className="text-gold font-semibold">{swapStats.feePercent}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold">Update Swap Fee</CardTitle>
                  <CardDescription className="text-soft-white/70">Set swap fee percentage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-soft-white">Fee Percentage</Label>
                    <Input
                      type="number"
                      placeholder="Enter fee percentage"
                      value={newSwapFee}
                      onChange={(e) => setNewSwapFee(e.target.value)}
                      className="bg-navy-900/50 border-gold/20 text-soft-white"
                    />
                  </div>
                  <Button
                    onClick={updateSwapFee}
                    disabled={!newSwapFee}
                    className="w-full bg-gold hover:bg-gold-600 text-navy-900"
                  >
                    Update Fee
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold">Update Gold Price</CardTitle>
                <CardDescription className="text-soft-white/70">
                  Set gold price in IDRT for redemption calculations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-soft-white">Gold Price (IDRT per gram)</Label>
                  <Input
                    type="number"
                    placeholder="Enter gold price"
                    value={newGoldPrice}
                    onChange={(e) => setNewGoldPrice(e.target.value)}
                    className="bg-navy-900/50 border-gold/20 text-soft-white"
                  />
                </div>
                <Button
                  onClick={updateGoldPrice}
                  disabled={!newGoldPrice}
                  className="w-full bg-gold hover:bg-gold-600 text-navy-900"
                >
                  Update Gold Price
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Token Management Tab */}
          <TabsContent value="tokens" className="space-y-6">
            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold">Gold Token Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Name:</span>
                    <span className="text-soft-white font-semibold">{goldTokenStats.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Symbol:</span>
                    <span className="text-soft-white font-semibold">{goldTokenStats.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Total Supply:</span>
                    <span className="text-gold font-semibold">{formatNumber(goldTokenStats.totalSupply)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Decimals:</span>
                    <span className="text-soft-white font-semibold">18</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
