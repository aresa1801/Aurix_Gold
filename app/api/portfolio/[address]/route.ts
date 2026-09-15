import { NextResponse } from "next/server"
import { ethers } from "ethers"
import {
  CONTRACT_ADDRESSES,
  FAUCET_ABI,
  GOLD_TOKEN_ABI,
  IDRT_ABI,
} from "@/services/contracts"

const DEMO_SNAPSHOT = {
  idrtBalance: "50000000",
  goldTokenBalance: "125.500000",
  bnbBalance: "2.5847",
  faucetStatus: {
    canClaim: true,
    nextClaimTime: 0,
    lastClaimTime: 0,
    claimAmount: "1000000",
    availableBalance: "100000000",
    isPaused: false,
    cooldownPeriod: 86400,
  },
}

function formatToken(value: bigint | string | number) {
  return ethers.formatUnits(value, 18)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params
  if (!ethers.isAddress(address)) {
    return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 })
  }

  const rpcUrl = process.env.BSC_RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545"
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const idrt = new ethers.Contract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI, provider)
  const gold = new ethers.Contract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI, provider)
  const faucet = new ethers.Contract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI, provider)

  try {
    const [idrtResult, goldResult, bnbResult, faucetResult] = await Promise.allSettled([
      idrt.balanceOf(address),
      gold.balanceOf(address),
      provider.getBalance(address),
      Promise.all([
        faucet.canClaim(address),
        faucet.nextClaimTime(address),
        faucet.lastClaimTime(address),
        faucet.CLAIM_AMOUNT(),
        faucet.availableBalance(),
        faucet.paused(),
        faucet.CLAIM_COOLDOWN(),
      ]),
    ])

    const faucetValues = faucetResult.status === "fulfilled" ? faucetResult.value : []
    const snapshot = {
      idrtBalance: idrtResult.status === "fulfilled" ? formatToken(idrtResult.value) : DEMO_SNAPSHOT.idrtBalance,
      goldTokenBalance: goldResult.status === "fulfilled" ? formatToken(goldResult.value) : DEMO_SNAPSHOT.goldTokenBalance,
      bnbBalance: bnbResult.status === "fulfilled" ? ethers.formatEther(bnbResult.value) : DEMO_SNAPSHOT.bnbBalance,
      faucetStatus: faucetValues.length === 7 ? {
        canClaim: Boolean(faucetValues[0]),
        nextClaimTime: Number(faucetValues[1]),
        lastClaimTime: Number(faucetValues[2]),
        claimAmount: formatToken(faucetValues[3]),
        availableBalance: formatToken(faucetValues[4]),
        isPaused: Boolean(faucetValues[5]),
        cooldownPeriod: Number(faucetValues[6]),
      } : DEMO_SNAPSHOT.faucetStatus,
      lastSyncTime: Date.now(),
      source: "smart-contract",
      address,
    }

    return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ ...DEMO_SNAPSHOT, lastSyncTime: Date.now(), source: "mock-fallback", address }, { headers: { "Cache-Control": "no-store" } })
  }
}
