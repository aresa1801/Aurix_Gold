"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Shield, Coins, TrendingUp } from "lucide-react"
import { GoldPriceService } from "@/services/gold-price"
import { useLanguage } from "@/contexts/language-context"

interface PriceComparison {
  source: string
  icon: any
  originalBuyPrice: number
  gTokenBuyPrice: number
  spread: number
  isAvailable: boolean
}

export function GoldPriceComparison() {
  const [comparisons, setComparisons] = useState<PriceComparison[]>([])
  const { t } = useLanguage()

  useEffect(() => {
    const marketPrices = GoldPriceService.getCurrentMarketPrices()

    setComparisons([
      {
        source: "ANTAM",
        icon: Shield,
        originalBuyPrice: marketPrices.antam,
        gTokenBuyPrice: marketPrices.gTokenAntam,
        spread: 4000,
        isAvailable: true,
      },
      {
        source: "UBS",
        icon: Building2,
        originalBuyPrice: marketPrices.ubs,
        gTokenBuyPrice: marketPrices.gTokenUbs,
        spread: 3500,
        isAvailable: true,
      },
      {
        source: "Pegadaian",
        icon: Building2,
        originalBuyPrice: marketPrices.pegadaian,
        gTokenBuyPrice: marketPrices.gTokenPegadaian,
        spread: 5000,
        isAvailable: true,
      },
    ])
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {comparisons.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.source}
            className="bg-navy-800/30 border-soft-white/5 backdrop-blur-md rounded-2xl hover:border-gold/20 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="font-semibold text-soft-white text-sm">{item.source}</div>
                  <div className="text-xs text-soft-white/40">Physical Gold</div>
                </div>
                <Badge className="ml-auto bg-prosperity/10 text-prosperity border-prosperity/20 text-xs">
                  Active
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-soft-white/40">Gold Price</span>
                  <span className="text-sm font-medium text-soft-white/70">{formatPrice(item.originalBuyPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-soft-white/40">G-TOKEN Price</span>
                  <span className="text-sm font-bold text-gold">{formatPrice(item.gTokenBuyPrice)}</span>
                </div>
                <div className="h-px bg-soft-white/5"></div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-soft-white/40">Premium</span>
                  <span className="text-xs text-prosperity flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +85%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
