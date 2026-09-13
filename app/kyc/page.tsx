"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, FileCheck2, IdCard, ShieldCheck, Upload, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const steps = ["Data Pribadi", "Dokumen", "Liveness", "Verifikasi", "Selesai"]
const tiers = [
  { name: "Retail", limit: "Rp 100 juta/bulan", benefit: "Akses trading dasar", active: true },
  { name: "Accredited", limit: "Rp 1 miliar/bulan", benefit: "Limit lebih tinggi & OTC", active: false },
  { name: "Institutional", limit: "Sesuai kebutuhan", benefit: "Settlement dan reporting institusi", active: false },
]

export default function KycPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const nextStep = () => {
    if (step === steps.length - 2) setSubmitted(true)
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <Badge className="mb-4 border-gold/30 bg-gold/10 text-gold">Identity verification</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-soft-white md:text-5xl">KYC Center</h1>
          <p className="mt-3 text-soft-white/65">Lengkapi verifikasi identitas untuk membuka seluruh fitur AuriX Finance dengan aman.</p>
        </div>

        <div className="mb-8 overflow-x-auto rounded-2xl border border-gold/15 bg-navy-800/40 p-4 backdrop-blur-sm">
          <div className="flex min-w-[680px] items-center justify-between gap-3">
            {steps.map((label, index) => (
              <div key={label} className="flex flex-1 items-center gap-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${index <= step ? "border-gold bg-gold text-navy-900" : "border-soft-white/20 text-soft-white/45"}`}>
                  {index < step ? <Check className="size-4" /> : index + 1}
                </div>
                <span className={index <= step ? "text-sm font-medium text-gold" : "text-sm text-soft-white/45"}>{label}</span>
                {index < steps.length - 1 && <div className={`h-px flex-1 ${index < step ? "bg-gold/70" : "bg-soft-white/15"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="border-gold/20 bg-navy-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold">{steps[step]}</CardTitle>
              <CardDescription className="text-soft-white/60">
                {step === 0 && "Masukkan data sesuai dokumen identitas resmi Anda."}
                {step === 1 && "Unggah dokumen yang jelas dan masih berlaku."}
                {step === 2 && "Pastikan wajah terlihat jelas saat mengikuti instruksi."}
                {step === 3 && "Data Anda sedang ditinjau oleh tim verifikasi."}
                {step === 4 && "Identitas Anda sudah berhasil diverifikasi."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {step === 0 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2"><Label htmlFor="name">Nama lengkap sesuai KTP</Label><Input id="name" placeholder="Nama lengkap" /></div>
                  <div className="space-y-2"><Label htmlFor="nik">NIK</Label><Input id="nik" inputMode="numeric" maxLength={16} placeholder="16 digit NIK" /></div>
                  <div className="space-y-2"><Label htmlFor="birth">Tanggal lahir</Label><Input id="birth" type="date" /></div>
                  <div className="space-y-2 sm:col-span-2"><Label htmlFor="address">Alamat domisili</Label><Textarea id="address" placeholder="Alamat lengkap" /></div>
                  <div className="space-y-2"><Label htmlFor="job">Pekerjaan</Label><Input id="job" placeholder="Pekerjaan" /></div>
                  <div className="space-y-2"><Label htmlFor="funds">Sumber dana</Label><Input id="funds" placeholder="Contoh: gaji, bisnis" /></div>
                </div>
              )}
              {step === 1 && <div className="grid gap-4 sm:grid-cols-3">{[{ icon: IdCard, title: "KTP", detail: "OCR otomatis" }, { icon: Video, title: "Selfie dengan KTP", detail: "Foto terbaru" }, { icon: FileCheck2, title: "NPWP", detail: "Opsional untuk upgrade" }].map(({ icon: Icon, title, detail }) => <button type="button" key={title} className="group rounded-xl border border-dashed border-gold/25 bg-navy-900/50 p-5 text-left transition-colors hover:border-gold/60 hover:bg-gold/5"><Icon className="mb-8 size-6 text-gold" /><span className="block font-medium text-soft-white">Upload {title}</span><span className="mt-1 block text-sm text-soft-white/50">{detail}</span><Upload className="mt-5 size-4 text-soft-white/40 transition-colors group-hover:text-gold" /></button>)}</div>}
              {step === 2 && <div className="rounded-2xl border border-gold/20 bg-navy-900/50 p-8 text-center"><div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-gold/10"><Video className="size-9 text-gold" /></div><h3 className="text-xl font-semibold text-soft-white">Video selfie 5 detik</h3><p className="mx-auto mt-2 max-w-md text-sm text-soft-white/60">Kedipkan mata, tengok kanan, lalu tengok kiri. Pastikan pencahayaan cukup.</p><Button className="mt-6 bg-gold font-semibold text-navy-900 hover:bg-gold/90">Mulai liveness check</Button></div>}
              {step === 3 && <div className="rounded-2xl border border-gold/20 bg-gold/5 p-7 text-center"><ShieldCheck className="mx-auto size-12 text-gold" /><h3 className="mt-4 text-xl font-semibold text-soft-white">Processing...</h3><p className="mt-2 text-sm text-soft-white/60">Estimasi selesai dalam 5 menit. Kami akan mengirim notifikasi melalui email dan aplikasi.</p></div>}
              {step === 4 && <div className="rounded-2xl border border-prosperity/30 bg-prosperity/10 p-7 text-center"><Check className="mx-auto size-12 rounded-full bg-prosperity p-2 text-navy-900" /><h3 className="mt-4 text-xl font-semibold text-soft-white">Verifikasi selesai</h3><p className="mt-2 text-sm text-soft-white/60">ONCHAINID Anda sudah aktif dan siap digunakan.</p><div className="mx-auto mt-5 max-w-sm rounded-lg bg-navy-900/60 px-4 py-3 font-mono text-sm text-gold">0x8a31...4f92</div><Button asChild className="mt-6 bg-gold font-semibold text-navy-900 hover:bg-gold/90"><Link href="/swap">Mulai trading <ArrowRight data-icon="inline-end" /></Link></Button></div>}
              {step < 4 && <div className="flex justify-end"><Button onClick={nextStep} className="bg-gold font-semibold text-navy-900 hover:bg-gold/90">{step === 3 ? "Kirim untuk verifikasi" : "Lanjutkan"}<ArrowRight data-icon="inline-end" /></Button></div>}
              {submitted && <p className="text-right text-xs text-soft-white/45">Data tersimpan sebagai simulasi. Integrasi verifikasi dapat dihubungkan kemudian.</p>}
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-navy-800/50 backdrop-blur-sm">
            <CardHeader><CardTitle className="text-gold">Tier upgrade</CardTitle><CardDescription className="text-soft-white/60">Tingkatkan limit sesuai kebutuhan aktivitas Anda.</CardDescription></CardHeader>
            <CardContent className="space-y-3">{tiers.map((tier, index) => <div key={tier.name} className={`rounded-xl border p-4 ${tier.active ? "border-gold/50 bg-gold/10" : "border-soft-white/10 bg-navy-900/40"}`}><div className="flex items-center justify-between"><span className="font-semibold text-soft-white">{tier.name}</span>{tier.active && <Badge className="border-gold/30 bg-gold/15 text-gold">Current</Badge>}</div><p className="mt-2 text-sm text-gold">{tier.limit}</p><p className="mt-1 text-xs text-soft-white/55">{tier.benefit}</p>{index < tiers.length - 1 && <p className="mt-3 text-xs text-soft-white/40">Syarat: verifikasi tier sebelumnya dan source of funds.</p>}</div>)}</CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
