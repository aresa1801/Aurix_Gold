"use client"

import { useMemo, useState } from "react"
import { Check, ChevronRight, Gift, Info, Lock, ShieldCheck, TrendingUp, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const pools = [
  { name: "Flexible", lock: "No lock", apy: "1.5%", total: "245,000", stake: "1,000", tone: "text-sky-300" },
  { name: "Silver", lock: "30 days", apy: "2.5%", total: "512,000", stake: "2,000", tone: "text-slate-200" },
  { name: "Gold", lock: "90 days", apy: "3.2%", total: "380,000", stake: "2,000", tone: "text-gold" },
  { name: "Platinum", lock: "180 days", apy: "4.5%", total: "110,000", stake: "0", tone: "text-violet-300" },
]

const history = [
  { date: "12 Sep 2026", action: "Reward claimed", pool: "Gold", amount: "+ USDC 12.50", status: "Completed" },
  { date: "01 Sep 2026", action: "Staked", pool: "Gold", amount: "2,000 G-TOKEN", status: "Completed" },
  { date: "14 Jun 2026", action: "Staked", pool: "Silver", amount: "2,000 G-TOKEN", status: "Completed" },
]

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState<(typeof pools)[number] | null>(null)
  const [amount, setAmount] = useState("")
  const [showClaimed, setShowClaimed] = useState(false)

  const estimated = useMemo(() => {
    const value = Number(amount) || 0
    const apy = selectedPool ? Number.parseFloat(selectedPool.apy) / 100 : 0
    return { daily: (value * apy) / 365, monthly: (value * apy) / 12, yearly: value * apy }
  }, [amount, selectedPool])

  const openStake = (pool: (typeof pools)[number]) => {
    setSelectedPool(pool)
    setAmount("")
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-soft-white/50"><span>Earn</span><ChevronRight className="size-4" /><span className="text-gold">Staking</span></div>
            <h1 className="text-4xl font-semibold tracking-tight text-soft-white">Stake your gold. Grow your holdings.</h1>
            <p className="mt-2 max-w-2xl text-soft-white/60">Put your G-TOKEN to work in audited pools backed by real gold reserves.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-navy-800/60 px-4 py-3">
            <Wallet className="size-5 text-gold" />
            <div><p className="text-xs text-soft-white/50">Available to stake</p><p className="font-semibold text-soft-white">7,450 G-TOKEN</p></div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Available to stake", "7,450", "G-TOKEN", "text-gold"],
            ["Currently staked", "5,000", "G-TOKEN", "text-soft-white"],
            ["Claimable rewards", "42.50", "USDC", "text-prosperity"],
            ["Average APY", "3.2", "%", "text-gold"],
          ].map(([label, value, unit, color]) => (
            <Card key={label} className="border-gold/15 bg-navy-800/50">
              <CardContent className="p-5"><p className="text-sm text-soft-white/55">{label}</p><div className="mt-3 flex items-baseline gap-2"><span className={`text-2xl font-semibold ${color}`}>{value}</span><span className="text-sm text-soft-white/50">{unit}</span></div></CardContent>
            </Card>
          ))}
        </section>

        <Card className="mb-8 overflow-hidden border-gold/15 bg-navy-800/50">
          <CardHeader className="border-b border-soft-white/10"><div className="flex items-center justify-between"><div><CardTitle className="text-xl text-soft-white">Staking pools</CardTitle><CardDescription className="mt-1 text-soft-white/55">Choose a lock period that fits your strategy.</CardDescription></div><Badge variant="outline" className="border-prosperity/30 text-prosperity"><ShieldCheck className="mr-1 size-3" /> Audited pools</Badge></div></CardHeader>
          <CardContent className="p-0"><div className="hidden grid-cols-[1.2fr_1fr_0.7fr_1.3fr_1fr_0.8fr] gap-4 px-6 py-4 text-xs uppercase tracking-wider text-soft-white/40 md:grid"><span>Pool</span><span>Lock period</span><span>APY</span><span>Total staked</span><span>Your stake</span><span /></div>{pools.map((pool) => <div key={pool.name} className="grid gap-4 border-t border-soft-white/10 px-6 py-5 md:grid-cols-[1.2fr_1fr_0.7fr_1.3fr_1fr_0.8fr] md:items-center"><div><div className={`font-semibold ${pool.tone}`}>{pool.name}</div><div className="mt-1 text-xs text-soft-white/45 md:hidden">{pool.lock}</div></div><span className="hidden text-sm text-soft-white/65 md:block">{pool.lock}</span><span className="font-semibold text-prosperity">{pool.apy}</span><span className="text-sm text-soft-white/65">{pool.total} G-TOKEN</span><span className="text-sm text-soft-white">{pool.stake} G-TOKEN</span><Button onClick={() => openStake(pool)} size="sm" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">Stake</Button></div>)}</CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-gold/15 bg-navy-800/50"><CardHeader><CardTitle className="flex items-center gap-2 text-soft-white"><Gift className="size-5 text-prosperity" /> Rewards</CardTitle><CardDescription className="text-soft-white/55">Your available rewards from all staking pools.</CardDescription></CardHeader><CardContent><div className="flex flex-col justify-between gap-5 rounded-xl bg-navy-900/60 p-5 sm:flex-row sm:items-center"><div><p className="text-sm text-soft-white/55">Claimable USDC</p><p className="mt-1 text-3xl font-semibold text-prosperity">42.50 USDC</p></div><Button onClick={() => setShowClaimed(true)} className="bg-prosperity text-navy-900 hover:bg-prosperity/90"><Gift className="mr-2 size-4" />Claim rewards</Button></div><Separator className="my-6 bg-soft-white/10" /><div className="space-y-4">{history.map((item) => <div key={`${item.date}-${item.action}`} className="flex items-center justify-between gap-4 text-sm"><div><p className="text-soft-white">{item.action} <span className="text-soft-white/45">in {item.pool}</span></p><p className="mt-1 text-xs text-soft-white/45">{item.date}</p></div><div className="text-right"><p className="text-soft-white">{item.amount}</p><Badge variant="secondary" className="mt-1 bg-prosperity/10 text-xs text-prosperity">{item.status}</Badge></div></div>)}</div></CardContent></Card>
          <Card className="border-gold/15 bg-navy-800/50"><CardHeader><CardTitle className="flex items-center gap-2 text-soft-white"><TrendingUp className="size-5 text-gold" /> Why stake with Aurix?</CardTitle><CardDescription className="text-soft-white/55">Transparent yield, backed by verifiable reserves.</CardDescription></CardHeader><CardContent className="space-y-4">{[["Real reserve backing", "Every G-TOKEN is linked to audited physical gold reserves."],["Flexible strategies", "Choose between instant access and higher fixed yields."],["Clear rewards", "Rewards are calculated daily and distributed in USDC."]].map(([title, text]) => <div key={title} className="flex gap-3"><div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold"><Check className="size-3" /></div><div><p className="font-medium text-soft-white">{title}</p><p className="mt-1 text-sm leading-6 text-soft-white/55">{text}</p></div></div>)}<div className="flex gap-2 rounded-lg border border-gold/15 bg-gold/5 p-3 text-xs leading-5 text-soft-white/60"><Info className="mt-0.5 size-4 shrink-0 text-gold" />Lock periods may apply. Review the pool terms before confirming your stake.</div></CardContent></Card>
        </div>
      </div>

      <Dialog open={Boolean(selectedPool)} onOpenChange={(open) => !open && setSelectedPool(null)}><DialogContent className="border-gold/20 bg-navy-900 text-soft-white"><DialogHeader><DialogTitle className="text-gold">Stake in {selectedPool?.name} pool</DialogTitle><DialogDescription className="text-soft-white/60">{selectedPool?.lock} lock period at {selectedPool?.apy} APY.</DialogDescription></DialogHeader><div className="space-y-4"><div><Label htmlFor="stake-amount" className="text-soft-white">Amount to stake</Label><div className="relative mt-2"><Input id="stake-amount" value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0" placeholder="0.00" className="border-gold/20 bg-navy-800 pr-24 text-soft-white" /><span className="absolute right-3 top-2.5 text-sm text-soft-white/45">G-TOKEN</span></div><p className="mt-2 text-xs text-soft-white/45">Available balance: 7,450 G-TOKEN</p></div><div className="rounded-lg bg-navy-800 p-4 text-sm"><p className="mb-3 font-medium text-soft-white">Estimated rewards</p><div className="grid grid-cols-3 gap-3 text-center"><div><p className="text-xs text-soft-white/45">Daily</p><p className="mt-1 text-soft-white">{estimated.daily.toFixed(4)}</p></div><div><p className="text-xs text-soft-white/45">Monthly</p><p className="mt-1 text-soft-white">{estimated.monthly.toFixed(2)}</p></div><div><p className="text-xs text-soft-white/45">Yearly</p><p className="mt-1 text-gold">{estimated.yearly.toFixed(2)}</p></div></div></div>{selectedPool?.lock !== "No lock" && <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200">Early withdrawal may incur a penalty before the {selectedPool?.lock} period ends.</div>}</div><DialogFooter><Button variant="outline" onClick={() => setSelectedPool(null)} className="border-soft-white/15 text-soft-white">Cancel</Button><Button disabled={!Number(amount)} onClick={() => setSelectedPool(null)} className="bg-gold text-navy-900 hover:bg-gold-600"><Lock className="mr-2 size-4" />Approve & stake</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={showClaimed} onOpenChange={setShowClaimed}><DialogContent className="border-prosperity/20 bg-navy-900 text-soft-white"><DialogHeader><DialogTitle className="text-prosperity">Rewards claimed</DialogTitle><DialogDescription className="text-soft-white/60">Your USDC rewards have been submitted for processing.</DialogDescription></DialogHeader><div className="flex items-center gap-3 rounded-lg bg-prosperity/10 p-4"><Check className="size-5 text-prosperity" /><span>42.50 USDC is on its way to your connected wallet.</span></div><DialogFooter><Button onClick={() => setShowClaimed(false)} className="bg-prosperity text-navy-900 hover:bg-prosperity/90">Done</Button></DialogFooter></DialogContent></Dialog>
    </main>
  )
}
