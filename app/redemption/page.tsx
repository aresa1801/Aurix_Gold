"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, MapPin, AlertTriangle, CheckCircle, Send } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const pegadaianOutlets = [
  { id: "jkt001", name: "outlet.jakarta.pusat", address: "outlet.jakarta.pusat.address" },
  { id: "jkt002", name: "outlet.thamrin", address: "outlet.thamrin.address" },
  { id: "jkt003", name: "outlet.sudirman", address: "outlet.sudirman.address" },
  { id: "sby001", name: "outlet.surabaya", address: "outlet.surabaya.address" },
  { id: "bdg001", name: "outlet.bandung", address: "outlet.bandung.address" },
]

const cardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"

const steps = [
  { id: 1, icon: MapPin, titleKey: "redemption.visitOutlet", descriptionKey: "redemption.selectPickupLocation" },
  { id: 2, icon: QrCode, titleKey: "redemption.redemptionCode", descriptionKey: "redemption.generateRedemptionCode" },
  { id: 3, icon: CheckCircle, titleKey: "redemption.receiveGold", descriptionKey: "redemption.getPhysicalGold" },
]

export default function RedemptionPage() {
  const [amount, setAmount] = useState("")
  const [selectedOutlet, setSelectedOutlet] = useState("")
  const [showQR, setShowQR] = useState(false)
  const [redeemCode, setRedeemCode] = useState("")
  const { t } = useLanguage()

  const generateRedeemCode = () => {
    const code = "AUR" + Math.random().toString(36).substr(2, 9).toUpperCase()
    setRedeemCode(code)
    setShowQR(true)
  }

  const goldValue = amount ? (Number.parseFloat(amount) * 865.5).toFixed(2) : "0"
  const goldWeight = amount ? Number.parseFloat(amount).toFixed(6) : "0"

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-soft-white/50">Aurix Redemption</p>
          <h1 className="mt-2 text-4xl font-bold text-soft-white md:text-5xl">{t("redemption.title")}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-soft-white/50">{t("redemption.subtitle")}</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.35fr_1fr]">
          <div className="space-y-8">
            <Card className={cardClass}>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
                      <Send className="h-5 w-5 text-gold" />
                      {t("redemption.redeemTokens")}
                    </CardTitle>
                    <CardDescription className="mt-2 text-soft-white/50">{t("redemption.burnTokens")}</CardDescription>
                  </div>
                  <Badge className="border border-gold/20 bg-gold/10 text-gold">{t("redemption.requirements")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="rounded-2xl border-gold/20 bg-gold/10">
                  <AlertTriangle className="h-4 w-4 text-gold" />
                  <AlertDescription className="text-gold">{t("redemption.requiresKYC")}</AlertDescription>
                </Alert>

                <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-soft-white/50">{t("redemption.tokensToRedeem")}</Label>
                      <Input
                        type="number"
                        placeholder="0.000000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-12 rounded-xl border-soft-white/10 bg-navy-900/50 text-lg text-soft-white placeholder:text-soft-white/30"
                      />
                      <div className="text-sm text-soft-white/50">{t("redemption.available")}: 125.500000 G-TOKEN</div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-soft-white/50">{t("redemption.pegadaianOutlet")}</Label>
                      <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                        <SelectTrigger className="h-12 rounded-xl border-soft-white/10 bg-navy-900/50 text-soft-white">
                          <SelectValue placeholder={t("redemption.selectPickupLocation")} />
                        </SelectTrigger>
                        <SelectContent className="border-soft-white/10 bg-navy-800 text-soft-white">
                          {pegadaianOutlets.map((outlet) => (
                            <SelectItem key={outlet.id} value={outlet.id}>
                              <div>
                                <div className="font-medium">{t(outlet.name)}</div>
                                <div className="text-sm text-soft-white/50">{t(outlet.address)}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5">
                    <p className="text-sm text-soft-white/50">{t("redemption.redemptionDetails")}</p>
                    <div className="mt-5 space-y-4">
                      <div className="rounded-2xl border border-gold/10 bg-gold/10 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-soft-white/50">{t("redemption.goldWeight")}</p>
                        <p className="mt-2 text-3xl font-bold text-gold">
                          {goldWeight} <span className="text-base text-soft-white/50">{t("redemption.grams")}</span>
                        </p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-soft-white/50">{t("redemption.estimatedValue")}</span>
                        <span className="font-semibold text-prosperity">₹{goldValue} IDRX</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-soft-white/50">{t("redemption.processingFee")}</span>
                        <span className="text-soft-white">₹50 IDRX</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-soft-white/50">{t("redemption.minimumAmount")}</span>
                        <span className="text-soft-white">1.0 G-TOKEN</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="h-12 w-full rounded-xl bg-gold font-semibold text-navy-900 hover:bg-gold-600"
                  onClick={generateRedeemCode}
                  disabled={!amount || !selectedOutlet || Number.parseFloat(amount) <= 0}
                >
                  {t("redemption.generateRedemptionCode")}
                </Button>
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="text-soft-white font-bold">
                  {showQR ? t("redemption.redemptionCode") : t("redemption.howItWorks")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showQR ? (
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-6 text-center">
                      <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl bg-soft-white">
                        <div className="text-center">
                          <QrCode className="mx-auto mb-3 h-16 w-16 text-navy-900" />
                          <div className="text-xs font-mono text-navy-900">{redeemCode}</div>
                        </div>
                      </div>
                      <Badge className="mt-5 border border-prosperity/30 bg-prosperity/20 text-prosperity">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {t("redemption.codeGenerated")}
                      </Badge>
                      <div className="mt-5 rounded-2xl border border-gold/10 bg-gold/10 p-4">
                        <p className="text-sm text-soft-white/50">{t("redemption.redemptionCode")}</p>
                        <div className="mt-2 rounded-xl bg-navy-950/40 p-3 text-center font-mono text-lg text-gold">
                          {redeemCode}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          number: 1,
                          title: t("redemption.visitOutlet"),
                          description: t("redemption.bringValidID"),
                          active: true,
                        },
                        {
                          number: 2,
                          title: t("redemption.verificationProcess"),
                          description: t("redemption.staffWillVerify"),
                          active: true,
                        },
                        {
                          number: 3,
                          title: t("redemption.receiveGold"),
                          description: t("redemption.getPhysicalGold"),
                          active: false,
                        },
                      ].map((step) => (
                        <div
                          key={step.number}
                          className="flex gap-4 rounded-2xl border border-soft-white/5 bg-navy-900/50 p-4"
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              step.active ? "bg-gold text-navy-900" : "bg-soft-white/10 text-soft-white/50"
                            }`}
                          >
                            {step.number}
                          </div>
                          <div>
                            <p className="text-soft-white font-bold">{step.title}</p>
                            <p className="mt-1 text-sm text-soft-white/50">{step.description}</p>
                          </div>
                        </div>
                      ))}

                      <Alert className="rounded-2xl border-prosperity/20 bg-prosperity/10">
                        <CheckCircle className="h-4 w-4 text-prosperity" />
                        <AlertDescription className="text-prosperity">{t("redemption.codeValidFor")}</AlertDescription>
                      </Alert>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      {steps.map((step) => {
                        const Icon = step.icon

                        return (
                          <div key={step.id} className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/10">
                              <Icon className="h-5 w-5 text-gold" />
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-soft-white/50">
                                Step {step.id}
                              </span>
                            </div>
                            <h4 className="mt-2 text-soft-white font-bold">{t(step.titleKey)}</h4>
                            <p className="mt-2 text-sm text-soft-white/50">{t(step.descriptionKey)}</p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5">
                      <h4 className="text-soft-white font-bold">{t("redemption.requirements")}</h4>
                      <ul className="mt-4 space-y-2 text-sm text-soft-white/50">
                        <li>• Completed KYC verification</li>
                        <li>• Valid government-issued ID</li>
                        <li>• Minimum redemption: 1.0 G-TOKEN</li>
                        <li>• Processing fee: ₹50 IDRX</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className={cardClass}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
                    <CheckCircle className="h-5 w-5 text-prosperity" />
                    {t("redemption.redemptionDetails")}
                  </CardTitle>
                  <CardDescription className="mt-2 text-soft-white/50">{t("redemption.importantInformation")}</CardDescription>
                </div>
                <Badge className="border border-prosperity/20 bg-prosperity/10 text-prosperity">
                  {showQR ? t("redemption.codeGenerated") : t("redemption.processingTime")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5">
                <h4 className="text-soft-white font-bold">{t("redemption.exchangeProcess")}</h4>
                <ul className="mt-4 space-y-3 text-sm text-soft-white/50">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                    <span>{t("redemption.tokensAreBurned")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                    <span>{t("redemption.goldReleased")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                    <span>{t("redemption.availableForPickup")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                    <span>{t("redemption.formVerified")}</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-prosperity/20 bg-prosperity/10 p-5">
                <h4 className="text-prosperity font-bold">{t("redemption.quickFacts")}</h4>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-soft-white/50">{t("redemption.minimumAmount")}:</span>
                    <span className="text-prosperity">1.0 G-TOKEN</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-soft-white/50">{t("redemption.maximumAmount")}:</span>
                    <span className="text-prosperity">{t("redemption.unlimited")}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-soft-white/50">{t("redemption.processingTime")}:</span>
                    <span className="text-prosperity">{t("redemption.oneToTwo")}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5">
                <p className="text-sm text-soft-white/50">Status</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-soft-white/50">{t("redemption.requiresKYC")}</span>
                    <Badge className="border border-gold/20 bg-gold/10 text-gold">KYC</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-soft-white/50">{t("redemption.redemptionCode")}</span>
                    <Badge
                      className={`${
                        showQR
                          ? "border-prosperity/30 bg-prosperity/20 text-prosperity"
                          : "border-soft-white/10 bg-soft-white/5 text-soft-white/50"
                      }`}
                    >
                      {showQR ? t("redemption.codeGenerated") : t("redemption.generateRedemptionCode")}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
