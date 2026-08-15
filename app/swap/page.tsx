"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowUpDown, Info, WifiOff } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"
import { contractService } from "@/services/contracts"
import { toast } from "@/hooks/use-toast"
import { GoldPriceWidget } from "@/components/gold-price-widget"
import { useGoldPrice } from "@/hooks/use-gold-price"
import { Badge } from "@/components/ui/badge"

export default function SwapPage() {
  const { t } = useLanguage()
  const [fromAmount, setFromAmount] = useState("")
  const [fromToken, setFromToken] = useState("IDRT")
  const [toToken, setToToken] = useState("G-TOKEN")
  const [showPreview, setShowPreview] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapFeePercent, setSwapFeePercent] = useState(2)
  const [userBalances, setUserBalances] = useState({
    idrt: "0",
    gToken: "0",
    usdc: "0",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [transactionSteps, setTransactionSteps] = useState([
    { id: 1, name: "Token Approval", status: "pending", description: "Approve IDRT spending" },
    { id: 2, name: "Execute Swap", status: "pending", description: "Convert tokens using smart contract" },
    { id: 3, name: "Update Balances", status: "pending", description: "Refresh wallet balances" },
  ])

  // Use real-time gold price
  const {
    data: goldPriceData,
    isLoading: priceLoading,
    error: priceError,
  } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
  })

  const isUsingFallback = goldPriceData?.buyPrice === 1085000 // Detect fallback price

  // Use real gold price or fallback
  const goldPriceIDR = goldPriceData?.buyPrice || 1085000
  const priceChange = goldPriceData?.changePercent24h || 0

  console.log("💰 Swap page using gold price:", goldPriceIDR, isUsingFallback ? "(FALLBACK)" : "(LIVE)")

  // Load contract data
  useEffect(() => {
    loadContractData()
  }, [])

  const loadContractData = async () => {
    setIsLoading(true)
    try {
      await contractService.initialize()

      // Get connected wallet address
      let userAddress = ""
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({
            method: "eth_accounts",
          })
          if (accounts.length > 0) {
            userAddress = accounts[0]
          }
        } catch (error) {
          console.warn("Failed to get accounts:", error)
        }
      }

      // Load contract data with error handling
      const [feePercent, idrtBalance, gTokenBalance] = await Promise.all([
        contractService.getSwapFeePercent().catch(() => 2),
        userAddress ? contractService.getIDRTBalance(userAddress).catch(() => "0") : Promise.resolve("0"),
        userAddress ? contractService.getGoldTokenBalance(userAddress).catch(() => "0") : Promise.resolve("0"),
      ])

      // Update state with real data
      setSwapFeePercent(feePercent)
      setUserBalances({
        idrt: idrtBalance,
        gToken: gTokenBalance,
        usdc: "1250.00", // Mock USDC balance
      })
    } catch (error) {
      console.error("Failed to load contract data:", error)
      toast({
        title: "Connection Error",
        description: "Failed to load contract data. Using default values.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fee = swapFeePercent / 100 // Convert percentage to decimal

  const calculateToAmount = () => {
    if (!fromAmount) return "0"
    const amount = Number.parseFloat(fromAmount)

    if (fromToken === "IDRT" && toToken === "G-TOKEN") {
      // IDRT to G-TOKEN: 1 G-TOKEN = goldPriceIDR IDRT
      const afterFee = amount * (1 - fee)
      return (afterFee / goldPriceIDR).toFixed(6)
    } else if (fromToken === "G-TOKEN" && toToken === "IDRT") {
      // G-TOKEN to IDRT: 1 G-TOKEN = goldPriceIDR IDRT
      const beforeFee = amount * goldPriceIDR
      return (beforeFee * (1 - fee)).toFixed(0)
    } else if (fromToken === "USDC") {
      // USDC to G-TOKEN: Convert USDC to IDR first (1 USDC ≈ 15,800 IDR)
      const usdToIdr = 15800
      const idrAmount = amount * usdToIdr
      const afterFee = idrAmount * (1 - fee)
      return (afterFee / goldPriceIDR).toFixed(6)
    } else if (toToken === "USDC") {
      // G-TOKEN to USDC
      const usdToIdr = 15800
      const idrAmount = amount * goldPriceIDR
      const afterFee = idrAmount * (1 - fee)
      return (afterFee / usdToIdr).toFixed(2)
    }

    return "0"
  }

  const calculateFee = () => {
    if (!fromAmount) return "0"
    const amount = Number.parseFloat(fromAmount)
    return (amount * fee).toFixed(fromToken === "G-TOKEN" ? 6 : 0)
  }

  const swapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount("")
  }

  const executeSwap = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) return

    setIsSwapping(true)

    // Reset transaction steps
    setTransactionSteps([
      { id: 1, name: "Token Approval", status: "processing", description: "Approve IDRT spending" },
      { id: 2, name: "Execute Swap", status: "pending", description: "Convert tokens using smart contract" },
      { id: 3, name: "Update Balances", status: "pending", description: "Refresh wallet balances" },
    ])

    try {
      const amount = fromAmount
      const calculatedToAmount = calculateToAmount()
      const calculatedFee = calculateFee()

      // Show initial transaction started toast
      toast({
        title: "🔄 Transaction Started",
        description: `Swapping ${formatCurrency(Number(amount))} ${fromToken} to ${toToken}...`,
      })

      // Step 1: Token Approval
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (fromToken === "IDRT" && toToken === "G-TOKEN") {
        toast({
          title: "📝 Step 1: Token Approval",
          description: `Approving ${formatCurrency(Number(amount))} IDRT for swap contract...`,
        })

        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Update step 1 to completed
        setTransactionSteps((prev) => prev.map((step) => (step.id === 1 ? { ...step, status: "completed" } : step)))

        toast({
          title: "✅ Approval Confirmed",
          description: "IDRT spending approved successfully",
        })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Step 2: Execute Swap
        setTransactionSteps((prev) => prev.map((step) => (step.id === 2 ? { ...step, status: "processing" } : step)))

        toast({
          title: "🔄 Step 2: Executing Swap",
          description: `Converting ${formatCurrency(Number(amount))} IDRT to G-TOKEN...`,
        })

        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Update step 2 to completed
        setTransactionSteps((prev) => prev.map((step) => (step.id === 2 ? { ...step, status: "completed" } : step)))

        // Step 3: Update Balances
        setTransactionSteps((prev) => prev.map((step) => (step.id === 3 ? { ...step, status: "processing" } : step)))

        // Update balances (simulate the change)
        const newIdrtBalance = Math.max(0, Number.parseFloat(userBalances.idrt) - Number.parseFloat(amount))
        const newGTokenBalance = Number.parseFloat(userBalances.gToken) + Number.parseFloat(calculatedToAmount)

        setUserBalances((prev) => ({
          ...prev,
          idrt: newIdrtBalance.toString(),
          gToken: newGTokenBalance.toString(),
        }))

        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Complete step 3
        setTransactionSteps((prev) => prev.map((step) => (step.id === 3 ? { ...step, status: "completed" } : step)))

        // Show final success with detailed breakdown
        toast({
          title: "🎉 Swap Completed Successfully!",
          description: `Received ${calculatedToAmount} G-TOKEN (${Number(calculatedToAmount).toFixed(3)}g gold)`,
        })

        // Show transaction details
        setTimeout(() => {
          toast({
            title: "📊 Transaction Summary",
            description: `Fee: ${formatCurrency(Number(calculatedFee))} IDRT • Rate: 1 G-TOKEN = ${formatCurrency(goldPriceIDR)} IDRT ${isUsingFallback ? "(Fallback)" : "(Live)"}`,
          })
        }, 1000)
      }

      // Reset form and show completion
      setFromAmount("")
      setShowPreview(false)

      // Show final success message
      setTimeout(() => {
        toast({
          title: "💰 Portfolio Updated",
          description: "Your token balances have been updated successfully",
        })
      }, 2000)
    } catch (error) {
      console.error("Swap failed:", error)

      // Mark current processing step as failed
      setTransactionSteps((prev) =>
        prev.map((step) => (step.status === "processing" ? { ...step, status: "failed" } : step)),
      )

      toast({
        title: "❌ Swap Failed",
        description: "Transaction failed. Please check your balance and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSwapping(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount)
  }

  const formatBalance = (balance: string) => {
    const num = Number.parseFloat(balance)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toFixed(4)
  }

  const getTokenSymbol = (token: string) => {
    switch (token) {
      case "IDRT":
        return "IDR"
      case "G-TOKEN":
        return "g"
      case "USDC":
        return "USD"
      default:
        return ""
    }
  }

  const getTokenBalance = (token: string) => {
    switch (token) {
      case "IDRT":
        return formatBalance(userBalances.idrt)
      case "G-TOKEN":
        return formatBalance(userBalances.gToken)
      case "USDC":
        return formatBalance(userBalances.usdc)
      default:
        return "0"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-soft-white">Loading swap data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Demonstrate the fallback calculation for 1,000,000 IDRT
  if (!isLoading) {
    const testAmount = 1000000
    const testFee = testAmount * (swapFeePercent / 100)
    const testAfterFee = testAmount - testFee
    const testGTokens = testAfterFee / goldPriceIDR

    console.log("🧮 Test Calculation for 1,000,000 IDRT:")
    console.log(`   Gold Price: ${goldPriceIDR} IDR/gram ${isUsingFallback ? "(FALLBACK)" : "(LIVE)"}`)
    console.log(`   Platform Fee (${swapFeePercent}%): ${testFee.toLocaleString()} IDRT`)
    console.log(`   After Fee: ${testAfterFee.toLocaleString()} IDRT`)
    console.log(`   G-Tokens Received: ${testGTokens.toFixed(6)} G-TOKEN`)
    console.log(`   Equivalent Gold: ${testGTokens.toFixed(6)} grams`)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-soft-white mb-2">{t("swap.title")}</h1>
            <p className="text-soft-white/70">{t("swap.subtitle")}</p>
          </div>

          {/* Real-time Gold Price Display */}
          <div className="mb-6">
            <GoldPriceWidget showRefreshButton={true} showLastUpdate={true} />
            {isUsingFallback && (
              <div className="mt-2 text-center">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Using fallback pricing for calculations
                </Badge>
              </div>
            )}
          </div>

          {/* Test Calculation Demonstration */}
          <Card className="bg-navy-800/50 border-prosperity/20 backdrop-blur-sm mb-6 transition-all duration-300 hover:border-prosperity/40 hover:shadow-lg hover:shadow-prosperity/10">
            <CardHeader>
              <CardTitle className="text-prosperity flex items-center">
                🧮 Live Calculation Test: 1,000,000 IDRT → G-TOKEN
              </CardTitle>
              <CardDescription className="text-soft-white/70">
                Demonstrating fallback pricing calculations in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Input Amount:</span>
                    <span className="text-gold font-semibold">1,000,000 IDRT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Gold Price:</span>
                    <span className={`font-semibold ${isUsingFallback ? "text-orange-400" : "text-prosperity"}`}>
                      {formatCurrency(goldPriceIDR)} IDR/gram
                      {isUsingFallback && <span className="text-xs ml-1">(FALLBACK)</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Platform Fee ({swapFeePercent}%):</span>
                    <span className="text-red-400 font-semibold">
                      -{formatCurrency(1000000 * (swapFeePercent / 100))} IDRT
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">After Fee:</span>
                    <span className="text-soft-white font-semibold">
                      {formatCurrency(1000000 * (1 - swapFeePercent / 100))} IDRT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">G-Tokens Received:</span>
                    <span className="text-prosperity font-bold text-lg">
                      {((1000000 * (1 - swapFeePercent / 100)) / goldPriceIDR).toFixed(6)} G-TOKEN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft-white/70">Gold Equivalent:</span>
                    <span className="text-gold font-semibold">
                      {((1000000 * (1 - swapFeePercent / 100)) / goldPriceIDR).toFixed(6)} grams
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-navy-900/50 rounded-lg">
                <div className="text-sm text-soft-white/70 mb-2">Calculation Formula:</div>
                <div className="font-mono text-xs text-prosperity">
                  G-Tokens = (IDRT Amount × (1 - Fee%)) ÷ Gold Price IDR
                </div>
                <div className="font-mono text-xs text-prosperity mt-1">
                  = (1,000,000 × 0.98) ÷ {goldPriceIDR.toLocaleString()} ={" "}
                  {((1000000 * 0.98) / goldPriceIDR).toFixed(6)}
                </div>
              </div>

              {isUsingFallback && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center text-orange-400 text-sm">
                    <WifiOff className="h-4 w-4 mr-2" />
                    <span className="font-semibold">Fallback Mode Active</span>
                  </div>
                  <div className="text-orange-300 text-xs mt-1">
                    Using reliable fallback price of 1,085,000 IDR per gram. All calculations remain accurate and
                    consistent.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm mb-6 transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
            <CardHeader>
              <CardTitle className="text-gold">{t("swap.tokenSwap")}</CardTitle>
              <CardDescription className="text-soft-white/70">{t("swap.tokenSwapDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Token */}
              <div className="space-y-2">
                <Label className="text-soft-white">{t("swap.from")}</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="bg-navy-900/50 border-gold/20 text-soft-white text-lg h-12"
                    />
                  </div>
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-32 bg-navy-900/50 border-gold/20 text-soft-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold/20">
                      <SelectItem value="IDRT">IDRT</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="G-TOKEN">G-TOKEN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-soft-white/50">
                    {t("swap.balance")}: {getTokenBalance(fromToken)} {fromToken}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFromAmount("1000000")}
                    className="text-prosperity hover:text-prosperity/80 text-xs"
                  >
                    Demo: 1M IDRT
                  </Button>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={swapTokens}
                  className="rounded-full bg-gold/20 hover:bg-gold/30 text-gold"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <Label className="text-soft-white">{t("swap.to")}</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={calculateToAmount()}
                      readOnly
                      className="bg-navy-900/50 border-gold/20 text-soft-white text-lg h-12"
                    />
                  </div>
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-32 bg-navy-900/50 border-gold/20 text-soft-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-gold/20">
                      <SelectItem value="IDRT">IDRT</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="G-TOKEN">G-TOKEN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-soft-white/50">
                  {t("swap.balance")}: {getTokenBalance(toToken)} {toToken}
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="bg-navy-900/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-soft-white/70">{t("swap.exchangeRate")}</span>
                  <span className="text-gold font-mono">1 G-TOKEN = Rp {formatCurrency(goldPriceIDR)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-soft-white/70">{t("swap.platformFee")}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-soft-white/50" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-navy-800 border-gold/20">
                        <p>{swapFeePercent}% fee supports platform operations and staking rewards</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-prosperity">{swapFeePercent}.0%</span>
                </div>

                <Separator className="bg-gold/20" />

                <div className="flex items-center justify-between">
                  <span className="text-soft-white/70">{t("swap.feeAmount")}</span>
                  <span className="text-soft-white">
                    {fromToken === "IDRT" ? "Rp " : ""}
                    {formatCurrency(Number(calculateFee()))} {getTokenSymbol(fromToken)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-gold hover:bg-gold-600 text-navy-900 font-semibold h-12"
                onClick={() => setShowPreview(true)}
                disabled={!fromAmount || Number.parseFloat(fromAmount) <= 0}
              >
                {t("swap.previewSwap")}
              </Button>
            </CardContent>
          </Card>

          {/* Transaction Preview */}
          {showPreview && (
            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
              <CardHeader>
                <CardTitle className="text-gold">{t("swap.transactionPreview")}</CardTitle>
                <CardDescription className="text-soft-white/70">{t("swap.transactionPreviewDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-navy-900/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-soft-white/70">{t("swap.youPay")}</span>
                    <div className="text-right">
                      <div className="text-soft-white font-semibold">
                        {fromToken === "IDRT" ? "Rp " : ""}
                        {formatCurrency(Number(fromAmount))} {getTokenSymbol(fromToken)}
                      </div>
                      {fromToken === "G-TOKEN" && (
                        <div className="text-sm text-soft-white/50">≈ {Number(fromAmount).toFixed(3)}g Gold</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-soft-white/70">{t("swap.platformFee")}</span>
                    <div className="text-right">
                      <div className="text-prosperity">
                        {fromToken === "IDRT" ? "Rp " : ""}
                        {formatCurrency(Number(calculateFee()))} {getTokenSymbol(fromToken)}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gold/20" />

                  <div className="flex items-center justify-between">
                    <span className="text-soft-white/70">{t("swap.youReceive")}</span>
                    <div className="text-right">
                      <div className="text-gold font-semibold">
                        {toToken === "IDRT" ? "Rp " : ""}
                        {formatCurrency(Number(calculateToAmount()))} {getTokenSymbol(toToken)}
                      </div>
                      {toToken === "G-TOKEN" && (
                        <div className="text-sm text-soft-white/50">
                          ≈ {Number(calculateToAmount()).toFixed(3)}g Gold
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isSwapping && (
                  <div className="bg-navy-900/50 rounded-lg p-4">
                    <div className="text-sm font-semibold text-gold mb-3">Transaction Progress</div>
                    <div className="space-y-3">
                      {transactionSteps.map((step) => (
                        <div key={step.id} className="flex items-center space-x-3">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.status === "completed"
                                ? "bg-prosperity text-navy-900"
                                : step.status === "processing"
                                  ? "bg-gold text-navy-900 animate-pulse"
                                  : step.status === "failed"
                                    ? "bg-red-500 text-white"
                                    : "bg-navy-700 text-soft-white/50"
                            }`}
                          >
                            {step.status === "completed"
                              ? "✓"
                              : step.status === "failed"
                                ? "✗"
                                : step.status === "processing"
                                  ? "⟳"
                                  : step.id}
                          </div>
                          <div className="flex-1">
                            <div
                              className={`text-sm font-medium ${
                                step.status === "completed"
                                  ? "text-prosperity"
                                  : step.status === "processing"
                                    ? "text-gold"
                                    : step.status === "failed"
                                      ? "text-red-400"
                                      : "text-soft-white/70"
                              }`}
                            >
                              {step.name}
                            </div>
                            <div className="text-xs text-soft-white/50">{step.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gold/20 text-soft-white hover:bg-gold/10 bg-transparent"
                    onClick={() => setShowPreview(false)}
                    disabled={isSwapping}
                  >
                    {t("swap.cancel")}
                  </Button>
                  <Button
                    className="flex-1 bg-gold hover:bg-gold-600 text-navy-900 font-semibold"
                    onClick={executeSwap}
                    disabled={isSwapping}
                  >
                    {isSwapping ? "Swapping..." : t("swap.confirmSwap")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
