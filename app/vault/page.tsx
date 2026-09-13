"use client"

import { useState, type ReactNode } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowUpRight, Clock3, Copy, Download, ExternalLink, FileCheck2, Gem, ShieldCheck } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const reserveHistory = [
  { day: "Jun 16", reserve: 1120, supply: 1120 },
  { day: "Jun 30", reserve: 1138, supply: 1138 },
  { day: "Jul 14", reserve: 1165, supply: 1165 },
  { day: "Jul 28", reserve: 1184, supply: 1184 },
  { day: "Aug 11", reserve: 1210, supply: 1210 },
  { day: "Aug 25", reserve: 1232, supply: 1232 },
  { day: "Sep 13", reserve: 1247, supply: 1247 },
]

const audits = [
  { date: "13 Sep 2026", auditor: "PwC Indonesia", report: "Monthly reserve attestation", hash: "0x7f9a...8b2c" },
  { date: "15 Aug 2026", auditor: "Ernst & Young", report: "Quarterly physical audit", hash: "0x3e4f...9d1a" },
  { date: "15 Jul 2026", auditor: "PwC Indonesia", report: "Monthly reserve attestation", hash: "0x8c2b...4f7e" },
]

export default function VaultPage() {
  const [copied, setCopied] = useState(false)
  const feedAddress = "0x8a91...F42C"

  const copyFeed = async () => {
    await navigator.clipboard?.writeText("0x8a91B5A7C4D2E1F0A3B9C8D7E6F5A4B3C2D1F42C")
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <main className="min-h-screen px-4 py-10 text-soft-white">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 max-w-3xl">
          <Badge className="mb-4 border-gold/30 bg-gold/10 text-gold">Proof of Reserve</Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Verify the gold behind every G-TOKEN.</h1>
          <p className="mt-4 text-lg leading-relaxed text-soft-white/65">Setiap G-Token di-backing 1 gram emas fisik. Verifikasi sendiri, kapan saja.</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <Card className="border-gold/25 bg-navy-800/60 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-gold"><ShieldCheck className="size-5" /> Live reserve feed</CardTitle>
                <CardDescription className="mt-1 text-soft-white/60">On-chain reserve data, refreshed continuously.</CardDescription>
              </div>
              <Badge className="border-prosperity/30 bg-prosperity/10 text-prosperity"><span className="mr-2 size-2 rounded-full bg-prosperity" />Live</Badge>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gold/15 bg-gold/5 p-5 md:col-span-2">
                <p className="text-sm text-soft-white/60">Total Reserve</p>
                <p className="mt-1 text-4xl font-bold text-gold">1,247.3 <span className="text-xl font-medium">kg AU 99.99%</span></p>
                <div className="mt-5 flex items-center justify-between text-sm"><span className="text-soft-white/60">Reserve ratio</span><span className="font-semibold text-prosperity">100.00%</span></div>
                <Progress value={100} className="mt-2 h-2 bg-navy-900 [&>div]:bg-gold" />
              </div>
              <Metric label="Circulating Supply" value="1,247,300" suffix="G-TOKEN" icon={<Gem className="size-4" />} />
              <Metric label="Last Update" value="2 minutes ago" icon={<Clock3 className="size-4" />} />
              <div className="rounded-xl border border-soft-white/10 bg-navy-900/40 p-4 md:col-span-2">
                <div className="flex items-center justify-between"><span className="text-sm text-soft-white/60">Chainlink Feed Address</span><Button variant="ghost" size="sm" onClick={copyFeed} className="text-gold hover:bg-gold/10 hover:text-gold"><Copy className="mr-2 size-4" />{copied ? "Copied" : "Copy"}</Button></div>
                <div className="mt-2 flex items-center gap-2 font-mono text-sm text-soft-white/80"><span>{feedAddress}</span><a href="#" className="text-gold hover:text-gold-300" aria-label="Open Chainlink feed in explorer"><ExternalLink className="size-4" /></a></div>
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-2"><Button className="bg-gold text-navy-900 hover:bg-gold-300"><ExternalLink className="mr-2 size-4" />Verify on Chainlink</Button><Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10"><FileCheck2 className="mr-2 size-4" />View audit history</Button></div>
            </CardContent>
          </Card>

          <Card className="border-gold/25 bg-navy-800/60 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-gold">Custodian information</CardTitle><CardDescription className="text-soft-white/60">Physical gold custody and certifications.</CardDescription></CardHeader>
            <CardContent className="flex h-full flex-col gap-5">
              <div className="flex items-center gap-4 rounded-xl border border-soft-white/10 bg-navy-900/40 p-4"><div className="flex size-12 items-center justify-center rounded-xl bg-gold/15 text-gold"><ShieldCheck className="size-7" /></div><div><p className="font-semibold">PT Pegadaian (Persero)</p><p className="text-sm text-soft-white/55">Jakarta, Indonesia</p></div></div>
              <div className="space-y-3 text-sm"><InfoRow label="Vault location" value="Jakarta, Indonesia" /><InfoRow label="Purity standard" value="AU 99.99%" /><InfoRow label="Insurance" value="Fully insured" /></div>
              <div className="mt-auto flex flex-wrap gap-2"><Badge variant="outline" className="border-gold/25 text-gold">OJK regulated</Badge><Badge variant="outline" className="border-gold/25 text-gold">LBMA aligned</Badge></div>
              <Button variant="ghost" className="justify-between px-0 text-gold hover:bg-transparent hover:text-gold-300">About Pegadaian <ArrowUpRight className="size-4" /></Button>
            </CardContent>
          </Card>
        </section>

        <Card className="mt-6 border-gold/25 bg-navy-800/60 backdrop-blur-sm">
          <CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle className="text-gold">Reserve history</CardTitle><CardDescription className="text-soft-white/60">Reserve and circulating supply over the last 90 days.</CardDescription></div><Badge variant="outline" className="hidden border-soft-white/15 text-soft-white/60 sm:flex">90 days</Badge></div></CardHeader>
          <CardContent><ChartContainer config={{ reserve: { label: "Reserve (kg)", color: "var(--chart-1)" }, supply: { label: "Supply (kg equivalent)", color: "var(--chart-2)" } }} className="h-[280px] w-full"><AreaChart data={reserveHistory} accessibilityLayer><CartesianGrid vertical={false} stroke="rgba(255,255,255,.08)" /><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,.5)", fontSize: 12 }} /><YAxis hide domain={[1100, 1260]} /><ChartTooltip content={<ChartTooltipContent />} /><Area type="monotone" dataKey="reserve" stroke="var(--color-reserve)" fill="var(--color-reserve)" fillOpacity={0.12} strokeWidth={2} /><Area type="monotone" dataKey="supply" stroke="var(--color-supply)" fill="none" strokeDasharray="4 4" strokeWidth={2} /></AreaChart></ChartContainer></CardContent>
        </Card>

        <Card className="mt-6 border-gold/25 bg-navy-800/60 backdrop-blur-sm"><CardHeader><CardTitle className="text-gold">Audit reports</CardTitle><CardDescription className="text-soft-white/60">Independent reports anchored on-chain for public verification.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow className="border-soft-white/10 hover:bg-transparent"><TableHead className="text-soft-white/50">Date</TableHead><TableHead className="text-soft-white/50">Auditor</TableHead><TableHead className="text-soft-white/50">Report</TableHead><TableHead className="text-soft-white/50">Hash</TableHead><TableHead className="text-right text-soft-white/50">Action</TableHead></TableRow></TableHeader><TableBody>{audits.map((audit) => <TableRow key={audit.hash} className="border-soft-white/10"><TableCell>{audit.date}</TableCell><TableCell className="font-medium text-gold">{audit.auditor}</TableCell><TableCell className="text-soft-white/70">{audit.report}</TableCell><TableCell className="font-mono text-xs text-soft-white/55">{audit.hash}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" className="text-gold hover:bg-gold/10 hover:text-gold"><Download className="mr-2 size-4" />Download</Button></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>

        <Card className="mt-6 border-gold/25 bg-navy-800/60 backdrop-blur-sm"><CardHeader><CardTitle className="text-gold">Frequently asked questions</CardTitle></CardHeader><CardContent><Accordion type="single" collapsible>{[{ q: "Bagaimana Chainlink PoR bekerja?", a: "Chainlink menyampaikan data reserve yang telah diverifikasi ke blockchain, sehingga rasio reserve dapat diperiksa tanpa bergantung pada laporan internal." }, { q: "Apa yang terjadi jika reserve lebih kecil dari supply?", a: "Status reserve akan berubah dan aktivitas minting baru dihentikan sampai rasio kembali memenuhi standar backing." }, { q: "Siapa yang mengaudit?", a: "Audit fisik dan attestation dilakukan oleh auditor independen seperti PwC Indonesia dan Ernst & Young." }].map((item, index) => <AccordionItem key={item.q} value={`item-${index}`} className="border-soft-white/10"><AccordionTrigger className="text-left hover:no-underline">{item.q}</AccordionTrigger><AccordionContent className="text-soft-white/65">{item.a}</AccordionContent></AccordionItem>)}</Accordion></CardContent></Card>
      </div>
    </main>
  )
}

function Metric({ label, value, suffix, icon }: { label: string; value: string; suffix?: string; icon: ReactNode }) { return <div className="rounded-xl border border-soft-white/10 bg-navy-900/40 p-4"><div className="flex items-center gap-2 text-sm text-soft-white/60">{icon}{label}</div><p className="mt-2 text-xl font-semibold">{value} <span className="text-xs font-normal text-soft-white/50">{suffix}</span></p></div> }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-soft-white/10 pb-3"><span className="text-soft-white/55">{label}</span><span className="font-medium">{value}</span></div> }

