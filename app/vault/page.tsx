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

export default function VaultPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-soft-white mb-2">{t("vault.title")}</h1>
          <p className="text-soft-white/70">{t("vault.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Current Holdings */}
          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                {t("vault.goldReserveTitle")}
              </CardTitle>
              <CardDescription className="text-soft-white/70">{t("vault.liveGoldReserves")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-gold">2,847.5 kg</div>
                  <div className="text-sm text-soft-white/70">{t("vault.physicalGold")}</div>
                </div>
                <div className="text-center p-4 bg-gold/10 rounded-lg">
                  <div className="text-2xl font-bold text-gold">$185.2M</div>
                  <div className="text-sm text-soft-white/70">{t("vault.usdValue")}</div>
                </div>
              </div>

              <div className="text-center p-4 bg-prosperity/10 rounded-lg">
                <div className="text-2xl font-bold text-prosperity">₹2.47B</div>
                <div className="text-sm text-soft-white/70">{t("vault.idxValue")}</div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-soft-white/70">{t("vault.vaultLocation")}:</span>
                <span className="text-gold">Jakarta Secure Storage</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-soft-white/70">{t("vault.insuranceCoverage")}:</span>
                <span className="text-prosperity">$200M Lloyd's of London</span>
              </div>
            </CardContent>
          </Card>

          {/* Proof of Reserve */}
          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {t("vault.proofOfReserve")}
              </CardTitle>
              <CardDescription className="text-soft-white/70">{t("vault.cryptographicProof")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-prosperity/20 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-prosperity" />
                </div>
                <div className="text-lg font-semibold text-prosperity">{t("vault.reserveRatio")}</div>
                <div className="text-sm text-soft-white/70">{t("vault.allTokensFullyBacked")}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-soft-white/70">{t("vault.tokensIssued")}:</span>
                  <span className="text-gold font-mono">2,847,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-soft-white/70">{t("vault.goldReserved")}:</span>
                  <span className="text-gold font-mono">2,847.5 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-soft-white/70">{t("vault.title")}:</span>
                  <Badge className="bg-prosperity/20 text-prosperity border-prosperity/30">
                    {t("vault.perfectMatch")}
                  </Badge>
                </div>
              </div>

              <Button className="w-full bg-gold hover:bg-gold-600 text-navy-900 font-semibold">
                <FileText className="h-4 w-4 mr-2" />
                {t("vault.viewFullReport")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Audit Trail */}
        <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {t("vault.auditTrail")}
            </CardTitle>
            <CardDescription className="text-soft-white/70">{t("vault.auditHistory")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditTrail.map((audit, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-navy-900/50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-prosperity/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-prosperity" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-soft-white">
                          {audit.type === "monthly" ? t("vault.monthlyAudit") : t("vault.quarterlyReview")}
                        </p>
                        <p className="text-sm text-soft-white/70">
                          {audit.date} • {t("vault.auditedBy")}: {audit.auditor}
                        </p>
                      </div>
                      <Badge className="bg-prosperity/20 text-prosperity border-prosperity/30">
                        {t("vault.verified")}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-center space-x-2 text-xs text-soft-white/50">
                      <Hash className="h-3 w-3" />
                      <span className="font-mono">{audit.hash}</span>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-gold hover:text-gold-600">
                        Verify
                      </Button>
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
