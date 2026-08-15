"use client"

export interface GoldPriceData {
  buyPrice: number
  sellPrice: number
  currency: string
  lastUpdated: string
  change24h?: number
  changePercent24h?: number
  source?: string
  originalBuyPrice?: number
  originalSellPrice?: number
  spotPriceUSD?: number
}

export class GoldPriceService {
  // Primary: GoldAPI.io (free tier: 100 requests/day)
  private static readonly GOLDAPI_ENDPOINT = "https://www.goldapi.io/api/XAU/USD"

  // Secondary: Metals.dev (free tier: 100 requests/month)
  private static readonly METALS_DEV_ENDPOINT = "https://api.metals.dev/v1/latest"

  // Fallback: ExchangeRate API for USD→IDR conversion
  private static readonly EXCHANGE_RATE_API = "https://api.exchangerate-api.com/v4/latest/USD"

  private static readonly CACHE_DURATION = 300000 // 5 minutes
  private static readonly TROY_OUNCE_TO_GRAM = 31.1035

  // G-TOKEN pricing multipliers
  private static readonly BUY_PRICE_MULTIPLIER = 1.85
  private static readonly SELL_PRICE_MULTIPLIER = 1.7

  // Fallback reference prices (updated regularly)
  private static readonly FALLBACK_GOLD_PRICE_PER_GRAM_IDR = 1087000
  private static readonly FALLBACK_USD_TO_IDR = 16250

  private static cache: {
    data: GoldPriceData | null
    timestamp: number
  } = {
    data: null,
    timestamp: 0,
  }

  private static exchangeRateCache: {
    rate: number
    timestamp: number
  } = {
    rate: 0,
    timestamp: 0,
  }

  /**
   * Primary source: GoldAPI.io
   */
  private static async fetchFromGoldAPI(): Promise<GoldPriceData | null> {
    const apiKey = typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_GOLD_API_KEY || "")
      : ""

    if (!apiKey) {
      console.warn("⚠️ NEXT_PUBLIC_GOLD_API_KEY not configured")
      return null
    }

