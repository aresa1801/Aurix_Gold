"use client"

import { useState, useEffect, useCallback } from "react"
import { GoldPriceService, type GoldPriceData } from "@/services/gold-price"

interface UseGoldPriceOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  onError?: (error: Error) => void
  onSuccess?: (data: GoldPriceData) => void
}

export function useGoldPrice(options: UseGoldPriceOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    onError,
    onSuccess,
  } = options

  const [data, setData] = useState<GoldPriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const fetchPrice = useCallback(async () => {
    try {
      setError(null)
      const priceData = await GoldPriceService.fetchGoldPrice()

      // Validate the price data
      if (!GoldPriceService.validatePriceData(priceData)) {
        throw new Error("Invalid price data received")
      }

      setData(priceData)
      setLastFetch(new Date())
      onSuccess?.(priceData)

      console.log("📈 Gold price updated:", {
        price: priceData.buyPrice,
        confidence: GoldPriceService.getPriceConfidence(priceData),
        change: priceData.changePercent24h,
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch gold price")
      setError(error)
      onError?.(error)

      // If we have cached data, keep using it
      const cachedData = GoldPriceService.getCachedPrice()
      if (cachedData && !data) {
        setData(cachedData)
        setLastFetch(new Date(cachedData.lastUpdated))
      }
    } finally {
      setIsLoading(false)
    }
  }, [onError, onSuccess, data])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const priceData = await GoldPriceService.forceRefresh()
      setData(priceData)
      setLastFetch(new Date())
      setError(null)
      onSuccess?.(priceData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to refresh gold price")
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [onError, onSuccess])

  // Initial fetch
  useEffect(() => {
    // Check if we have cached data first
    const cachedData = GoldPriceService.getCachedPrice()
    if (cachedData) {
      setData(cachedData)
      setLastFetch(new Date(cachedData.lastUpdated))
      setIsLoading(false)
      console.log("📦 Using cached gold price data")
    }

    // Then fetch fresh data
    fetchPrice()
  }, [fetchPrice])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // Only fetch if we don't have recent data
      const now = Date.now()
      const lastFetchTime = lastFetch?.getTime() || 0
      const timeSinceLastFetch = now - lastFetchTime

      if (timeSinceLastFetch >= refreshInterval) {
        fetchPrice()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchPrice, lastFetch])

  // Get additional data about the price
  const getPriceInfo = useCallback(() => {
    if (!data) return null

    return {
      confidence: GoldPriceService.getPriceConfidence(data),
      marketStatus: GoldPriceService.getMarketStatus(),
      isValid: GoldPriceService.validatePriceData(data),
      isFallback: data.buyPrice === 1085000,
    }
  }, [data])

  return {
    data,
    isLoading,
    error,
    lastFetch,
    refresh,
    formatPrice: GoldPriceService.formatPrice,
    formatChangePercent: GoldPriceService.formatChangePercent,
    getPriceTrend: GoldPriceService.getPriceTrend,
    getPriceInfo,
    // Additional utility methods
    clearCache: GoldPriceService.clearCache,
    forceRefresh: refresh,
  }
}
