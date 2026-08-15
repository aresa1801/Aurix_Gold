"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Droplets, Clock, CheckCircle, AlertTriangle, RefreshCw, Coins, Timer } from 'lucide-react'
import { contractService } from "@/services/contracts"
import { toast } from "@/hooks/use-toast"

interface FaucetStatusProps {
  userAddress: string | null
  onClaimSuccess?: () => void
}

interface FaucetStatus {
  canClaim: boolean
  nextClaimTime: number
  lastClaimTime: number
  claimAmount: string
  availableBalance: string
  isPaused: boolean
}

export default function FaucetStatus({ userAddress, onClaimSuccess }: FaucetStatusProps) {
  const [faucetStatus, setFaucetStatus] = useState<FaucetStatus>({
    canClaim: false,
    nextClaimTime: 0,
    lastClaimTime: 0,
    claimAmount: "1000000",
    availableBalance: "0",
    isPaused: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Load faucet status
  const loadFaucetStatus = async () => {
    if (!userAddress) return

    try {
      setIsLoading(true)
      setError(null)
      
      await contractService.initialize()
      const status = await contractService.getFaucetStatus(userAddress)
      setFaucetStatus(status)
      
      // Calculate time until next claim
      if (status.nextClaimTime > 0) {
        const now = Date.now()
        const timeLeft = Math.max(0, status.nextClaimTime - now)
        setTimeUntilNextClaim(timeLeft)
      }
    } catch (error) {
      console.error("Failed to load faucet status:", error)
      setError("Failed to load faucet status")
    } finally {
      setIsLoading(false)
    }
  }

  // Claim tokens from faucet
  const handleClaim = async () => {
    if (!userAddress || !faucetStatus.canClaim) return

    try {
      setIsClaiming(true)
      setError(null)

      await contractService.claimFaucet()
      
      toast({
        title: "Claim Successful!",
        description: `Successfully claimed ${formatNumber(faucetStatus.claimAmount)} IDRT tokens`,
      })

      // Refresh status after successful claim
      await loadFaucetStatus()
      
      // Notify parent component
      if (onClaimSuccess) {
        onClaimSuccess()
      }
    } catch (error: any) {
      console.error("Faucet claim failed:", error)
      const errorMessage = error.message || "Failed to claim tokens"
      setError(errorMessage)
      
      toast({
        title: "Claim Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  // Format numbers for display
  const formatNumber = (num: string | number) => {
    const n = typeof num === "string" ? parseFloat(num) : num
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(1)}M`
    } else if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}K`
    }
    return n.toLocaleString()
  }

  // Format time duration
  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  // Calculate cooldown progress
  const getCooldownProgress = () => {
    if (faucetStatus.lastClaimTime === 0 || faucetStatus.nextClaimTime === 0) {
      return 100
    }
    
    const totalCooldown = faucetStatus.nextClaimTime - faucetStatus.lastClaimTime
    const elapsed = Date.now() - faucetStatus.lastClaimTime
    const progress = Math.min(100, (elapsed / totalCooldown) * 100)
    
    return Math.max(0, progress)
  }

  // Update countdown timer
  useEffect(() => {
    if (timeUntilNextClaim <= 0) return

    const interval = setInterval(() => {
      setTimeUntilNextClaim(prev => {
        const newTime = Math.max(0, prev - 1000)
        if (newTime === 0) {
          // Cooldown finished, refresh status
          loadFaucetStatus()
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeUntilNextClaim])

  // Load initial status
  useEffect(() => {
    loadFaucetStatus()
  }, [userAddress])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadFaucetStatus, 30000)
    return () => clearInterval(interval)
  }, [userAddress])

  if (!userAddress) {
    return (
      <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Droplets className="h-5 w-5 mr-2" />
            IDRT Faucet
          </CardTitle>
          <CardDescription className="text-soft-white/70">
            Connect your wallet to claim free IDRT tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-gold/20 bg-gold/10">
            <AlertTriangle className="h-4 w-4 text-gold" />
            <AlertDescription className="text-gold">
              Please connect your wallet to access the faucet
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gold flex items-center">
            <Droplets className="h-5 w-5 mr-2" />
            IDRT Faucet
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadFaucetStatus}
            disabled={isLoading}
            className="text-soft-white/70 hover:text-gold"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription className="text-soft-white/70">
          Claim free IDRT tokens every 24 hours
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Faucet Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-soft-white/70">
              <Coins className="h-4 w-4 mr-1" />
              Claim Amount
            </div>
            <div className="text-lg font-semibold text-gold">
              {formatNumber(faucetStatus.claimAmount)} IDRT
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-soft-white/70">
              <Droplets className="h-4 w-4 mr-1" />
              Available Balance
            </div>
            <div className="text-lg font-semibold text-prosperity">
              {formatNumber(faucetStatus.availableBalance)} IDRT
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {faucetStatus.isPaused ? (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Paused
              </Badge>
            ) : faucetStatus.canClaim ? (
              <Badge className="bg-prosperity/20 text-prosperity border-prosperity/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready to Claim
              </Badge>
            ) : (
              <Badge className="bg-gold/20 text-gold border-gold/30">
                <Clock className="h-3 w-3 mr-1" />
                Cooldown Active
              </Badge>
            )}
          </div>
        </div>

        {/* Cooldown Progress */}
        {!faucetStatus.canClaim && timeUntilNextClaim > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-soft-white/70 flex items-center">
                <Timer className="h-4 w-4 mr-1" />
                Next claim in:
              </span>
              <span className="text-gold font-mono">
                {formatDuration(timeUntilNextClaim)}
              </span>
            </div>
            <Progress 
              value={getCooldownProgress()} 
              className="h-2 bg-navy-900/50"
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Claim Button */}
        <Button
          onClick={handleClaim}
          disabled={!faucetStatus.canClaim || faucetStatus.isPaused || isClaiming || isLoading}
          className="w-full bg-prosperity hover:bg-prosperity/80 text-navy-900 disabled:opacity-50"
        >
          {isClaiming ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Claiming...
            </>
          ) : faucetStatus.isPaused ? (
            "Faucet Paused"
          ) : faucetStatus.canClaim ? (
            `Claim ${formatNumber(faucetStatus.claimAmount)} IDRT`
          ) : (
            `Wait ${formatDuration(timeUntilNextClaim)}`
          )}
        </Button>

        {/* Info */}
        <div className="text-xs text-soft-white/50 text-center">
          Faucet provides free IDRT tokens for testing and initial liquidity
        </div>
      </CardContent>
    </Card>
  )
}
