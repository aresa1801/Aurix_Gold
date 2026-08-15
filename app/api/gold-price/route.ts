import { GoldPriceService } from "@/services/gold-price"
import { NextResponse } from "next/server"

/**
 * GET /api/gold-price
 * Fetch current gold price with G-TOKEN pricing applied
 * Cached for 15 minutes server-side
 */
export async function GET() {
  try {
    console.log("📊 API: Fetching gold price...")
    const priceData = await GoldPriceService.fetchGoldPrice()

    if (!GoldPriceService.validatePriceData(priceData)) {
      return NextResponse.json(
        { error: "Invalid price data" },
        { status: 400 }
      )
    }

    // Include additional metadata
    return NextResponse.json(
      {
        success: true,
        data: priceData,
        confidence: GoldPriceService.getPriceConfidence(priceData),
        multipliers: GoldPriceService.getPricingMultipliers(),
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300", // Cache for 15 mins
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error: any) {
    console.error("❌ API Error:", error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch gold price",
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/gold-price
 * Force refresh of gold price cache
 * Requires CRON_SECRET if configured in environment
 */
export async function POST(request: Request) {
  try {
    // Verify authorization token if CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
      const authHeader = request.headers.get("authorization") || ""
      const bearerToken = authHeader.replace("Bearer ", "")
      if (bearerToken !== cronSecret) {
        console.warn("⚠️ Unauthorized POST request to /api/gold-price")
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }
    }

    console.log("🔄 API: Force refreshing gold price...")
    const priceData = await GoldPriceService.forceRefresh()

    if (!GoldPriceService.validatePriceData(priceData)) {
      return NextResponse.json(
        { error: "Invalid price data" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: priceData,
        confidence: GoldPriceService.getPriceConfidence(priceData),
        multipliers: GoldPriceService.getPricingMultipliers(),
        timestamp: new Date().toISOString(),
        message: "Gold price refreshed successfully",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error: any) {
    console.error("❌ API Error:", error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to refresh gold price",
      },
      { status: 500 }
    )
  }
}
