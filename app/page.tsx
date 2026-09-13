"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Coins,
  ExternalLink,
  Eye,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  { icon: BadgeCheck, title: "Verify your identity", description: "Complete KYC/AML in under five minutes and create your ONCHAINID." },
  { icon: WalletCards, title: "Buy G-Token", description: "Deposit IDR or USDC and receive G-Token 1:1 with physical gold grams." },
  { icon: Landmark, title: "Trade or redeem", description: "Sell anytime or exchange your G-Tokens for physical gold at Pegadaian outlets." },
]

const values = [
  { icon: ShieldCheck, title: "Compliance embedded", description: "ERC-3643 with ONCHAINID keeps KYC and AML controls active on every transfer." },
  { icon: Eye, title: "Proof of Reserve, real-time", description: "Verify reserves 24/7 through an on-chain Chainlink feed instead of waiting for an annual audit." },
  { icon: Sparkles, title: "Transparent fees", description: "A 1–2% spread from XAU spot pricing with no hidden storage or platform fees." },
  { icon: Landmark, title: "Physical redemption", description: "Exchange G-Tokens for gold bars at more than 4,000 Pegadaian outlets." },
]

const faqs = [
  ["What is G-Token and how is it backed?", "Each G-Token represents one gram of 99.99% physical gold held by the Pegadaian vault custodian."],
  ["How can I verify the reserve?", "Open the Proof of Reserve dashboard to review the latest reserve, circulating supply, custodian, and Chainlink verification timestamp."],
  ["What happens if the custodian fails?", "Assets remain segregated under the custody framework, with reserve reporting and redemption processes designed to keep backing transparent."],
  ["How do I redeem physical gold?", "Choose a Pegadaian pickup outlet, enter the amount, generate a redemption code, and bring valid identification when collecting your gold."],
  ["Is AuriX registered with OJK?", "AuriX is presented as an OJK Sandbox initiative. Regulatory status and product availability depend on the applicable program and jurisdiction."],
  ["How much does a transaction cost?", "AuriX displays the applicable spread and any processing fee before you confirm a transaction."],
]