    try {
      console.log("🌐 Fetching from GoldAPI.io...")
      const response = await this.fetchWithTimeout(
        this.GOLDAPI_ENDPOINT,
        8000,
        { "x-access-token": apiKey }
      )

      if (!response?.ok) throw new Error(`GoldAPI responded with ${response?.status}`)

      const data = await response.json()
      const spotPricePerOunce = data.price // USD per troy ounce
      const change24h = data.ch || 0
      const changePercent24h = data.chp || 0

      if (!spotPricePerOunce || spotPricePerOunce <= 0) {
        throw new Error("Invalid spot price from GoldAPI")
      }

      const exchangeRate = await this.getUSDToIDRRate()
      const pricePerGramIDR = (spotPricePerOunce / this.TROY_OUNCE_TO_GRAM) * exchangeRate

      return {
        buyPrice: Math.round(pricePerGramIDR),
        sellPrice: Math.round(pricePerGramIDR * 0.97),
        currency: "IDR",
        lastUpdated: new Date().toISOString(),
        change24h: Math.round((change24h / this.TROY_OUNCE_TO_GRAM) * exchangeRate),
        changePercent24h: changePercent24h,
        source: "GoldAPI.io (Real-time)",
        spotPriceUSD: spotPricePerOunce,
      }
    } catch (error: any) {
      console.warn("⚠️ GoldAPI fetch failed:", error.message)
      return null
    }
  }

  /**
   * Secondary source: Metals.dev
   */
  private static async fetchFromMetalsDev(): Promise<GoldPriceData | null> {
    const apiKey = typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_METALS_DEV_API_KEY || "")
      : ""

    if (!apiKey) {
      console.warn("⚠️ NEXT_PUBLIC_METALS_DEV_API_KEY not configured")
      return null
    }

    try {
      console.log("🌐 Fetching from Metals.dev...")
      const url = `${this.METALS_DEV_ENDPOINT}?api_key=${apiKey}&currency=USD&unit=gram`
      const response = await this.fetchWithTimeout(url, 8000)

      if (!response?.ok) throw new Error(`Metals.dev responded with ${response?.status}`)

      const data = await response.json()
      const pricePerGramUSD = data.metals?.gold

      if (!pricePerGramUSD || pricePerGramUSD <= 0) {
        throw new Error("Invalid price from Metals.dev")
      }

      const exchangeRate = await this.getUSDToIDRRate()
      const pricePerGramIDR = pricePerGramUSD * exchangeRate

      return {
        buyPrice: Math.round(pricePerGramIDR),
        sellPrice: Math.round(pricePerGramIDR * 0.97),
        currency: "IDR",
        lastUpdated: data.timestamp || new Date().toISOString(),
        change24h: 0,
        changePercent24h: 0,
        source: "Metals.dev (Real-time)",
        spotPriceUSD: pricePerGramUSD * this.TROY_OUNCE_TO_GRAM,
      }
    } catch (error: any) {
      console.warn("⚠️ Metals.dev fetch failed:", error.message)
      return null
    }
  }

  /**
   * Get USD to IDR exchange rate with caching
   */
  private static async getUSDToIDRRate(): Promise<number> {
    const now = Date.now()
    // Cache exchange rate for 1 hour
    if (this.exchangeRateCache.rate > 0 && now - this.exchangeRateCache.timestamp < 3600000) {
      return this.exchangeRateCache.rate
    }

    try {
      const response = await this.fetchWithTimeout(this.EXCHANGE_RATE_API, 5000)
      if (response?.ok) {
        const data = await response.json()
        const rate = data.rates?.IDR
        if (rate && rate > 0) {
          this.exchangeRateCache = { rate, timestamp: now }
          return rate
        }
      }
    } catch (error) {
      console.warn("⚠️ Exchange rate fetch failed, using fallback")
    }

    return this.FALLBACK_USD_TO_IDR
  }

  /**
   * Main entry point: fetch gold price with fallback chain
   */
  static async fetchGoldPrice(): Promise<GoldPriceData> {
    const now = Date.now()

    // Return cached data if fresh
    if (this.cache.data && now - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.data
    }

    try {
      // Priority 1: GoldAPI.io
      const goldApiData = await this.fetchFromGoldAPI()
      if (goldApiData && this.validateOriginalPrice(goldApiData)) {
        const adjusted = this.applyGTokenPricing(goldApiData)
        this.cache = { data: adjusted, timestamp: now }
        console.log("✅ Using GoldAPI.io real-time price")
        return adjusted
      }

      // Priority 2: Metals.dev
      const metalsDevData = await this.fetchFromMetalsDev()
      if (metalsDevData && this.validateOriginalPrice(metalsDevData)) {
        const adjusted = this.applyGTokenPricing(metalsDevData)
        this.cache = { data: adjusted, timestamp: now }
        console.log("✅ Using Metals.dev real-time price")
        return adjusted
      }

      throw new Error("All API sources failed")
    } catch (error: any) {
      console.warn("⚠️ Using fallback reference price:", error.message)

      const fallbackData: GoldPriceData = {
        buyPrice: this.FALLBACK_GOLD_PRICE_PER_GRAM_IDR,
        sellPrice: this.FALLBACK_GOLD_PRICE_PER_GRAM_IDR - 5000,
        currency: "IDR",
        lastUpdated: new Date().toISOString(),
        change24h: 0,
        changePercent24h: 0,
        source: "Fallback (Cached Reference)",
      }

      const adjusted = this.applyGTokenPricing(fallbackData)
      // Cache fallback for only 30 seconds to retry sooner
      this.cache = { data: adjusted, timestamp: now - this.CACHE_DURATION + 30000 }
      return adjusted
    }
  }

  /**
   * Apply G-TOKEN pricing multipliers
   */
  private static applyGTokenPricing(original: GoldPriceData): GoldPriceData {
    return {
      ...original,
      buyPrice: Math.round(original.buyPrice * this.BUY_PRICE_MULTIPLIER),
      sellPrice: Math.round(original.sellPrice * this.SELL_PRICE_MULTIPLIER),
      originalBuyPrice: original.buyPrice,
      originalSellPrice: original.sellPrice,
      source: `${original.source} (G-TOKEN +85%/+70%)`,
    }
  }

  /**
   * Validate original gold price is in reasonable range
   */
  private static validateOriginalPrice(data: GoldPriceData): boolean {
    // Gold price per gram in IDR should be between 800K and 2M (wide range for safety)
    if (data.buyPrice < 800000 || data.buyPrice > 2000000) {
      console.warn("⚠️ Price out of reasonable range:", data.buyPrice)
      return false
    }
    return true
  }

  /**
   * Validate G-TOKEN price data
   */
  static validatePriceData(data: GoldPriceData): boolean {
    if (data.buyPrice < 1500000 || data.buyPrice > 4000000) {
      return false
    }
    if (data.buyPrice <= data.sellPrice) {
      return false
    }
    return true
  }

  private static async fetchWithTimeout(
    url: string,
    timeoutMs: number,
    headers?: Record<string, string>
  ): Promise<Response | null> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        cache: "no-cache",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      return null
    }
  }

  // Utility methods

  static getCachedPrice(): GoldPriceData | null {
    const now = Date.now()
    if (this.cache.data && now - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.data
    }
    return null
  }

  static clearCache(): void {
    this.cache = { data: null, timestamp: 0 }
  }

  static async forceRefresh(): Promise<GoldPriceData> {
    this.clearCache()
    return this.fetchGoldPrice()
  }

  static getMarketStatus(): { isOpen: boolean; nextOpen?: string } {
    const now = new Date()
    const jakartaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }))
    const hour = jakartaTime.getHours()
    const day = jakartaTime.getDay()

    const isWeekday = day >= 1 && day <= 5
    const isBusinessHours = hour >= 9 && hour < 16

    return {
      isOpen: isWeekday && isBusinessHours,
      nextOpen: !isWeekday ? "Senin 09:00 WIB" : !isBusinessHours && hour < 9 ? "09:00 WIB" : "Senin 09:00 WIB",
    }
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  static formatChangePercent(changePercent: number): string {
    const sign = changePercent >= 0 ? "+" : ""
    return `${sign}${changePercent.toFixed(2)}%`
  }

  static getPriceTrend(changePercent: number): "up" | "down" | "neutral" {
    if (changePercent > 0.1) return "up"
    if (changePercent < -0.1) return "down"
    return "neutral"
  }

  static getPriceConfidence(data: GoldPriceData): "high" | "medium" | "low" {
    const now = Date.now()
    const dataAge = now - new Date(data.lastUpdated).getTime()

    if (dataAge < 300000 && data.source?.includes("GoldAPI")) return "high"
    if (dataAge < 300000 && data.source?.includes("Metals.dev")) return "high"
    if (dataAge < 600000 && data.source && !data.source.includes("Fallback")) return "medium"

    return "low"
  }

  static getDataSourceInfo(data: GoldPriceData): {
    name: string
    description: string
    reliability: "high" | "medium" | "low"
  } {
    const source = data.source || "Unknown"

    if (source.includes("GoldAPI")) {
      return {
        name: "GoldAPI.io",
        description: "Real-time gold spot price from GoldAPI.io with live USD/IDR exchange rate",
        reliability: "high",
      }
    }

    if (source.includes("Metals.dev")) {
      return {
        name: "Metals.dev",
        description: "Real-time precious metals pricing from Metals.dev",
        reliability: "high",
      }
    }

    return {
      name: "Cached Reference",
      description: "Using cached reference price. Live data will update shortly.",
      reliability: "low",
    }
  }

  static getPricingMultipliers() {
    return {
      buyMultiplier: this.BUY_PRICE_MULTIPLIER,
      sellMultiplier: this.SELL_PRICE_MULTIPLIER,
      buyPercentage: `+${((this.BUY_PRICE_MULTIPLIER - 1) * 100).toFixed(0)}%`,
      sellPercentage: `+${((this.SELL_PRICE_MULTIPLIER - 1) * 100).toFixed(0)}%`,
    }
  }

  static getCurrentMarketPrices() {
    const basePrice = this.FALLBACK_GOLD_PRICE_PER_GRAM_IDR
    return {
      antam: basePrice,
      ubs: basePrice - 2000,
      pegadaian: basePrice - 4000,
      average: basePrice - 2000,
      gTokenAntam: Math.round(basePrice * this.BUY_PRICE_MULTIPLIER),
      gTokenUbs: Math.round((basePrice - 2000) * this.BUY_PRICE_MULTIPLIER),
      gTokenPegadaian: Math.round((basePrice - 4000) * this.BUY_PRICE_MULTIPLIER),
      gTokenAverage: Math.round((basePrice - 2000) * this.BUY_PRICE_MULTIPLIER),
    }
  }
}
