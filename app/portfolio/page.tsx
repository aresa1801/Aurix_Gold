"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  Coins,
  ExternalLink,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const chartData = [
  { date: "Sep 07", value: 14820000 },
  { date: "Sep 09", value: 14910000 },
  { date: "Sep 11", value: 15040000 },
  { date: "Sep 13", value: 15180000 },
  { date: "Sep 15", value: 15120000 },
  { date: "Sep 17", value: 15498750 },
]

const activity = [
  { date: "17 Sep 2026, 09:42", type: "Staking reward", amount: "+42.50 USDC", price: "—", status: "Completed", hash: "0x7a2f...b91c" },
  { date: "16 Sep 2026, 15:08", type: "Buy G-TOKEN", amount: "+1,250 G-TOKEN", price: "Rp 1,245,000", status: "Completed", hash: "0x4c11...f21a" },
  { date: "12 Sep 2026, 11:26", type: "Stake", amount: "5,000 G-TOKEN", price: "Rp 1,242,500", status: "Completed", hash: "0x91d0...33e8" },
  { date: "08 Sep 2026, 18:54", type: "Redeem", amount: "250 G-TOKEN", price: "Rp 1,238,000", status: "Pending", hash: "0x2d64...0ac4" },
]

const navItems = [
  { label: "Dashboard", href: "/portfolio", icon: LayoutDashboard },
  { label: "Buy / Sell", href: "/swap", icon: ShoppingCart },
  { label: "Redeem", href: "/redemption", icon: ArrowDownToLine },
  { label: "Stake", href: "/staking", icon: LockKeyhole },
  { label: "KYC", href: "/portfolio#kyc", icon: ShieldCheck },
  { label: "Governance", href: "/portfolio#governance", icon: Sparkles },
  { label: "Settings", href: "/portfolio#settings", icon: Settings },
]

const formatIDR = (value: number) => `Rp ${value.toLocaleString("id-ID")}`

