# Gold Price Synchronization (15-Minute Interval)

## Overview

This implementation provides a robust 15-minute synchronization mechanism between G-TOKEN price and Gold Price from GoldAPI.io. The system features automatic caching, API endpoints, and optional Vercel Cron support for continuous updates.

## Key Features

### 1. **Server-Side Caching**
- Cache duration: 15 minutes (previously 5 minutes)
- Reduces API calls to GoldAPI.io
- Consistent pricing across all users
- Fallback to cached data with automatic retry

### 2. **API Endpoints**

#### GET `/api/gold-price`
Fetch current gold price with G-TOKEN pricing applied.

**Response:**
```json
{
  "success": true,
  "data": {
    "buyPrice": 2011500,
    "sellPrice": 1848870,
    "currency": "IDR",
    "lastUpdated": "2024-08-15T02:49:00.000Z",
    "change24h": 1500,
    "changePercent24h": 0.15,
    "source": "GoldAPI.io (Real-time) (G-TOKEN +85%/+70%)",
    "originalBuyPrice": 1087000,
    "originalSellPrice": 1085000
  },
  "confidence": "high",
  "multipliers": {
    "buyMultiplier": 1.85,
    "sellMultiplier": 1.7,
    "buyPercentage": "+85%",
    "sellPercentage": "+70%"
  },
  "timestamp": "2024-08-15T02:49:00.000Z"
}
```

#### POST `/api/gold-price`
Force refresh the gold price cache immediately.

**Request:**
```bash
curl -X POST http://localhost:3000/api/gold-price
```

#### POST `/api/gold-price/sync`
Synchronize gold price (15-minute interval). Called by Vercel Cron automatically.

**Request:**
```bash
# Manual trigger
curl -X POST http://localhost:3000/api/gold-price/sync

# With auth (if CRON_SECRET is configured)
curl -X POST \
  -H "Authorization: ******" \
  http://localhost:3000/api/gold-price/sync
```

**Response:**
```json
{
  "success": true,
  "message": "Gold price synchronized successfully",
  "data": {
    "buyPrice": 2011500,
    "sellPrice": 1848870,
    "currency": "IDR",
    "lastUpdated": "2024-08-15T02:49:00.000Z",
    "source": "GoldAPI.io (Real-time) (G-TOKEN +85%/+70%)"
  },
  "multipliers": {
    "buyMultiplier": 1.85,
    "sellMultiplier": 1.7,
    "buyPercentage": "+85%",
    "sellPercentage": "+70%"
  },
  "confidence": "high",
  "syncTime": "2024-08-15T02:49:00.000Z",
  "duration": "245ms"
}
```

#### GET `/api/gold-price/sync`
Health check for cache status and next sync time.

**Response:**
```json
{
  "success": true,
  "status": "Cache active",
  "cachedData": {
    "buyPrice": 2011500,
    "sellPrice": 1848870,
    "lastUpdated": "2024-08-15T02:49:00.000Z",
    "source": "GoldAPI.io (Real-time)"
  },
  "cacheAgeSecs": 120,
  "nextSyncTime": "2024-08-15T03:04:00.000Z"
}
```

### 3. **Client-Side Usage**

#### Default (15-minute refresh interval)
```tsx
import { useGoldPrice } from "@/hooks/use-gold-price"

export function MyComponent() {
  const { data, isLoading, error } = useGoldPrice()
  
  return (
    <div>
      <p>Buy Price: {data?.buyPrice}</p>
      <p>Sell Price: {data?.sellPrice}</p>
    </div>
  )
}
```

#### Using API Endpoint (Server-side caching)
```tsx
const { data } = useGoldPrice({
  useApiEndpoint: true, // Use /api/gold-price endpoint
  refreshInterval: 900000, // 15 minutes (optional, this is default)
})
```

#### Custom Refresh Interval
```tsx
const { data } = useGoldPrice({
  refreshInterval: 300000, // 5 minutes
  autoRefresh: true,
})
```

#### Manual Refresh
```tsx
const { data, refresh } = useGoldPrice()

// Refresh on demand
await refresh()
```

## Configuration

### Environment Variables

