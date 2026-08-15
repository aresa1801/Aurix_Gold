"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Minus, Info, Coins } from "lucide-react"
import { useGoldPrice } from "@/hooks/use-gold-price"
import { GoldPriceService } from "@/services/gold-price"

interface GoldPriceWidgetProps {
  compact?: boolean
  showDetails?: boolean
}

export function GoldPriceWidget({ compact = false, showDetails = true }: GoldPriceWidgetProps) {
  const [showOriginalPrice, setShowOriginalPrice] = useState(false)

  const {
    data: goldPriceData,
    isLoading,
    error,
    refresh,
  } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatChangePercent = (changePercent: number) => {
    const sign = changePercent >= 0 ? "+" : ""
    return `${sign}${changePercent.toFixed(2)}%`
  }

  const getTrendIcon = (changePercent: number) => {
    if (changePercent > 0.1) return <TrendingUp className="h-4 w-4 text-prosperity" />
    if (changePercent < -0.1) return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Minus className="h-4 w-4 text-soft-white/50" />
  }

  const getTrendColor = (changePercent: number) => {
    if (changePercent > 0.1) return "text-prosperity"
    if (changePercent < -0.1) return "text-red-400"
    return "text-soft-white/50"
  }

  const getConfidenceBadge = () => {
    if (!goldPriceData) return null

    const confidence = GoldPriceService.getPriceConfidence(goldPriceData)
    const colors = {
      high: "bg-prosperity/20 text-prosperity border-prosperity/30",
      medium: "bg-gold/20 text-gold border-gold/30",
      low: "bg-red-400/20 text-red-400 border-red-400/30",
    }

    return (
      <Badge className={colors[confidence]}>
        {confidence === "high" ? "High Confidence" : confidence === "medium" ? "Medium Confidence" : "Low Confidence"}
      </Badge>
    )
  }

  const getMarketStatus = () => {
    const status = GoldPriceService.getMarketStatus()
    return (
      <Badge className={status.isOpen ? "bg-prosperity/20 text-prosperity" : "bg-red-400/20 text-red-400"}>
        {status.isOpen ? "Market Open" : "Market Closed"}
      </Badge>
    )
  }

  const multipliers = GoldPriceService.getPricingMultipliers()

  if (compact) {
    return (
      <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-soft-white/70">G-TOKEN Price</div>
              <div className="text-xl font-bold text-gold">
                {isLoading ? "Loading..." : goldPriceData ? formatPrice(goldPriceData.buyPrice) : "N/A"}
              </div>
            </div>
            <div className="text-right">
              {goldPriceData?.changePercent24h && (
                <div className={`flex items-center ${getTrendColor(goldPriceData.changePercent24h)}`}>
                  {getTrendIcon(goldPriceData.changePercent24h)}
                  <span className="ml-1 text-sm">{formatChangePercent(goldPriceData.changePercent24h)}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refresh()}
                disabled={isLoading}
                className="text-soft-white/70 hover:text-gold p-1"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gold flex items-center">
            <Coins className="h-5 w-5 mr-2" />
            G-TOKEN Live Price
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getMarketStatus()}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refresh()}
              disabled={isLoading}
              className="text-soft-white/70 hover:text-gold"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <RefreshCw className="h-8 w-8 animate-spin text-gold mx-auto mb-2" />
            <p className="text-soft-white/70">Loading real-time price...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-400 mb-2">Failed to load price data</p>
            <Button variant="outline" size="sm" onClick={() => refresh()}>
              Retry
            </Button>
          </div>
        ) : goldPriceData ? (
          <>
            {/* Main Price Display */}
            <div className="text-center">
              <div className="text-sm text-soft-white/70 mb-1">
                {showOriginalPrice ? "Original Gold Price" : "G-TOKEN Price"} (per gram)
              </div>
              <div className="text-4xl font-bold text-gold mb-2">
                {showOriginalPrice && goldPriceData.originalBuyPrice
                  ? formatPrice(goldPriceData.originalBuyPrice)
                  : formatPrice(goldPriceData.buyPrice)}
              </div>

              {/* Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOriginalPrice(!showOriginalPrice)}
                className="text-soft-white/70 hover:text-gold text-xs"
              >
                <Info className="h-3 w-3 mr-1" />
                {showOriginalPrice ? "Show G-TOKEN Price" : "Show Original Price"}
              </Button>
            </div>

            {/* Buy/Sell Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-900/50 rounded-lg p-3 border border-gold/20">
                <div className="text-sm text-soft-white/70 mb-1">Buy Price</div>
                <div className="text-lg font-semibold text-gold">
                  {showOriginalPrice && goldPriceData.originalBuyPrice
                    ? formatPrice(goldPriceData.originalBuyPrice)
                    : formatPrice(goldPriceData.buyPrice)}
                </div>
              </div>
              <div className="bg-navy-900/50 rounded-lg p-3 border border-prosperity/20">
                <div className="text-sm text-soft-white/70 mb-1">Sell Price</div>
                <div className="text-lg font-semibold text-prosperity">
                  {showOriginalPrice && goldPriceData.originalSellPrice
                    ? formatPrice(goldPriceData.originalSellPrice)
                    : formatPrice(goldPriceData.sellPrice)}
                </div>
              </div>
            </div>

            {/* Price Change */}
            {goldPriceData.changePercent24h !== undefined && (
              <div className="flex items-center justify-center space-x-2">
                {getTrendIcon(goldPriceData.changePercent24h)}
                <span className={`font-semibold ${getTrendColor(goldPriceData.changePercent24h)}`}>
                  {formatChangePercent(goldPriceData.changePercent24h)}
                </span>
                <span className="text-soft-white/70 text-sm">24h change</span>
              </div>
            )}

            {showDetails && (
              <>
                {/* Data Source Info */}
                <div className="bg-navy-900/50 rounded-lg p-3 border border-gold/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-soft-white">Data Source</div>
                    {getConfidenceBadge()}
                  </div>
                  <div className="text-sm text-soft-white/70">
                    {GoldPriceService.getDataSourceInfo(goldPriceData).description}
                  </div>
                  <div className="text-xs text-soft-white/50 mt-1">
                    Last updated: {new Date(goldPriceData.lastUpdated).toLocaleTimeString("id-ID")}
                  </div>
                </div>

                {/* G-TOKEN Benefits */}
                <div className="bg-gradient-to-r from-gold/10 to-prosperity/10 rounded-lg p-3 border border-gold/20">
                  <div className="text-sm font-semibold text-gold mb-2">💡 Why G-TOKEN Premium?</div>
                  <div className="text-xs text-soft-white/70 space-y-1">
                    <div>• 24/7 trading availability</div>
                    <div>• No physical storage required</div>
                    <div>• Instant liquidity</div>
                    <div>• Blockchain security</div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-soft-white/70">No price data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
