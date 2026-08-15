"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, TrendingDown, Minus, Info, Coins, Radio } from "lucide-react"
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
    refreshInterval: 30000,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
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

  if (compact) {
    return (
      <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <Coins className="h-4 w-4 text-gold" />
              </div>
              <div>
                <div className="text-xs text-soft-white/50">G-TOKEN</div>
                <div className="text-lg font-bold text-gold">
                  {isLoading ? "..." : goldPriceData ? formatPrice(goldPriceData.buyPrice) : "N/A"}
                </div>
              </div>
            </div>
            <div className="text-right flex items-center space-x-2">
              {goldPriceData?.changePercent24h !== undefined && (
                <div className={`flex items-center ${getTrendColor(goldPriceData.changePercent24h)}`}>
                  {getTrendIcon(goldPriceData.changePercent24h)}
                  <span className="ml-1 text-sm font-medium">
                    {goldPriceData.changePercent24h >= 0 ? "+" : ""}
                    {goldPriceData.changePercent24h.toFixed(2)}%
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refresh()}
                disabled={isLoading}
                className="text-soft-white/40 hover:text-gold p-1 h-auto"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        {isLoading && !goldPriceData ? (
          <div className="text-center py-6">
            <RefreshCw className="h-8 w-8 animate-spin text-gold mx-auto mb-3" />
            <p className="text-soft-white/50 text-sm">Loading real-time price...</p>
          </div>
        ) : error && !goldPriceData ? (
          <div className="text-center py-6">
            <p className="text-red-400 mb-3 text-sm">Failed to load price</p>
            <Button variant="outline" size="sm" onClick={() => refresh()} className="border-soft-white/10 text-soft-white/70">
              Retry
            </Button>
          </div>
        ) : goldPriceData ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Coins className="h-4 w-4 text-gold" />
                </div>
                <span className="text-sm font-medium text-soft-white/70">
                  {showOriginalPrice ? "Gold Spot Price" : "G-TOKEN Price"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-prosperity/10 text-prosperity border-prosperity/20 text-xs flex items-center gap-1">
                  <Radio className="h-2.5 w-2.5 animate-pulse" />
                  LIVE
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refresh()}
                  disabled={isLoading}
                  className="text-soft-white/40 hover:text-gold p-1 h-auto"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Main Price */}
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gold">
                {showOriginalPrice && goldPriceData.originalBuyPrice
                  ? formatPrice(goldPriceData.originalBuyPrice)
                  : formatPrice(goldPriceData.buyPrice)}
              </div>
              {goldPriceData.changePercent24h !== undefined && (
                <div className={`flex items-center justify-center mt-2 ${getTrendColor(goldPriceData.changePercent24h)}`}>
                  {getTrendIcon(goldPriceData.changePercent24h)}
                  <span className="ml-1 text-sm font-medium">
                    {goldPriceData.changePercent24h >= 0 ? "+" : ""}
                    {goldPriceData.changePercent24h.toFixed(2)}% (24h)
                  </span>
                </div>
              )}
            </div>

            {/* Buy/Sell */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-navy-900/50 rounded-xl p-3 border border-soft-white/5">
                <div className="text-xs text-soft-white/40 mb-1">Buy</div>
                <div className="text-base font-semibold text-gold">
                  {showOriginalPrice && goldPriceData.originalBuyPrice
                    ? formatPrice(goldPriceData.originalBuyPrice)
                    : formatPrice(goldPriceData.buyPrice)}
                </div>
              </div>
              <div className="bg-navy-900/50 rounded-xl p-3 border border-soft-white/5">
                <div className="text-xs text-soft-white/40 mb-1">Sell</div>
                <div className="text-base font-semibold text-prosperity">
                  {showOriginalPrice && goldPriceData.originalSellPrice
                    ? formatPrice(goldPriceData.originalSellPrice)
                    : formatPrice(goldPriceData.sellPrice)}
                </div>
              </div>
            </div>

            {/* Toggle & Source */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOriginalPrice(!showOriginalPrice)}
                className="text-soft-white/40 hover:text-gold text-xs h-auto p-1"
              >
                <Info className="h-3 w-3 mr-1" />
                {showOriginalPrice ? "Show G-TOKEN" : "Show Spot Price"}
              </Button>
              {showDetails && (
                <div className="text-xs text-soft-white/30">
                  {GoldPriceService.getDataSourceInfo(goldPriceData).name}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