Required in `.env.local` or `.env.production`:
```env
NEXT_PUBLIC_GOLD_API_KEY=your_goldapi_key
NEXT_PUBLIC_METALS_DEV_API_KEY=your_metals_dev_key
CRON_SECRET=your_secret_for_sync_endpoint_protection
```

**Note**: Set `CRON_SECRET` to protect the sync endpoints from unauthorized access. Vercel Cron will include this in the Authorization header. Clients must provide the same secret to manually trigger sync.

### Vercel Deployment

The sync endpoint is automatically called every 15 minutes via `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/gold-price/sync",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## Synchronization Flow

### Automatic (Vercel Cron)
```
Every 15 minutes:
┌─────────────────────────────────┐
│  Vercel Cron Job                │
├─────────────────────────────────┤
│ POST /api/gold-price/sync       │
└──────────────┬──────────────────┘
               │
         ┌─────▼──────┐
         │ GoldAPI.io │
         │ (Primary)  │
         └─────┬──────┘
               │ (Success)
         ┌─────▼───────────────┐
         │ Cache Updated       │
         │ (15-minute TTL)     │
         └─────────────────────┘
```

### Client-Side (On-Demand)
```
User loads page:
┌──────────────────────────────┐
│ useGoldPrice() hook          │
├──────────────────────────────┤
│ 1. Check local cache         │
│ 2. Fetch from service/API    │
│ 3. Apply G-TOKEN multipliers │
│ 4. Auto-refresh every 15min  │
└──────────────────────────────┘
```

## G-TOKEN Pricing Multipliers

- **Buy Price**: Original gold price × **1.85** (85% markup)
- **Sell Price**: Original gold price × **1.70** (70% markup)

Original prices (without multipliers) are preserved in `originalBuyPrice` and `originalSellPrice` fields for reference.

## Performance Considerations

1. **Cache Duration**: 15 minutes
   - Reduces API calls to GoldAPI.io
   - Balances real-time data with performance
   - Each cache miss triggers immediate fetch

2. **Stale-While-Revalidate**: 5 minutes
   - HTTP header cache strategy
   - Serves cached data while refreshing in background

3. **Fallback Prices**:
   - Reference: IDR 1,087,000 per gram
   - Used when all APIs fail
   - Retries every 30 seconds

## Testing

### Test Synchronization
```bash
# Test API endpoint
curl http://localhost:3000/api/gold-price

# Test sync endpoint
curl -X POST http://localhost:3000/api/gold-price/sync

# Check cache status
curl http://localhost:3000/api/gold-price/sync
```

### Monitor in Development
```bash
npm run dev
# Look for log messages:
# 📊 API: Fetching gold price...
# 🔄 Syncing gold price (15-minute interval)...
# ✅ Gold price synced successfully
```

## Troubleshooting

### Issue: "Invalid price data received"
- Check that `NEXT_PUBLIC_GOLD_API_KEY` is configured
- Verify API key has remaining quota (100 requests/day for GoldAPI.io)
- Check network connectivity

### Issue: Prices not updating
- Verify cache age with `GET /api/gold-price/sync`
- Check if 15 minutes have passed since last update
- Manually trigger with `POST /api/gold-price/sync`

### Issue: Vercel Cron not running
- Ensure `vercel.json` is in repository root
- Deploy to Vercel (crons only work in production)
- Check Vercel deployment logs

## API Limits

⚠️ **IMPORTANT**: With 15-minute interval syncing:
- **GoldAPI.io**: 100 requests/day (free tier)
  - 15-min interval = 96 requests/day for sync alone
  - Only 4 requests/day remaining for other usage
  - Consider longer intervals (30-60 minutes) or upgrading plan for production

- **Metals.dev**: 100 requests/month (free tier fallback)
  - Currently has capacity

### Optimization Options
If quota becomes insufficient:
1. **Increase sync interval**: Change from 15 min to 30-60 min in `vercel.json`
2. **Upgrade API plan**: GoldAPI.io offers paid tiers with higher limits
3. **Use secondary source only**: Disable GoldAPI.io, rely on Metals.dev (slower updates)
4. **Client-side caching**: Increase browser cache duration to reduce overall requests
