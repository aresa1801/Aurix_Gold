"use client"

import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ArrowDownUp, Check, CircleAlert, Clock3, ExternalLink, Info, Loader2, ShieldCheck, Sparkles, Wallet } from "lucide-react"
import { useGoldPrice } from "@/hooks/use-gold-price"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

const chartData = [
  { time: "09:00", price: 1231000 }, { time: "10:00", price: 1235000 }, { time: "11:00", price: 1232800 },
  { time: "12:00", price: 1240000 }, { time: "13:00", price: 1238500 }, { time: "14:00", price: 1245000 },
  { time: "15:00", price: 1243200 },
]

const steps = ["Approving", "Signing", "Broadcasting", "Confirmed"]

export default function SwapPage() {
  const [mode, setMode] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("1000.00")
  const [slippage, setSlippage] = useState("0.5")
  const [pending, setPending] = useState(false)
  const [step, setStep] = useState(0)
  const [kycVerified] = useState(true)
  const [showError, setShowError] = useState(false)
  const { data, isLoading } = useGoldPrice({ autoRefresh: true, refreshInterval: 30000 })

  const rate = data?.buyPrice || 1245000
  const numericAmount = Number(amount.replace(/,/g, "")) || 0
  const receive = mode === "buy" ? numericAmount / rate : numericAmount * rate
  const payToken = mode === "buy" ? "USDC" : "G-TOKEN"
  const receiveToken = mode === "buy" ? "G-TOKEN" : "USDC"
  const balance = mode === "buy" ? 1245 : 1.842
  const insufficient = numericAmount > balance
  const chartConfig = { price: { label: "XAU/USD", color: "var(--color-chart-1)" } }

  const formattedReceive = useMemo(() => mode === "buy" ? receive.toFixed(4) : receive.toLocaleString("id-ID", { maximumFractionDigits: 2 }), [mode, receive])
  const formattedRate = rate.toLocaleString("id-ID")

  const handleConfirm = async () => {
    if (insufficient || !amount || !kycVerified) return
    setPending(true)
    setStep(0)
    try {
      for (let index = 0; index < steps.length; index += 1) {
        setStep(index)
        await new Promise((resolve) => setTimeout(resolve, index === 3 ? 700 : 900))
      }
      toast({ title: "Transaction confirmed", description: `You received ${formattedReceive} ${receiveToken}.` })
      setPending(false)
    } catch {
      setPending(false)
      setShowError(true)
    }
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="outline" className="mb-3 border-gold/40 text-gold">AuriX Exchange</Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-soft-white md:text-4xl">Buy & sell gold-backed tokens</h1>
              <p className="mt-2 max-w-2xl text-soft-white/60">Trade G-TOKEN with transparent pricing, verified reserves, and real-time market data.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-soft-white/60"><span className="size-2 rounded-full bg-prosperity" />Market open <span className="text-soft-white/30">•</span> XAU/USD live</div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
            <Card className="border-gold/20 bg-navy-800/70 shadow-2xl shadow-black/20">
              <CardHeader className="border-b border-white/5 pb-5">
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-xl text-soft-white">Trade</CardTitle><CardDescription className="mt-1 text-soft-white/50">Set your order and review the details</CardDescription></div>
                  <Wallet className="text-gold" aria-hidden="true" />
                </div>
                <div className="mt-5 grid grid-cols-2 rounded-xl bg-black/20 p-1">
                  {(["buy", "sell"] as const).map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-lg px-4 py-2.5 text-sm font-medium capitalize transition ${mode === item ? "bg-gold text-navy-900" : "text-soft-white/60 hover:text-soft-white"}`}>{item}</button>)}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 pt-6">
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <div className="mb-3 flex items-center justify-between"><Label className="text-soft-white/60">You pay</Label><span className="text-xs text-soft-white/45">Balance: {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })} {payToken}</span></div>
                  <div className="flex gap-3"><Input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="h-12 border-0 bg-transparent px-0 text-2xl font-semibold text-soft-white shadow-none focus-visible:ring-0" aria-label="Amount to pay" /><Select value={payToken}><SelectTrigger className="h-11 w-32 border-white/10 bg-white/5 text-soft-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USDC">USDC</SelectItem><SelectItem value="G-TOKEN">G-TOKEN</SelectItem></SelectContent></Select></div>
                </div>
                <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold"><ArrowDownUp aria-hidden="true" /></div>
                <div className="rounded-xl border border-white/10 bg-black/15 p-4"><div className="mb-3 flex items-center justify-between"><Label className="text-soft-white/60">You receive</Label><span className="text-xs text-soft-white/45">Estimated amount</span></div><div className="flex gap-3"><div className="flex h-12 flex-1 items-center text-2xl font-semibold text-gold">{formattedReceive}</div><div className="flex h-11 w-32 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sm text-soft-white">{receiveToken}</div></div><p className="mt-2 text-xs text-soft-white/45">≈ Rp {(mode === "buy" ? numericAmount * 15800 : receive * 15800).toLocaleString("id-ID", { maximumFractionDigits: 0 })}</p></div>
                <div className="grid gap-3 rounded-xl border border-white/5 bg-white/[.03] p-4 text-sm"><div className="flex justify-between text-soft-white/65"><span>Rate</span><span className="text-right text-soft-white">1 G-TOKEN = {formattedRate} IDR</span></div><div className="flex justify-between text-soft-white/65"><span>Spread</span><span className="text-soft-white">1.50%</span></div><div className="flex justify-between text-soft-white/65"><span>Network fee</span><span className="text-soft-white">~$0.12</span></div><div className="flex items-center justify-between text-soft-white/65"><span>Slippage tolerance</span><Select value={slippage} onValueChange={setSlippage}><SelectTrigger className="h-8 w-24 border-white/10 bg-white/5 text-xs text-soft-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0.5">0.5%</SelectItem><SelectItem value="1">1.0%</SelectItem><SelectItem value="2">2.0%</SelectItem></SelectContent></Select></div></div>
                {!kycVerified && <div className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold">Complete KYC to continue. <a href="/kyc" className="font-semibold underline">Verify now</a></div>}
                {insufficient && <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"><CircleAlert className="size-4" />Insufficient balance for this transaction.</div>}
                <Tooltip><TooltipTrigger asChild><span className="block"><Button className="h-12 w-full bg-gold font-semibold text-navy-900 hover:bg-gold/90" disabled={isLoading || insufficient || !kycVerified} onClick={handleConfirm}>{isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}{mode === "buy" ? "Confirm purchase" : "Confirm sale"}</Button></span></TooltipTrigger>{insufficient && <TooltipContent>Reduce the amount or fund your wallet.</TooltipContent>}</Tooltip>
                <p className="flex items-center justify-center gap-1 text-center text-xs text-soft-white/40"><ShieldCheck className="size-3 text-prosperity" /> Non-custodial settlement with on-chain verification</p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="border-white/10 bg-navy-800/60"><CardHeader className="pb-3"><div className="flex items-center justify-between"><div><CardTitle className="text-lg text-soft-white">Gold market</CardTitle><CardDescription className="text-soft-white/50">XAU/USD reference price</CardDescription></div><Badge className="border-prosperity/30 bg-prosperity/10 text-prosperity">Live</Badge></div></CardHeader><CardContent>{isLoading ? <Skeleton className="h-56 w-full" /> : <ChartContainer config={chartConfig} className="h-56 w-full"><AreaChart data={chartData} margin={{ left: 0, right: 8, top: 12, bottom: 0 }}><defs><linearGradient id="goldFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="rgba(255,255,255,.08)" /><XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,.45)", fontSize: 11 }} /><YAxis hide domain={["dataMin - 5000", "dataMax + 5000"]} /><ChartTooltip content={<ChartTooltipContent />} /><Area type="monotone" dataKey="price" stroke="var(--color-chart-1)" fill="url(#goldFill)" strokeWidth={2} /></AreaChart></ChartContainer>}<div className="mt-3 flex items-center justify-between text-sm"><span className="text-soft-white/50">Current reference</span><span className="font-semibold text-gold">{formattedRate} IDR / gram</span></div></CardContent></Card>
              <Card className="border-white/10 bg-navy-800/60"><CardHeader className="pb-3"><CardTitle className="text-lg text-soft-white">Transparent fees</CardTitle><CardDescription className="text-soft-white/50">No hidden charges</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 text-sm"><div className="flex justify-between text-soft-white/65"><span>Protocol fee</span><span>1.50%</span></div><div className="flex justify-between text-soft-white/65"><span>Network fee</span><span>~$0.12</span></div><div className="flex justify-between text-soft-white/65"><span>Liquidity impact</span><span>&lt;0.05%</span></div><a href="/docs/fees" className="mt-1 inline-flex items-center gap-1 text-gold hover:underline">View fee documentation <ExternalLink className="size-3" /></a></CardContent></Card>
              <Card className="border-prosperity/20 bg-prosperity/5"><CardContent className="flex items-start gap-3 p-5"><ShieldCheck className="mt-0.5 text-prosperity" /><div><p className="font-medium text-soft-white">Proof of reserves verified</p><p className="mt-1 text-sm text-soft-white/55">100% of G-TOKEN supply is backed by vaulted gold.</p><a href="/portfolio" className="mt-2 inline-flex text-sm text-prosperity hover:underline">View reserve report</a></div></CardContent></Card>
            </div>
          </div>
        </div>
      </main>
      <Dialog open={pending} onOpenChange={(open) => !open && setPending(false)}><DialogContent className="border-white/10 bg-navy-900 text-soft-white"><DialogHeader><DialogTitle>Transaction in progress</DialogTitle><DialogDescription className="text-soft-white/55">Please keep this window open while your order is settled.</DialogDescription></DialogHeader><div className="flex flex-col gap-4 py-4">{steps.map((label, index) => <div key={label} className="flex items-center gap-3"><div className={`flex size-8 items-center justify-center rounded-full border ${index < step ? "border-prosperity bg-prosperity/10 text-prosperity" : index === step ? "border-gold bg-gold/10 text-gold" : "border-white/15 text-soft-white/35"}`}>{index < step ? <Check className="size-4" /> : index === step ? <Loader2 className="size-4 animate-spin" /> : index + 1}</div><span className={index <= step ? "text-soft-white" : "text-soft-white/40"}>{label}</span></div>)}<Progress value={(step / (steps.length - 1)) * 100} className="mt-2" /></div></DialogContent></Dialog>
      <Dialog open={showError} onOpenChange={setShowError}><DialogContent className="border-red-400/20 bg-navy-900 text-soft-white"><DialogHeader><DialogTitle className="text-red-200">Transaction failed</DialogTitle><DialogDescription className="text-soft-white/60">The network rejected this transaction. Check your wallet and try again.</DialogDescription></DialogHeader><Button onClick={() => { setShowError(false); handleConfirm() }} className="bg-gold text-navy-900">Retry transaction</Button></DialogContent></Dialog>
    </TooltipProvider>
  )
}
