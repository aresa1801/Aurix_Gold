"use client"

import { useMemo, useState, type ReactNode } from "react"
import { AlertCircle, ArrowRight, CalendarDays, Check, Clock3, Coins, FileText, MapPin, Package, QrCode, ShieldCheck, Truck, WalletCards } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const spotPrice = 1_245_000
const outlets = [
  { id: "central-jakarta", name: "Pegadaian Senen", address: "Jl. Kramat Raya No. 162, Jakarta Pusat" },
  { id: "thamrin", name: "Pegadaian Thamrin", address: "Jl. M.H. Thamrin No. 24, Jakarta Pusat" },
  { id: "sudirman", name: "Pegadaian Sudirman", address: "Jl. Jenderal Sudirman Kav. 45, Jakarta Selatan" },
  { id: "surabaya", name: "Pegadaian Basuki Rahmat", address: "Jl. Basuki Rahmat No. 75, Surabaya" },
]
const formats = [
  { id: "10g", label: "Batangan 10g", min: 10 },
  { id: "50g", label: "Batangan 50g", min: 50 },
  { id: "100g", label: "Batangan 100g", min: 100 },
  { id: "dinar", label: "Gold Dinar", min: 1 },
]
const history = [
  { id: "RDM-240821", date: "21 Agu 2026", type: "Fisik · 10g", amount: "10 G-TOKEN", status: "Completed" },
  { id: "RDM-240715", date: "15 Jul 2026", type: "Cash", amount: "5 G-TOKEN", status: "Processing" },
  { id: "RDM-240602", date: "02 Jun 2026", type: "Fisik · Dinar", amount: "1 G-TOKEN", status: "Shipped" },
]

function Money({ value }: { value: number }) {
  return <span>Rp {value.toLocaleString("id-ID")}</span>
}

