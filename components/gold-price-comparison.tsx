"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Building2, Shield, TrendingUp, ExternalLink, Coins } from "lucide-react"
import { GoldPriceService } from "@/services/gold-price"
import { useLanguage } from "@/contexts/language-context"

interface PriceComparison {
  source: string
  originalBuyPrice: number
  originalSellPrice: number
  gTokenBuyPrice: number
  gTokenSellPrice: number
  spread: number
  lastUpdated: string
  isAvailable: boolean
}

export function GoldPriceComparison() {
  const [comparisons, setComparisons] = useState<PriceComparison[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const { t } = useLanguage()

  const loadPriceComparisons = async () => {
    setIsLoading(true)
    try {
      // Dapatkan harga referensi pasar
      const marketPrices = GoldPriceService.getCurrentMarketPrices()
      const multipliers = GoldPriceService.getPricingMultipliers()

      // Data perbandingan dengan harga original dan G-TOKEN
      const mockComparisons: PriceComparison[] = [
        {
          source: "ANTAM",
          originalBuyPrice: marketPrices.antam,
          originalSellPrice: marketPrices.antam - 4000,
          gTokenBuyPrice: marketPrices.gTokenAntam,
          gTokenSellPrice: Math.round((marketPrices.antam - 4000) * multipliers.sellMultiplier),
          spread: 4000,
          lastUpdated: new Date().toISOString(),
          isAvailable: true,
        },
        {
          source: "UBS",
          originalBuyPrice: marketPrices.ubs,
          originalSellPrice: marketPrices.ubs - 3500,
          gTokenBuyPrice: marketPrices.gTokenUbs,
          gTokenSellPrice: Math.round((marketPrices.ubs - 3500) * multipliers.sellMultiplier),
          spread: 3500,
          lastUpdated: new Date().toISOString(),
          isAvailable: true,
        },
        {
          source: "Pegadaian",
          originalBuyPrice: marketPrices.pegadaian,
          originalSellPrice: marketPrices.pegadaian - 5000,
          gTokenBuyPrice: marketPrices.gTokenPegadaian,
          gTokenSellPrice: Math.round((marketPrices.pegadaian - 5000) * multipliers.sellMultiplier),
          spread: 5000,
          lastUpdated: new Date().toISOString(),
          isAvailable: true,
        },
        {
          source: "Logam Mulia",
          originalBuyPrice: marketPrices.antam - 2000,
          originalSellPrice: marketPrices.antam - 5000,
          gTokenBuyPrice: Math.round((marketPrices.antam - 2000) * multipliers.buyMultiplier),
          gTokenSellPrice: Math.round((marketPrices.antam - 5000) * multipliers.sellMultiplier),
          spread: 3000,
          lastUpdated: new Date().toISOString(),
          isAvailable: true,
        },
        {
          source: "Harga-Emas.org",
          originalBuyPrice: marketPrices.average,
          originalSellPrice: marketPrices.average - 4500,
          gTokenBuyPrice: marketPrices.gTokenAverage,
          gTokenSellPrice: Math.round((marketPrices.average - 4500) * multipliers.sellMultiplier),
          spread: 4500,
          lastUpdated: new Date().toISOString(),
          isAvailable: true,
        },
      ]

      setComparisons(mockComparisons)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to load price comparisons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPriceComparisons()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getSourceIcon = (source: string) => {
    if (source.includes("ANTAM")) return <Building2 className="h-4 w-4" />
    if (source.includes("Logam Mulia")) return <Shield className="h-4 w-4" />
    return <TrendingUp className="h-4 w-4" />
  }

  const getSourceColor = (source: string) => {
    if (source.includes("ANTAM")) return "text-gold"
    if (source.includes("Logam Mulia")) return "text-prosperity"
    if (source.includes("UBS")) return "text-blue-400"
    if (source.includes("Pegadaian")) return "text-orange-400"
    return "text-soft-white"
  }

  const multipliers = GoldPriceService.getPricingMultipliers()

  return (
    <div className="space-y-6">
      {/* G-TOKEN Pricing Info */}
      <Card className="bg-gradient-to-r from-gold/10 to-prosperity/10 border-gold/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Coins className="h-5 w-5 mr-2" />
            {t("comparison.gTokenPricingModel")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-navy-900/50 rounded-lg p-4 border border-gold/20">
              <div className="text-sm text-soft-white/70 mb-1">{t("comparison.gTokenBuyPrice")}</div>
              <div className="text-lg font-bold text-gold">Harga Emas {multipliers.buyPercentage}</div>
              <div className="text-xs text-soft-white/50">Multiplier: {multipliers.buyMultiplier}x</div>
            </div>
            <div className="bg-navy-900/50 rounded-lg p-4 border border-prosperity/20">
              <div className="text-sm text-soft-white/70 mb-1">{t("comparison.gTokenSellPrice")}</div>
              <div className="text-lg font-bold text-prosperity">Harga Emas {multipliers.sellPercentage}</div>
              <div className="text-xs text-soft-white/50">Multiplier: {multipliers.sellMultiplier}x</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-soft-white/70 text-center">💡 {t("comparison.gTokenPremiumValue")}</div>
        </CardContent>
      </Card>

      {/* Price Comparison Table */}
      <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              {t("comparison.priceComparisonTitle")}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadPriceComparisons}
              disabled={isLoading}
              className="text-soft-white/70 hover:text-gold"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <div className="text-sm text-soft-white/70">{t("comparison.priceComparisonDesc")}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <RefreshCw className="h-8 w-8 animate-spin text-gold mx-auto mb-2" />
              <p className="text-soft-white/70">{t("comparison.loadingPrices")}</p>
            </div>
          ) : (
            <>
              {/* Header tabel */}
              <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-soft-white/70 border-b border-gold/20 pb-2">
                <div>{t("comparison.source")}</div>
                <div className="text-center">{t("comparison.physicalGoldPrice")}</div>
                <div className="text-center">{t("comparison.gTokenPrice")}</div>
                <div className="text-center">{t("comparison.premium")}</div>
                <div className="text-center">{t("comparison.status")}</div>
              </div>

              {/* Data perbandingan */}
              <div className="space-y-2">
                {comparisons.map((comparison, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 items-center p-3 rounded-lg bg-navy-900/30 border border-gold/10"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={getSourceColor(comparison.source)}>{getSourceIcon(comparison.source)}</div>
                      <div>
                        <div className={`font-medium ${getSourceColor(comparison.source)}`}>{comparison.source}</div>
                        {comparison.source === "Harga-Emas.org" && (
                          <a
                            href="https://harga-emas.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-soft-white/50 hover:text-gold flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {t("comparison.viewWebsite")}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-semibold text-soft-white text-sm">
                        {formatPrice(comparison.originalBuyPrice)}
                      </div>
                      <div className="text-xs text-soft-white/50">
                        {t("comparison.buyPrice")}: {formatPrice(comparison.originalSellPrice)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-semibold text-gold text-sm">{formatPrice(comparison.gTokenBuyPrice)}</div>
                      <div className="text-xs text-prosperity">
                        {t("comparison.sellPrice")}: {formatPrice(comparison.gTokenSellPrice)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-semibold text-gold">{multipliers.buyPercentage}</div>
                      <div className="text-xs text-prosperity">{multipliers.sellPercentage}</div>
                    </div>

                    <div className="text-center">
                      <Badge className="bg-prosperity/20 text-prosperity border-prosperity/30 text-xs">
                        {t("comparison.available")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ringkasan */}
              <div className="bg-navy-900/50 rounded-lg p-4 border border-prosperity/20">
                <div className="text-sm font-semibold text-prosperity mb-3">💡 {t("comparison.gTokenAdvantages")}</div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="text-soft-white/70">🔄 {t("comparison.trading24_7")}</div>
                    <div className="text-xs text-soft-white/50">{t("comparison.trading24_7Desc")}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-soft-white/70">🏦 {t("comparison.noStorageNeeded")}</div>
                    <div className="text-xs text-soft-white/50">{t("comparison.noStorageNeededDesc")}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-soft-white/70">⚡ {t("comparison.instantLiquidity")}</div>
                    <div className="text-xs text-soft-white/50">{t("comparison.instantLiquidityDesc")}</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gold/10 rounded-lg border border-gold/20">
                  <div className="text-sm text-gold font-semibold mb-1">
                    🎯 {t("comparison.premiumPricingExplanation")}
                  </div>
                  <div className="text-xs text-soft-white/70">{t("comparison.premiumPricingText")}</div>
                </div>
              </div>

              {lastUpdate && (
                <div className="text-center text-xs text-soft-white/50">
                  {t("comparison.lastUpdated")}: {lastUpdate.toLocaleTimeString("id-ID")}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