function MetricCard({ title, value, detail, change, icon: Icon, accent = false }: { title: string; value: string; detail: string; change?: string; icon: typeof Wallet; accent?: boolean }) {
  return (
    <Card className={cn("border-border/60 bg-card/70", accent && "border-primary/30 bg-primary/[0.07]")}>
      <CardContent className="flex min-h-[142px] flex-col justify-between p-5">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {title}
          <span className={cn("rounded-lg bg-muted/70 p-2", accent && "bg-primary/15 text-primary")}><Icon className="size-4" /></span>
        </div>
        <div>
          <div className="mt-4 flex items-end gap-2"><p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>{change && <span className="mb-1 text-xs font-medium text-primary">{change}</span>}</div>
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PortfolioPage() {
  const [range, setRange] = useState("7d")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/70 bg-background/85 px-5 backdrop-blur-xl lg:px-8">
            <div><p className="text-xs text-muted-foreground">Good morning</p><h1 className="text-lg font-semibold tracking-tight">Portfolio dashboard</h1></div>
            <div className="flex items-center gap-2 sm:gap-3"><div className="hidden items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-xs text-muted-foreground sm:flex"><CircleDollarSign className="size-4 text-primary" />G-Token <span className="font-medium text-foreground">Rp 1,245,000</span></div><Badge variant="outline" className="hidden border-primary/30 bg-primary/10 text-primary sm:inline-flex"><span className="mr-1.5 size-1.5 rounded-full bg-primary" />PoR verified</Badge><Button variant="outline" className="gap-2 border-border/70 bg-card/60 text-xs"><span className="hidden sm:inline">Arbitrum</span><ChevronDown className="size-3" /></Button><Button variant="outline" className="gap-2 border-border/70 bg-card/60 font-mono text-xs">0x1234...5678<ChevronDown className="size-3" /></Button></div>
          </header>

          <div className="mx-auto max-w-[1500px] p-5 lg:p-8">
            <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">Your holdings</p><h2 className="text-3xl font-semibold tracking-tight">A clear view of your gold-backed assets.</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Track balances, rewards, and physical gold equivalence from one secure workspace.</p></div><Button variant="outline" className="w-fit gap-2 border-border/70 bg-card/60"><RefreshCw className="size-4" />Refresh data</Button></section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard title="Total balance" value="12,450 G-TOKEN" detail="≈ Rp 15,498,750" change="+2.84% 24h" icon={Wallet} accent /><MetricCard title="Physical equivalent" value="12.45 gram" detail="AU 99.99% purity" icon={Coins} /><MetricCard title="Staked" value="5,000 G-TOKEN" detail="Earning 3.2% APY" change="+160 G-TOKEN" icon={TrendingUp} /><MetricCard title="Pending rewards" value="42.50 USDC" detail="Available to claim" icon={Sparkles} /></section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <Card className="border-border/60 bg-card/70"><CardHeader className="flex flex-row items-start justify-between gap-4"><div><CardTitle>Portfolio value</CardTitle><CardDescription>Estimated value across your gold-backed positions.</CardDescription></div><ToggleGroup type="single" value={range} onValueChange={(value) => value && setRange(value)} variant="outline" size="sm"><ToggleGroupItem value="7d">7d</ToggleGroupItem><ToggleGroupItem value="30d">30d</ToggleGroupItem><ToggleGroupItem value="90d">90d</ToggleGroupItem><ToggleGroupItem value="1y">1y</ToggleGroupItem></ToggleGroup></CardHeader><CardContent><div className="mb-4 flex items-baseline gap-3"><span className="text-3xl font-semibold">{formatIDR(15498750)}</span><span className="text-sm font-medium text-primary">+2.84%</span></div><div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.45} /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} /><YAxis hide domain={[14700000, 15700000]} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, color: "hsl(var(--foreground))" }} formatter={(value: number) => [formatIDR(value), "Portfolio"]} /><Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#portfolioFill)" /></AreaChart></ResponsiveContainer></div></CardContent></Card>

              <Card id="proof-of-reserves" className="border-primary/20 bg-card/70"><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Proof of reserves</CardTitle><CardDescription>Live reserve coverage</CardDescription></div><div className="rounded-xl bg-primary/15 p-2 text-primary"><ShieldCheck className="size-5" /></div></div></CardHeader><CardContent className="flex flex-col gap-5"><div className="rounded-2xl border border-primary/15 bg-primary/[0.06] p-4"><p className="text-xs text-muted-foreground">Reserve ratio</p><p className="mt-1 text-3xl font-semibold text-primary">100.00%</p><p className="mt-1 text-xs text-muted-foreground">Fully backed by allocated gold</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-muted-foreground">Gold reserve</p><p className="mt-1 font-semibold">1,247.3 kg</p></div><div><p className="text-xs text-muted-foreground">Token supply</p><p className="mt-1 font-semibold">1,247,300</p></div></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="size-3.5 text-primary" />Last update: 2 min ago</div><Button variant="outline" className="w-full gap-2 border-border/70 bg-transparent">View on Chainlink <ExternalLink className="size-3.5" /></Button></CardContent></Card>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"><Card className="border-border/60 bg-card/70"><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Recent activity</CardTitle><CardDescription>Your latest portfolio movements</CardDescription></div><Button variant="ghost" className="text-xs text-primary">View all <ArrowUpRight className="ml-1 size-3.5" /></Button></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Tx hash</TableHead></TableRow></TableHeader><TableBody>{activity.map((item) => <TableRow key={item.hash}><TableCell className="whitespace-nowrap text-xs text-muted-foreground">{item.date}</TableCell><TableCell className="whitespace-nowrap text-sm font-medium">{item.type}</TableCell><TableCell className="whitespace-nowrap text-sm">{item.amount}</TableCell><TableCell className="whitespace-nowrap text-xs text-muted-foreground">{item.price}</TableCell><TableCell><Badge variant="outline" className={cn("border-primary/25 bg-primary/10 text-primary", item.status === "Pending" && "border-amber-400/25 bg-amber-400/10 text-amber-300")}>{item.status}</Badge></TableCell><TableCell className="font-mono text-xs text-muted-foreground">{item.hash}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card><Card className="border-border/60 bg-card/70"><CardHeader><CardTitle>Quick actions</CardTitle><CardDescription>Move assets in a few clicks.</CardDescription></CardHeader><CardContent className="grid grid-cols-2 gap-3"><Button asChild className="h-20 flex-col gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Link href="/swap"><ShoppingCart className="size-5" />Buy</Link></Button><Button asChild variant="outline" className="h-20 flex-col gap-2 border-border/70 bg-transparent"><Link href="/swap"><ArrowUpRight className="size-5" />Sell</Link></Button><Button asChild variant="outline" className="h-20 flex-col gap-2 border-border/70 bg-transparent"><Link href="/redemption"><ArrowDownToLine className="size-5" />Redeem</Link></Button><Button asChild variant="outline" className="h-20 flex-col gap-2 border-border/70 bg-transparent"><Link href="/staking"><LockKeyhole className="size-5" />Stake</Link></Button></CardContent></Card></div>
          </div>
        </main>
    </div>
  )
}
