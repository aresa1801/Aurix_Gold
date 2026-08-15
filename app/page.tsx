"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Gift, RefreshCw, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { GoldPriceWidget } from "@/components/gold-price-widget"
import { GoldPriceComparison } from "@/components/gold-price-comparison"
import { useGoldPrice } from "@/hooks/use-gold-price"

export default function HomePage() {
  const { t } = useLanguage()
  const [totalGoldKg] = useState(2847.5)

  const { data: goldPriceData } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000,
  })

  const goldPriceIDR = useMemo(() => goldPriceData?.buyPrice || 2010950, [goldPriceData?.buyPrice])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID").format(amount)
  }

  const totalValueIDR = useMemo(() => totalGoldKg * 1000 * goldPriceIDR, [totalGoldKg, goldPriceIDR])

  return (
    <div className="min-h-screen bg-transparent">
      <section className="relative py-12 md:py-16 lg:py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 md:mb-8 flex justify-center">
            <div className="relative">
              <div className="h-14 md:h-16 w-14 md:w-16 rounded-full bg-gradient-to-r from-gold to-gold-600 flex items-center justify-center animate-coin-flip">
                <Coins className="h-7 md:h-8 w-7 md:w-8 text-navy-900" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gold/20 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-soft-white mb-4 md:mb-6 break-words">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-600">
              {t("home.title")}
            </span>
          </h1>

          <p className="text-sm md:text-base lg:text-lg text-soft-white/70 mb-6 md:mb-8 max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>

          <div className="mb-6 md:mb-8 max-w-md mx-auto">
            <GoldPriceWidget compact={false} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/swap">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-600 text-navy-900 font-semibold px-6 md:px-8 w-full sm:w-auto text-sm md:text-base transition-all duration-200"
              >
                {t("home.buyGoldToken")}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10 px-6 md:px-8 w-full sm:w-auto text-sm md:text-base bg-transparent transition-all duration-200"
            >
              {t("home.connectWallet")}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 px-4 bg-navy-900/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-soft-white mb-3">
              {t("home.comparisonTitle")}
            </h2>
            <p className="text-sm md:text-base text-soft-white/70">{t("home.comparisonSubtitle")}</p>
          </div>
          <GoldPriceComparison />
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm hover:border-gold/40 hover:bg-navy-800/70 transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <CardTitle className="text-gold text-base md:text-lg">{t("home.physicalGoldBacked")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-soft-white/70 text-sm text-center">
                  {t("home.physicalGoldBackedDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm hover:border-prosperity/40 hover:bg-navy-800/70 transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-prosperity/20 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-prosperity" />
                </div>
                <CardTitle className="text-gold text-base md:text-lg">{t("home.stakingRewards")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-soft-white/70 text-sm text-center">
                  {t("home.stakingRewardsDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm hover:border-gold/40 hover:bg-navy-800/70 transition-all duration-300 cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-gold" />
                </div>
                <CardTitle className="text-gold text-base md:text-lg">{t("home.redeemAnytime")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-soft-white/70 text-sm text-center">
                  {t("home.redeemAnytimeDesc")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 px-4 bg-navy-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-soft-white mb-3">
              {t("home.liveVaultStats")}
            </h2>
            <p className="text-sm md:text-base text-soft-white/70">{t("home.liveVaultStatsDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm hover:border-gold/40 hover:bg-navy-800/70 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardDescription className="text-soft-white/70 text-xs md:text-sm">
                  {t("home.totalGoldInVault")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-xl font-bold text-gold">{totalGoldKg.toLocaleString()} kg</div>
                <div className="text-xs text-prosperity flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3% this month
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm hover:border-gold/40 hover:bg-navy-800/70 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardDescription className="text-soft-white/70 text-xs md:text-sm">
                  {t("home.totalGTokens")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-xl font-bold text-gold">{formatCurrency(totalGoldKg * 1000)}</div>
                <div className="text-xs text-soft-white/50">1 G-TOKEN = 1g Gold</div>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm hover:border-prosperity/40 hover:bg-navy-800/70 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardDescription className="text-soft-white/70 text-xs md:text-sm">
                  {t("home.totalValue")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-xl font-bold text-prosperity">
                  Rp {formatCurrency(Math.round(totalValueIDR / 1000000000))}B
                </div>
                <div className="text-xs text-soft-white/50">{t("home.currentMarketValue")}</div>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm hover:border-gold/40 hover:bg-navy-800/70 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardDescription className="text-soft-white/70 text-xs md:text-sm">
                  {t("home.latestAudit")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-xl font-bold text-gold">Dec 15, 2024</div>
                <Badge
                  variant="secondary"
                  className="bg-prosperity/20 text-prosperity border-prosperity/30 mt-2 text-xs"
                >
                  {t("home.verified")}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-navy-800/50 border-prosperity/20 backdrop-blur-sm hover:bg-navy-800/70 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-prosperity text-center text-base md:text-lg lg:text-xl">
                {t("home.gTokenFeatures")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-gold font-semibold text-sm md:text-base">{t("home.physicalGoldPrice")}</h4>
                  <div className="text-xs md:text-sm text-soft-white/70 space-y-2">
                    <div>• ANTAM: Rp 1.087.000/gram</div>
                    <div>• UBS: Rp 1.085.000/gram</div>
                    <div>• Pegadaian: Rp 1.083.000/gram</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-gold font-semibold text-sm md:text-base">{t("home.gTokenFeatures")}</h4>
                  <div className="text-xs md:text-sm text-soft-white/70 space-y-2">
                    <div>
                      • {t("home.percentageFromGold")} (beli) / {t("home.percentageFromGold70")} (jual)
                    </div>
                    <div>• Trading 24/7 tanpa batas waktu</div>
                    <div>• Tidak perlu penyimpanan fisik</div>
                    <div>• Instant liquidity & settlement</div>
                  </div>
                </div>
              </div>

              <div className="bg-navy-900/50 rounded-lg p-4 border border-gold/20">
                <div className="text-xs md:text-sm text-soft-white/70 text-center">
                  <strong className="text-gold">{t("home.gTokenFeatures")}:</strong> {t("home.premiumPricingRationale")}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gold/10 rounded-lg p-4 border border-gold/20 text-center">
                  <div className="text-gold font-semibold text-sm md:text-base">Rp 2.010.950</div>
                  <div className="text-xs text-soft-white/70 mt-1">{t("home.buyPrice")}</div>
                  <div className="text-xs text-prosperity">+85% from gold</div>
                </div>
                <div className="bg-prosperity/10 rounded-lg p-4 border border-prosperity/20 text-center">
                  <div className="text-prosperity font-semibold text-sm md:text-base">Rp 1.841.100</div>
                  <div className="text-xs text-soft-white/70 mt-1">{t("home.sellPrice")}</div>
                  <div className="text-xs text-gold">+70% from gold</div>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-4 border border-soft-white/20 text-center">
                  <div className="text-soft-white font-semibold text-sm md:text-base">24/7</div>
                  <div className="text-xs text-soft-white/70 mt-1">{t("home.tradingHours")}</div>
                  <div className="text-xs text-gold">{t("home.alwaysAvailable")}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
