"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Activity, ArrowDownToLine, ArrowUpRight, BarChart3, Bell, Check, ChevronDown, CircleHelp, ClipboardCheck, Copy, FileText, Gem, LayoutDashboard, LineChart, Menu, Network, Plus, Settings2, ShieldCheck, Users, WalletCards, X } from "lucide-react"

export const vaultNav = [
  { href: "/vault", label: "Overview", icon: LayoutDashboard },
  { href: "/vault/reserve", label: "Reserve", icon: Gem },
  { href: "/vault/revenue", label: "Revenue", icon: WalletCards },
  { href: "/vault/leasing", label: "Leasing", icon: ArrowUpRight },
  { href: "/vault/performance", label: "Performance", icon: LineChart },
  { href: "/vault/compliance", label: "Compliance", icon: ClipboardCheck },
  { href: "/vault/referral", label: "Referral", icon: Users },
  { href: "/vault/settings", label: "Settings", icon: Settings2 },
]

export function VaultShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow?: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)
  return (
    <div className="min-h-screen bg-[#080909] text-[#f6f2e8]">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/[0.07] bg-[#0d0f0f] px-4 py-5 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-3 pb-7">
          <Link href="/vault" onClick={closeMobile} className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-[#d6b46a] text-[#17140d]"><Gem className="size-5" /></span><span><span className="block text-sm font-semibold tracking-wide">Pegadaian</span><span className="block text-[11px] text-white/40">Vault Operations</span></span></Link>
          <Button variant="ghost" size="icon" className="text-white/50 lg:hidden" onClick={closeMobile}><X /></Button>
        </div>
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Vault dashboard</p>
        <nav className="flex flex-col gap-1">{vaultNav.map(({ href, label, icon: Icon }) => { const active = pathname === href || (href !== "/vault" && pathname.startsWith(href)); return <Link key={href} href={href} onClick={closeMobile} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-[#d6b46a]/12 text-[#e3c57d]" : "text-white/55 hover:bg-white/[0.04] hover:text-white"}`}><Icon className="size-[17px]" />{label}{label === "Leasing" && <Badge variant="outline" className="ml-auto border-[#d6b46a]/30 px-1.5 py-0 text-[9px] text-[#d6b46a]">Optional</Badge>}</Link> })}</nav>
        <div className="absolute inset-x-4 bottom-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"><div className="flex items-center gap-2 text-xs font-medium"><span className="size-2 rounded-full bg-emerald-400" />All systems operational</div><p className="mt-1 text-[11px] text-white/35">Last synced 2 minutes ago</p></div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={closeMobile} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#080909]/90 px-5 backdrop-blur-xl lg:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="text-white/60 lg:hidden" onClick={() => setMobileOpen(true)}><Menu /></Button><div><div className="flex items-center gap-2 text-sm font-semibold">Pegadaian Vault 01 <Badge className="border-emerald-400/20 bg-emerald-400/10 text-[10px] text-emerald-300"><Check className="mr-1 size-3" />Verified</Badge></div><div className="mt-0.5 flex items-center gap-1 text-[11px] text-white/35"><Network className="size-3" />Arbitrum Network <ChevronDown className="size-3" /></div></div></div><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="text-white/50 hover:text-white"><Bell /></Button><div className="hidden items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/65 sm:flex"><span className="size-2 rounded-full bg-emerald-400" />0xab...cd</div></div></header>
        <main className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8"><div className="mb-7"><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d6b46a]">{eyebrow ?? "Institutional vault operations"}</p><h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1></div>{children}</main>
      </div>
    </div>
  )
}

export function StatCard({ label, value, detail, trend, icon: Icon }: { label: string; value: string; detail: string; trend?: string; icon: typeof Activity }) { return <Card className="border-white/[0.08] bg-white/[0.025]"><CardContent className="p-5"><div className="flex items-start justify-between"><div className="flex size-9 items-center justify-center rounded-lg bg-[#d6b46a]/10 text-[#d6b46a]"><Icon className="size-4" /></div>{trend && <span className="text-xs text-emerald-300">{trend}</span>}</div><p className="mt-5 text-xs text-white/45">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-white/35">{detail}</p></CardContent></Card> }

export function HealthCard() { return <Card className="border-[#d6b46a]/20 bg-[#111311]"><CardHeader className="pb-4"><div className="flex items-center justify-between"><CardTitle className="text-base">Reserve Health</CardTitle><span className="flex items-center gap-1.5 text-xs text-emerald-300"><span className="size-2 rounded-full bg-emerald-400" />Healthy</span></div><CardDescription className="text-white/40">Live backing and operational checks</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><HealthRow label="Reserve Ratio" value="100.00%" good /><HealthRow label="Utilization" value="94.9%" good /><HealthRow label="Last PoR Update" value="2 min ago" good /><HealthRow label="Chainlink Feed" value="Active" good /><HealthRow label="Auditor Last Check" value="6 hours ago" good /><HealthRow label="Insurance Coverage" value="Rp 350 miliar" good /><Separator className="bg-white/[0.08]" /><Button variant="outline" className="border-[#d6b46a]/25 text-[#e3c57d] hover:bg-[#d6b46a]/10" onClick={() => window.alert("On-chain verification opened") }>Verify on Chain <ArrowUpRight data-icon="inline-end" /></Button></CardContent></Card> }
function HealthRow({ label, value, good }: { label: string; value: string; good?: boolean }) { return <div className="flex items-center justify-between text-sm"><span className="text-white/45">{label}</span><span className="flex items-center gap-2 font-medium">{value}{good && <span className="size-1.5 rounded-full bg-emerald-400" />}</span></div> }

export function QuickActions() { const actions = [{ label: "Add Reserve", icon: Plus }, { label: "Withdraw Revenue", icon: ArrowDownToLine }, { label: "Update PoR Feed", icon: Activity }, { label: "Generate Report", icon: FileText }, { label: "Contact Support", icon: CircleHelp }]; return <div className="flex flex-wrap gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">{actions.map(({ label, icon: Icon }) => <Button key={label} variant="ghost" className="text-xs text-white/60 hover:bg-[#d6b46a]/10 hover:text-[#e3c57d]" onClick={() => window.alert(`${label} flow opened`)}><Icon data-icon="inline-start" />{label}</Button>)}</div> }

export function CopyAddress({ address = "0x1234...5678" }: { address?: string }) { const [copied, setCopied] = useState(false); return <Button variant="ghost" size="sm" className="text-[#d6b46a]" onClick={() => { navigator.clipboard?.writeText(address); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }}><Copy data-icon="inline-start" />{copied ? "Copied" : "Copy"}</Button> }

export const revenueEvents = [{ time: "10:42", event: "Buy G-Token", amount: "Rp 245rb", source: "Trading", tx: "0xab..12" }, { time: "10:38", event: "Redeem Cash", amount: "Rp 1.2jt", source: "Redeem", tx: "0xcd..34" }, { time: "10:35", event: "Buy G-Token", amount: "Rp 892rb", source: "Trading", tx: "0xef..56" }, { time: "10:29", event: "Vault payout", amount: "Rp 4.8jt", source: "Yield", tx: "0x91..a2" }]
export const goldBars = [{ name: "Allocated gold", value: "235.2 kg", percent: 94.9 }, { name: "Idle reserve", value: "12.6 kg", percent: 5.1 }]
