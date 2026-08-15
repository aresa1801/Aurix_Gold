import { GoldPriceService } from "@/services/gold-price"
import { NextResponse } from "next/server"

/**
 * POST /api/gold-price/sync
 * Synchronize gold price every 15 minutes
 * Can be called by:
 * 1. Vercel Cron (set in vercel.json)
 * 2. External cron services
 * 3. Manual API calls with auth token
 */
export async function POST(request: Request) {
  try {
    // Verify authorization token (optional, for production)
    // Uncomment and configure for production use
    // const authHeader = request.headers.get("authorization")
    // const cronSecret = process.env.CRON_SECRET || ""
    // if (cronSecret && authHeader !== `****** {
    //   const userAgent = request.headers.get("user-agent") || ""
    //   if (!userAgent.includes("vercel")) {
    //     console.warn("⚠️ Unauthorized sync request")
    //     return NextResponse.json(
    //       { error: "Unauthorized" },
    //       { status: 401 }
    //     )
    //   }
    // }

    console.log("🔄 Syncing gold price (15-minute interval)...")
    const startTime = Date.now()

    // Force refresh to update cache
    const priceData = await GoldPriceService.forceRefresh()

    if (!GoldPriceService.validatePriceData(priceData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid price data received",
          durationMs: Date.now() - startTime,
        },
        { status: 400 }
      )
    }

    console.log("✅ Gold price synced successfully", {
      buyPrice: priceData.buyPrice,
      sellPrice: priceData.sellPrice,
      source: priceData.source,
      duration: Date.now() - startTime,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Gold price synchronized successfully",
        data: {
          buyPrice: priceData.buyPrice,
          sellPrice: priceData.sellPrice,
          currency: priceData.currency,
          lastUpdated: priceData.lastUpdated,
          source: priceData.source,
          originalBuyPrice: priceData.originalBuyPrice,
          originalSellPrice: priceData.originalSellPrice,
        },
        multipliers: GoldPriceService.getPricingMultipliers(),
        confidence: GoldPriceService.getPriceConfidence(priceData),
        syncTime: new Date().toISOString(),
        durationMs: Date.now() - startTime,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store",
        },
      }
    )
  } catch (error: any) {
    console.error("❌ Sync Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync gold price",
        errorType: error.constructor.name,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/gold-price/sync
 * Health check endpoint to verify sync capability
 */
export async function GET() {
  try {
    const priceData = GoldPriceService.getCachedPrice()

    if (!priceData) {
      return NextResponse.json(
        {
          success: true,
          status: "No cached price available",
          nextSyncTime: new Date(Date.now() + 900000).toISOString(),
        },
        { status: 200 }
      )
    }

    const lastUpdated = new Date(priceData.lastUpdated).getTime()
    const now = Date.now()
    const timeSinceUpdate = now - lastUpdated
    const nextSyncTime = new Date(lastUpdated + 900000) // 15 minutes from last update

    return NextResponse.json(
      {
        success: true,
        status: "Cache active",
        cachedData: {
          buyPrice: priceData.buyPrice,
          sellPrice: priceData.sellPrice,
          lastUpdated: priceData.lastUpdated,
          source: priceData.source,
        },
        cacheAgeSecs: Math.round(timeSinceUpdate / 1000),
        nextSyncTime: nextSyncTime.toISOString(),
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ Health check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