export default function RedemptionPage() {
  const [cashAmount, setCashAmount] = useState("")
  const [physicalAmount, setPhysicalAmount] = useState("")
  const [outlet, setOutlet] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [format, setFormat] = useState("")
  const [institutionalAmount, setInstitutionalAmount] = useState("")
  const [ticket, setTicket] = useState(false)
  const todayPlusThree = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 3)
    return date.toISOString().split("T")[0]
  }, [])
  const cashEstimate = Number(cashAmount || 0) * spotPrice * 0.995
  const physicalEstimate = Number(physicalAmount || 0) * spotPrice * 0.99 + 50000
  const selectedFormat = formats.find((item) => item.id === format)
  const physicalValid = Number(physicalAmount) >= (selectedFormat?.min ?? 10)

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 border-b border-gold/15 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-gold/30 text-gold">AURIX REDEMPTION CENTER</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-soft-white sm:text-4xl">Redeem your G-TOKEN</h1>
            <p className="mt-2 max-w-2xl text-soft-white/65">Tukarkan token emas digital Anda menjadi uang tunai, emas fisik, atau pengiriman institusional.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-prosperity/20 bg-prosperity/10 px-4 py-3 text-sm text-prosperity"><ShieldCheck className="h-4 w-4" /> KYC verified · 125.50 G-TOKEN tersedia</div>
        </header>

        <Tabs defaultValue="cash" className="space-y-6">
          <TabsList className="grid h-auto w-full max-w-3xl grid-cols-4 gap-1 bg-navy-900/60 p-1">
            <TabsTrigger value="cash" className="gap-2 py-3"><WalletCards className="hidden h-4 w-4 sm:block" />Cash Redemption</TabsTrigger>
            <TabsTrigger value="physical" className="gap-2 py-3"><Package className="hidden h-4 w-4 sm:block" />Physical Redemption</TabsTrigger>
            <TabsTrigger value="institutional" className="gap-2 py-3"><Truck className="hidden h-4 w-4 sm:block" />Institutional</TabsTrigger>
            <TabsTrigger value="history" className="gap-2 py-3"><FileText className="hidden h-4 w-4 sm:block" />History</TabsTrigger>
          </TabsList>

          <TabsContent value="cash" className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
            <Card className="border-gold/20 bg-navy-800/50"><CardHeader><CardTitle className="text-gold">Cash Redemption</CardTitle><CardDescription className="text-soft-white/60">Terima estimasi nilai rupiah langsung ke rekening bank yang telah diverifikasi.</CardDescription></CardHeader><CardContent className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label className="text-soft-white">Jumlah G-TOKEN</Label><Input type="number" min="1" placeholder="Minimal 1 gram" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} className="border-gold/20 bg-navy-900/70 text-soft-white" /><p className="text-xs text-soft-white/45">Saldo tersedia: 125.50 G-TOKEN</p></div><div className="space-y-2"><Label className="text-soft-white">Rekening penerima</Label><Select><SelectTrigger className="border-gold/20 bg-navy-900/70 text-soft-white"><SelectValue placeholder="Pilih rekening bank" /></SelectTrigger><SelectContent><SelectItem value="bca">BCA ···· 2841 · A. Pratama</SelectItem><SelectItem value="mandiri">Mandiri ···· 7702 · A. Pratama</SelectItem><SelectItem value="new">+ Tambah rekening baru</SelectItem></SelectContent></Select></div></div>
              <div className="rounded-2xl border border-gold/15 bg-gold/5 p-5"><div className="mb-4 flex items-center justify-between"><span className="text-sm text-soft-white/60">Estimasi diterima</span><Coins className="h-5 w-5 text-gold" /></div><p className="text-3xl font-semibold text-gold"><Money value={cashEstimate} /></p><div className="mt-4 grid grid-cols-3 gap-3 text-xs"><div><p className="text-soft-white/45">Harga spot</p><p className="mt-1 text-soft-white"><Money value={spotPrice} /></p></div><div><p className="text-soft-white/45">Spread</p><p className="mt-1 text-soft-white">0.50%</p></div><div><p className="text-soft-white/45">Waktu proses</p><p className="mt-1 text-soft-white">1–3 hari</p></div></div></div>
              <Button disabled={!cashAmount || Number(cashAmount) < 1} className="h-12 w-full bg-gold font-semibold text-navy-900 hover:bg-gold-600">Redeem to Cash <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </CardContent></Card>
            <InfoCard title="Cash redemption" icon={<WalletCards className="h-5 w-5 text-gold" />} items={["Harga final mengikuti harga spot saat transaksi dikonfirmasi.", "Spread 0.5% sudah termasuk dalam estimasi.", "Dana dikirim ke rekening yang lolos verifikasi KYC.", "Tidak ada biaya tersembunyi; semua biaya ditampilkan sebelum konfirmasi."]} />
          </TabsContent>

          <TabsContent value="physical" className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <Card className="border-gold/20 bg-navy-800/50"><CardHeader><CardTitle className="text-gold">Physical Redemption</CardTitle><CardDescription className="text-soft-white/60">Ambil emas fisik Anda di outlet Pegadaian pilihan. Minimal 10 gram.</CardDescription></CardHeader><CardContent className="space-y-6">
              <Alert className="border-gold/20 bg-gold/10"><AlertCircle className="h-4 w-4 text-gold" /><AlertDescription className="text-gold">Pickup tersedia mulai H+3 setelah tiket redemption dibuat.</AlertDescription></Alert>
              <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label className="text-soft-white">Jumlah G-TOKEN</Label><Input type="number" min="10" placeholder="Minimal 10 gram" value={physicalAmount} onChange={(e) => setPhysicalAmount(e.target.value)} className="border-gold/20 bg-navy-900/70 text-soft-white" /></div><div className="space-y-2"><Label className="text-soft-white">Format emas</Label><Select value={format} onValueChange={setFormat}><SelectTrigger className="border-gold/20 bg-navy-900/70 text-soft-white"><SelectValue placeholder="Pilih format emas" /></SelectTrigger><SelectContent>{formats.map((item) => <SelectItem key={item.id} value={item.id}>{item.label} · min. {item.min}g</SelectItem>)}</SelectContent></Select></div></div>
              <div className="space-y-2"><Label className="text-soft-white">Pilih outlet Pegadaian</Label><Select value={outlet} onValueChange={setOutlet}><SelectTrigger className="border-gold/20 bg-navy-900/70 text-soft-white"><SelectValue placeholder="Pilih lokasi pickup" /></SelectTrigger><SelectContent>{outlets.map((item) => <SelectItem key={item.id} value={item.id}>{item.name} · {item.address}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label className="text-soft-white">Tanggal pickup</Label><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gold" /><Input type="date" min={todayPlusThree} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="border-gold/20 bg-navy-900/70 pl-10 text-soft-white" /></div></div><div className="rounded-xl border border-gold/15 bg-navy-900/50 p-3 text-sm"><p className="text-soft-white/45">Estimasi biaya</p><p className="mt-1 font-medium text-soft-white">1% fee + <Money value={50000} /> biaya cetak</p><p className="mt-1 text-xs text-soft-white/45">Total estimasi: <Money value={physicalEstimate} /></p></div></div>
              <Button disabled={!physicalValid || !outlet || !pickupDate || !format} onClick={() => setTicket(true)} className="h-12 w-full bg-gold font-semibold text-navy-900 hover:bg-gold-600">Generate Redemption Ticket <QrCode className="ml-2 h-4 w-4" /></Button>
              {ticket && <div className="flex items-center gap-3 rounded-xl border border-prosperity/20 bg-prosperity/10 p-4 text-sm text-prosperity"><Check className="h-5 w-5" /> Tiket berhasil dibuat. Tunjukkan QR code saat pickup di outlet.</div>}
            </CardContent></Card>
            <div className="space-y-6"><Card className="overflow-hidden border-gold/20 bg-navy-800/50"><div className="relative h-56 bg-[radial-gradient(circle_at_30%_30%,rgba(219,181,77,.18),transparent_35%),linear-gradient(135deg,#171324,#0e1022)]"><div className="absolute inset-5 rounded-xl border border-gold/20 bg-gold/5"><div className="absolute left-1/4 top-1/3 h-3 w-3 rounded-full bg-gold shadow-[0_0_18px_rgba(219,181,77,.8)]" /><div className="absolute right-1/4 top-1/2 h-3 w-3 rounded-full bg-gold shadow-[0_0_18px_rgba(219,181,77,.8)]" /><div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-gold/30 bg-navy-900/80 px-3 py-1 text-xs text-gold"><MapPin className="mr-1 inline h-3 w-3" /> Jakarta & Surabaya</div></div></div><CardContent className="p-4"><p className="text-sm font-medium text-soft-white">Jaringan outlet pickup</p><p className="mt-1 text-xs text-soft-white/50">Pilih outlet terdekat dari daftar lokasi yang tersedia.</p></CardContent></Card><InfoCard title="Before you visit" icon={<Clock3 className="h-5 w-5 text-gold" />} items={["Bawa identitas pemerintah yang valid.", "Pastikan nama pada tiket sama dengan nama KYC.", "Tiket redemption berlaku selama 30 hari.", "Simpan QR code untuk proses verifikasi di outlet."]} /></div>
          </TabsContent>

          <TabsContent value="institutional" className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Card className="border-gold/20 bg-navy-800/50"><CardHeader><CardTitle className="text-gold">Institutional Redemption</CardTitle><CardDescription className="text-soft-white/60">Layanan khusus untuk penukaran minimal 1 kg dengan pengiriman terproteksi.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label className="text-soft-white">Jumlah G-TOKEN (gram)</Label><Input type="number" min="1000" placeholder="Minimal 1,000 gram" value={institutionalAmount} onChange={(e) => setInstitutionalAmount(e.target.value)} className="border-gold/20 bg-navy-900/70 text-soft-white" /></div><div className="space-y-2"><Label className="text-soft-white">Metode pengiriman</Label><Select><SelectTrigger className="border-gold/20 bg-navy-900/70 text-soft-white"><SelectValue placeholder="Pilih kurir" /></SelectTrigger><SelectContent><SelectItem value="g4s">G4S Secure Logistics</SelectItem><SelectItem value="loomis">Loomis International</SelectItem></SelectContent></Select></div></div><div className="space-y-2"><Label className="text-soft-white">Alamat pengiriman</Label><Input placeholder="Alamat lengkap perusahaan" className="border-gold/20 bg-navy-900/70 text-soft-white" /></div><div className="space-y-2"><Label className="text-soft-white">Kontak PIC</Label><Input placeholder="Nama dan nomor telepon PIC" className="border-gold/20 bg-navy-900/70 text-soft-white" /></div><Button disabled={Number(institutionalAmount) < 1000} className="h-12 w-full bg-gold font-semibold text-navy-900 hover:bg-gold-600">Ajukan Institutional Redemption <ArrowRight className="ml-2 h-4 w-4" /></Button></CardContent></Card><InfoCard title="Institutional terms" icon={<Truck className="h-5 w-5 text-gold" />} items={["Minimum redemption: 1 kilogram.", "Biaya layanan transparan: 0.3%.", "Estimasi pengiriman: 7–14 hari kerja.", "Pengiriman menggunakan layanan secure logistics."]} /></TabsContent>

          <TabsContent value="history"><Card className="border-gold/20 bg-navy-800/50"><CardHeader><CardTitle className="text-gold">Redemption History</CardTitle><CardDescription className="text-soft-white/60">Pantau status seluruh permintaan redemption Anda.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-gold/15 text-soft-white/45"><tr><th className="pb-3 font-medium">Ticket</th><th className="pb-3 font-medium">Tanggal</th><th className="pb-3 font-medium">Tipe</th><th className="pb-3 font-medium">Jumlah</th><th className="pb-3 font-medium">Status</th></tr></thead><tbody>{history.map((item) => <tr key={item.id} className="border-b border-white/5"><td className="py-4 font-mono text-gold">{item.id}</td><td className="py-4 text-soft-white/70">{item.date}</td><td className="py-4 text-soft-white">{item.type}</td><td className="py-4 text-soft-white/70">{item.amount}</td><td className="py-4"><Badge variant="outline" className={item.status === "Completed" ? "border-prosperity/30 text-prosperity" : "border-gold/30 text-gold"}>{item.status}</Badge></td></tr>)}</tbody></table></div><div className="mt-6 flex flex-wrap gap-3 text-xs text-soft-white/45"><span>Pending</span><ArrowRight className="h-3 w-3" /><span>Processing</span><ArrowRight className="h-3 w-3" /><span>Shipped</span><ArrowRight className="h-3 w-3" /><span>Completed</span></div></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function InfoCard({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return <Card className="h-fit border-gold/20 bg-navy-800/50"><CardHeader><CardTitle className="flex items-center gap-2 text-gold">{icon}{title}</CardTitle></CardHeader><CardContent className="space-y-4">{items.map((item) => <div key={item} className="flex items-start gap-3 text-sm text-soft-white/65"><Check className="mt-0.5 h-4 w-4 shrink-0 text-prosperity" />{item}</div>)}</CardContent></Card>
}

