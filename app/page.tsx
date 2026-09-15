"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Gift, RefreshCw, TrendingUp, ArrowRight, Zap, Lock } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { GoldPriceWidget } from "@/components/gold-price-widget"
import { GoldPriceComparison } from "@/components/gold-price-comparison"
import { useGoldPrice } from "@/hooks/use-gold-price"

function AnimatedCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return <span>{prefix}{new Intl.NumberFormat("id-ID").format(count)}{suffix}</span>
}

export default function HomePage() {
  const { t } = useLanguage()
  const [totalGoldKg] = useState(2847.5)

  const { data: goldPriceData } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000,
  })

  const goldPriceIDR = useMemo(() => goldPriceData?.buyPrice || 2010950, [goldPriceData?.buyPrice])
  const totalValueIDR = useMemo(() => totalGoldKg * 1000 * goldPriceIDR, [totalGoldKg, goldPriceIDR])

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 text-center overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-gold via-gold-600 to-amber-700 flex items-center justify-center shadow-lg shadow-gold/20">
                <Coins className="h-8 w-8 md:h-10 md:w-10 text-navy-900" />
              </div>
              <div className="absolute -inset-2 rounded-full bg-gold/10 animate-ping opacity-75"></div>
            </div>
          </div>

          <Badge className="mb-6 bg-gold/10 text-gold border-gold/30 px-4 py-1.5 text-sm">
            🔒 Backed by Physical Gold Reserves
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-soft-white mb-6 leading-tight tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber-400 to-gold-600">
              {t("home.title")}
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-soft-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>

          {/* Price Widget - Prominent */}
          <div className="mb-10 max-w-lg mx-auto">
            <GoldPriceWidget compact={false} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/swap">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-amber-600 hover:from-gold-600 hover:to-amber-700 text-navy-900 font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all duration-300 w-full sm:w-auto"
              >
                {t("home.buyGoldToken")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-soft-white/20 text-soft-white hover:bg-soft-white/5 hover:border-gold/50 px-8 py-6 text-base rounded-xl bg-transparent transition-all duration-300 w-full sm:w-auto"
            >
              {t("home.connectWallet")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md hover:border-gold/30 hover:bg-navy-800/50 transition-all duration-500 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-gold" />
                </div>
                <CardTitle className="text-soft-white text-lg">{t("home.physicalGoldBacked")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-soft-white/50 text-sm text-center leading-relaxed">
                  {t("home.physicalGoldBackedDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md hover:border-prosperity/30 hover:bg-navy-800/50 transition-all duration-500 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-prosperity/20 to-prosperity/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Gift className="h-7 w-7 text-prosperity" />
                </div>
                <CardTitle className="text-soft-white text-lg">{t("home.stakingRewards")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-soft-white/50 text-sm text-center leading-relaxed">
                  {t("home.stakingRewardsDesc")}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md hover:border-gold/30 hover:bg-navy-800/50 transition-all duration-500 group rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <RefreshCw className="h-7 w-7 text-gold" />
                </div>
                <CardTitle className="text-soft-white text-lg">{t("home.redeemAnytime")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-soft-white/50 text-sm text-center leading-relaxed">
                  {t("home.redeemAnytimeDesc")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Price Comparison Section */}
      <section className="py-16 md:py-20 px-4 bg-navy-900/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-soft-white mb-4">
              {t("home.comparisonTitle")}
            </h2>
            <p className="text-soft-white/50 max-w-xl mx-auto">{t("home.comparisonSubtitle")}</p>
          </div>
          <GoldPriceComparison />
        </div>
      </section>

      {/* Live Vault Stats */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-soft-white mb-4">
              {t("home.liveVaultStats")}
            </h2>
            <p className="text-soft-white/50">{t("home.liveVaultStatsDesc")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-2xl hover:border-gold/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-soft-white/50 text-sm mb-2">{t("home.totalGoldInVault")}</div>
                <div className="text-2xl font-bold text-gold mb-1">
                  <AnimatedCounter target={totalGoldKg} suffix=" kg" />
                </div>
                <div className="text-xs text-prosperity flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3% this month
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-2xl hover:border-gold/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-soft-white/50 text-sm mb-2">{t("home.totalGTokens")}</div>
                <div className="text-2xl font-bold text-gold mb-1">
                  <AnimatedCounter target={totalGoldKg * 1000} />
                </div>
                <div className="text-xs text-soft-white/40">1 G-TOKEN = 1g Gold</div>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-2xl hover:border-prosperity/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-soft-white/50 text-sm mb-2">{t("home.totalValue")}</div>
                <div className="text-2xl font-bold text-prosperity mb-1">
                  Rp <AnimatedCounter target={Math.round(totalValueIDR / 1000000000)} suffix="B" />
                </div>
                <div className="text-xs text-soft-white/40">{t("home.currentMarketValue")}</div>
              </CardContent>
            </Card>

            <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-2xl hover:border-gold/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-soft-white/50 text-sm mb-2">{t("home.latestAudit")}</div>
                <div className="text-2xl font-bold text-gold mb-1">Dec 15, 2024</div>
                <Badge className="bg-prosperity/10 text-prosperity border-prosperity/20 text-xs">
                  ✓ {t("home.verified")}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why G-TOKEN Section */}
      <section className="py-16 md:py-20 px-4 bg-navy-900/40">
        <div className="container mx-auto max-w-5xl">
          <Card className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl md:text-2xl text-soft-white">
                {t("home.gTokenFeatures")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-xl p-5 border border-gold/10 text-center">
                  <Zap className="h-6 w-6 text-gold mx-auto mb-3" />
                  <div className="text-gold font-bold text-lg">24/7</div>
                  <div className="text-xs text-soft-white/50 mt-1">{t("home.tradingHours")}</div>
                </div>
                <div className="bg-gradient-to-br from-prosperity/10 to-transparent rounded-xl p-5 border border-prosperity/10 text-center">
                  <Lock className="h-6 w-6 text-prosperity mx-auto mb-3" />
                  <div className="text-prosperity font-bold text-lg">100%</div>
                  <div className="text-xs text-soft-white/50 mt-1">Physical Gold Backed</div>
                </div>
                <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-xl p-5 border border-gold/10 text-center">
                  <TrendingUp className="h-6 w-6 text-gold mx-auto mb-3" />
                  <div className="text-gold font-bold text-lg">Instant</div>
                  <div className="text-xs text-soft-white/50 mt-1">Liquidity & Settlement</div>
                </div>
              </div>

              <div className="bg-navy-900/50 rounded-xl p-5 border border-soft-white/5">
                <div className="text-sm text-soft-white/60 text-center leading-relaxed">
                  <strong className="text-gold">{t("home.gTokenFeatures")}:</strong>{" "}
                  {t("home.premiumPricingRationale")}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 border border-gold/15 bg-gold/5 text-center">
                  <div className="text-gold font-bold text-lg">
                    {goldPriceData ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(goldPriceData.buyPrice) : "Rp 2.010.950"}
                  </div>
                  <div className="text-xs text-soft-white/50 mt-1">{t("home.buyPrice")}</div>
                  <div className="text-xs text-prosperity mt-1">+85% from gold</div>
                </div>
                <div className="rounded-xl p-5 border border-prosperity/15 bg-prosperity/5 text-center">
                  <div className="text-prosperity font-bold text-lg">
                    {goldPriceData ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(goldPriceData.sellPrice) : "Rp 1.841.100"}
                  </div>
                  <div className="text-xs text-soft-white/50 mt-1">{t("home.sellPrice")}</div>
                  <div className="text-xs text-gold mt-1">+70% from gold</div>
                </div>
                <div className="rounded-xl p-5 border border-soft-white/10 bg-soft-white/5 text-center">
                  <div className="text-soft-white font-bold text-lg">0%</div>
                  <div className="text-xs text-soft-white/50 mt-1">Storage Fees</div>
                  <div className="text-xs text-gold mt-1">{t("home.alwaysAvailable")}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
