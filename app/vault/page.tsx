"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, CheckCircle, Clock, Hash } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const auditTrail = [
  {
    date: "15 Des, 2024",
    type: "monthly",
    status: "Verified",
    hash: "0x7f9a...8b2c",
    auditor: "PwC Indonesia",
  },
  {
    date: "15 Nov, 2024",
    type: "monthly",
    status: "Verified",
    hash: "0x3e4f...9d1a",
    auditor: "PwC Indonesia",
  },
  {
    date: "15 Okt, 2024",
    type: "quarterly",
    status: "Verified",
    hash: "0x8c2b...4f7e",
    auditor: "Ernst & Young",
  },
  {
    date: "15 Sep, 2024",
    type: "monthly",
    status: "Verified",
    hash: "0x1a9c...6e3d",
    auditor: "PwC Indonesia",
  },
]

const cardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"

export default function VaultPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-soft-white/50">Aurix Vault</p>
            <h1 className="text-4xl font-bold text-soft-white md:text-5xl">{t("vault.title")}</h1>
            <p className="max-w-2xl text-soft-white/50">{t("vault.subtitle")}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-prosperity/20 bg-prosperity/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-soft-white/50">{t("vault.reserveRatio")}</p>
              <p className="mt-2 text-2xl font-bold text-prosperity">100%</p>
            </div>
            <div className="rounded-2xl border border-gold/20 bg-gold/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-soft-white/50">{t("vault.physicalGold")}</p>
              <p className="mt-2 text-2xl font-bold text-gold">2,847.5 kg</p>
            </div>
            <div className="rounded-2xl border border-soft-white/10 bg-navy-900/50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-soft-white/50">{t("vault.insuranceCoverage")}</p>
              <p className="mt-2 text-lg font-bold text-soft-white">$200M</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className={cardClass}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
                <Shield className="h-5 w-5 text-gold" />
                {t("vault.goldReserveTitle")}
              </CardTitle>
              <CardDescription className="text-soft-white/50">{t("vault.liveGoldReserves")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gold/15 bg-gold/10 p-5">
                  <p className="text-sm text-soft-white/50">{t("vault.physicalGold")}</p>
                  <div className="mt-3 text-3xl font-bold text-soft-white">2,847.5 kg</div>
                </div>
                <div className="rounded-2xl border border-gold/15 bg-gold/10 p-5">
                  <p className="text-sm text-soft-white/50">{t("vault.usdValue")}</p>
                  <div className="mt-3 text-3xl font-bold text-gold">$185.2M</div>
                </div>
              </div>

              <div className="rounded-2xl border border-prosperity/15 bg-prosperity/10 p-5">
                <p className="text-sm text-soft-white/50">{t("vault.idxValue")}</p>
                <div className="mt-3 text-3xl font-bold text-prosperity">₹2.47B</div>
              </div>

              <div className="space-y-3 rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-soft-white/50">{t("vault.vaultLocation")}:</span>
                  <span className="text-right font-medium text-gold">Jakarta Secure Storage</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-soft-white/50">{t("vault.insuranceCoverage")}:</span>
                  <span className="text-right font-medium text-prosperity">$200M Lloyd&apos;s of London</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
                <CheckCircle className="h-5 w-5 text-gold" />
                {t("vault.proofOfReserve")}
              </CardTitle>
              <CardDescription className="text-soft-white/50">{t("vault.cryptographicProof")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-prosperity/20 bg-gradient-to-br from-prosperity/15 to-transparent p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-prosperity/15">
                    <Shield className="h-8 w-8 text-prosperity" />
                  </div>
                  <div>
                    <p className="text-sm text-soft-white/50">{t("vault.reserveRatio")}</p>
                    <div className="text-4xl font-bold text-prosperity">100%</div>
                    <p className="text-sm text-soft-white/50">{t("vault.allTokensFullyBacked")}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-4">
                  <p className="text-sm text-soft-white/50">{t("vault.tokensIssued")}</p>
                  <p className="mt-2 font-mono text-xl font-bold text-gold">2,847,500</p>
                </div>
                <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-4">
                  <p className="text-sm text-soft-white/50">{t("vault.goldReserved")}</p>
                  <p className="mt-2 font-mono text-xl font-bold text-gold">2,847.5 kg</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-prosperity/15 bg-prosperity/10 p-4">
                <div>
                  <p className="text-sm text-soft-white/50">{t("vault.title")}</p>
                  <p className="mt-1 text-lg font-bold text-soft-white">{t("vault.perfectMatch")}</p>
                </div>
                <Badge className="border border-prosperity/30 bg-prosperity/20 text-prosperity">{t("vault.perfectMatch")}</Badge>
              </div>

              <Button className="h-12 w-full rounded-xl bg-gold font-semibold text-navy-900 hover:bg-gold-600">
                <FileText className="mr-2 h-4 w-4" />
                {t("vault.viewFullReport")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className={`${cardClass} mt-8`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
              <Clock className="h-5 w-5 text-gold" />
              {t("vault.auditTrail")}
            </CardTitle>
            <CardDescription className="text-soft-white/50">{t("vault.auditHistory")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditTrail.map((audit, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5 hover:border-gold/20 transition-all duration-300"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-4 lg:w-[260px]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-prosperity/15">
                        <CheckCircle className="h-6 w-6 text-prosperity" />
                      </div>
                      <div>
                        <p className="text-soft-white font-bold">
                          {audit.type === "monthly" ? t("vault.monthlyAudit") : t("vault.quarterlyReview")}
                        </p>
                        <p className="text-sm text-soft-white/50">{audit.date}</p>
                      </div>
                    </div>

                    <div className="grid flex-1 gap-4 md:grid-cols-[1.2fr_1fr_auto] md:items-center">
                      <div>
                        <p className="text-sm text-soft-white/50">{t("vault.auditedBy")}</p>
                        <p className="font-medium text-soft-white">{audit.auditor}</p>
                      </div>

                      <div>
                        <p className="mb-1 text-sm text-soft-white/50">Blockchain Hash</p>
                        <div className="flex items-center gap-2 text-xs text-soft-white/50">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="font-mono">{audit.hash}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className="border border-prosperity/30 bg-prosperity/20 text-prosperity">
                          {t("vault.verified")}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 rounded-xl px-4 text-gold hover:bg-gold/10 hover:text-gold"
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