const comparisonRows = [
  ["Buy / sell spread", "1–2%", "5–10%", "0.5% + broker fee", "3–8%"],
  ["Storage", "0%", "Rp 50k / month", "0.4% / year", "0.5–2% / year"],
  ["Liquidity", "Instant, 24/7", "Business days", "Market hours", "Limited"],
  ["Physical redemption", "Yes, Pegadaian", "—", "No", "Rarely"],
  ["Proof of Reserve", "On-chain", "—", "Annual audit", "Quarterly audit"],
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-gold/10 px-4 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(255,215,0,0.14),transparent_32%),radial-gradient(circle_at_15%_30%,rgba(21,184,145,0.08),transparent_28%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold"><CheckCircle2 className="h-3.5 w-3.5" />Backed by physical gold</div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-soft-white md:text-7xl">Physical gold.<br /><span className="text-gold">Verified on-chain.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-soft-white/65 md:text-lg">Buy, sell, and stake 99.99% gold stored in Pegadaian vaults. Every G-Token is backed 1:1 by physical gold with real-time Proof of Reserve via Chainlink.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/swap"><Button size="lg" className="bg-gold font-semibold text-navy-900 hover:bg-gold-600">Start investing <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/vault"><Button size="lg" variant="outline" className="border-gold/35 bg-transparent text-gold hover:bg-gold/10">View Proof of Reserve <ExternalLink className="ml-2 h-4 w-4" /></Button></Link></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-soft-white/45"><span>OJK Sandbox</span><span>LBMA Good Delivery</span><span>Chainlink Verified</span><span>ERC-3643</span><span>CertiK Audited</span></div>
          </div>
          <Card className="border-gold/20 bg-navy-800/70 shadow-2xl shadow-gold/5 backdrop-blur-xl"><CardContent className="p-5 md:p-7"><div className="mb-6 flex items-start justify-between"><div><p className="text-xs text-soft-white/45">G-TOKEN / IDR</p><p className="mt-1 text-3xl font-semibold text-soft-white">Rp 1.245.000</p><p className="mt-1 text-xs text-prosperity">+2.84% this week</p></div><div className="rounded-lg bg-gold/10 p-2.5 text-gold"><Coins className="h-5 w-5" /></div></div><div className="mb-6 h-20 w-full overflow-hidden rounded-lg bg-gradient-to-b from-gold/10 to-transparent"><svg viewBox="0 0 500 90" className="h-full w-full" preserveAspectRatio="none"><path d="M0 75 C40 60 55 68 90 52 S150 60 185 32 S250 48 290 30 S350 38 385 17 S440 27 500 5" fill="none" stroke="#FFD700" strokeWidth="3" /></svg></div><div className="grid grid-cols-2 gap-3"><Stat label="Total reserve" value="1,247.3 kg" /><Stat label="Circulating supply" value="1,247,300" /><Stat label="Proof of Reserve" value="Verified 2m ago" good /><Stat label="Reserve ratio" value="100.00%" good /></div><div className="mt-5"><div className="mb-2 flex justify-between text-xs text-soft-white/50"><span>Reserve coverage</span><span className="text-gold">100%</span></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 w-full rounded-full bg-gold" /></div></div></CardContent></Card>
        </div>
      </section>

      <section className="px-4 py-20 md:py-28"><SectionHeading eyebrow="Simple by design" title="From identity to ownership in three steps" /><div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">{steps.map((step, index) => <Card key={step.title} className="relative border-white/10 bg-white/[0.035]"><CardContent className="p-6"><div className="mb-8 flex items-center justify-between"><div className="rounded-xl bg-gold/10 p-3 text-gold"><step.icon className="h-6 w-6" /></div><span className="text-5xl font-semibold text-white/5">0{index + 1}</span></div><h3 className="text-lg font-semibold text-soft-white">{step.title}</h3><p className="mt-3 text-sm leading-6 text-soft-white/55">{step.description}</p></CardContent></Card>)}</div></section>

      <section className="border-y border-white/5 bg-navy-900/40 px-4 py-20 md:py-28"><SectionHeading eyebrow="Why AuriX" title="Gold ownership with modern rails" /><div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2">{values.map((value) => <Card key={value.title} className="border-gold/10 bg-navy-800/45"><CardContent className="flex gap-4 p-6"><div className="shrink-0 rounded-xl bg-gold/10 p-3 text-gold"><value.icon className="h-5 w-5" /></div><div><h3 className="font-semibold text-soft-white">{value.title}</h3><p className="mt-2 text-sm leading-6 text-soft-white/55">{value.description}</p></div></CardContent></Card>)}</div></section>

      <section className="px-4 py-20 md:py-28"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.85fr_1.15fr]"><div><SectionHeading eyebrow="Live transparency" title="See the backing behind every token" align="left" /><p className="mt-5 text-sm leading-6 text-soft-white/55">AuriX makes reserve data readable, timely, and verifiable. Review the vault snapshot and follow the on-chain feed.</p><Link href="/vault" className="mt-6 inline-flex items-center text-sm font-medium text-gold">Open reserve dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link></div><Card className="border-prosperity/20 bg-prosperity/[0.06]"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-xs text-soft-white/45">LATEST RESERVE SNAPSHOT</p><p className="mt-2 text-3xl font-semibold text-soft-white">1,247.3 kg</p></div><div className="flex items-center gap-2 text-xs text-prosperity"><CheckCircle2 className="h-4 w-4" />Verified 2 minutes ago</div></div><div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-sm"><div><p className="text-soft-white/45">Custodian</p><p className="mt-1 text-soft-white">Pegadaian Vault</p></div><div><p className="text-soft-white/45">Reserve ratio</p><p className="mt-1 text-prosperity">100.00%</p></div></div></CardContent></Card></div></section>

      <section className="border-y border-white/5 bg-navy-900/40 px-4 py-20 md:py-28"><SectionHeading eyebrow="Transparent economics" title="A clearer way to own gold" /><div className="mx-auto mt-10 max-w-6xl overflow-x-auto rounded-xl border border-white/10"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-soft-white/45"><tr>{["", "AuriX", "Physical gold", "Gold ETF", "Other digital gold"].map((heading) => <th key={heading} className="px-5 py-4">{heading}</th>)}</tr></thead><tbody>{comparisonRows.map((row) => <tr key={row[0]} className="border-t border-white/5"><th className="px-5 py-4 font-medium text-soft-white/75">{row[0]}</th>{row.slice(1).map((cell, index) => <td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index === 0 ? "font-semibold text-gold" : "text-soft-white/55"}`}>{cell}</td>)}</tr>)}</tbody></table></div></section>

      <section className="px-4 py-20 md:py-28"><SectionHeading eyebrow="Trusted ecosystem" title="Built with accountable partners" /><div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">{["Pegadaian", "Chainlink", "CertiK", "OJK Sandbox"].map((partner) => <div key={partner} className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm font-semibold text-soft-white/65">{partner}</div>)}</div></section>

      <section className="border-t border-white/5 px-4 py-20 md:py-28"><SectionHeading eyebrow="Need to know" title="Frequently asked questions" /><div className="mx-auto mt-10 max-w-3xl divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.025] px-6">{faqs.map(([question, answer], index) => <div key={question}><button className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium text-soft-white" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>{question}<ChevronDown className={`h-4 w-4 shrink-0 text-gold transition-transform ${openFaq === index ? "rotate-180" : ""}`} /></button>{openFaq === index && <p className="pb-5 pr-8 text-sm leading-6 text-soft-white/55">{answer}</p>}</div>)}</div></section>

      <section className="px-4 pb-24 pt-4"><div className="mx-auto max-w-6xl rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/15 via-navy-800/70 to-prosperity/10 px-6 py-14 text-center md:px-12"><LockKeyhole className="mx-auto h-8 w-8 text-gold" /><h2 className="mt-5 text-3xl font-semibold text-soft-white md:text-4xl">Ready to own verifiable gold?</h2><p className="mx-auto mt-4 max-w-xl text-sm text-soft-white/60">Start with a token backed by a real reserve, a transparent custodian, and infrastructure built for trust.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/swap"><Button size="lg" className="bg-gold font-semibold text-navy-900 hover:bg-gold-600">Start now <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/redemption"><Button size="lg" variant="outline" className="border-white/20 bg-transparent text-soft-white hover:bg-white/10">Talk to the team</Button></Link></div></div></section>
    </main>
  )
}

function Stat({ label, value, good = false }: { label: string; value: string; good?: boolean }) { return <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><p className="text-[10px] uppercase tracking-wide text-soft-white/40">{label}</p><p className={`mt-1 text-sm font-semibold ${good ? "text-prosperity" : "text-soft-white"}`}>{value}</p></div> }

function SectionHeading({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) { return <div className={`${align === "center" ? "mx-auto text-center" : "text-left"} max-w-2xl`}><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-soft-white md:text-5xl">{title}</h2></div> }
