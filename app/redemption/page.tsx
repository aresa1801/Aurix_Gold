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
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-soft-white mb-2">{t("redemption.title")}</h1>
          <p className="text-soft-white/70">{t("redemption.subtitle")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Redemption Form */}
          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Send className="h-5 w-5 mr-2" />
                {t("redemption.redeemTokens")}
              </CardTitle>
              <CardDescription className="text-soft-white/70">{t("redemption.burnTokens")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-gold/20 bg-gold/10">
                <AlertTriangle className="h-4 w-4 text-gold" />
                <AlertDescription className="text-gold">{t("redemption.requiresKYC")}</AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label className="text-soft-white">{t("redemption.tokensToRedeem")}</Label>
                <Input
                  type="number"
                  placeholder="0.000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-navy-900/50 border-gold/20 text-soft-white text-lg h-12"
                />
                <div className="text-sm text-soft-white/50">{t("redemption.available")}: 125.500000 G-TOKEN</div>
              </div>

              <div className="bg-navy-900/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-soft-white/70">{t("redemption.goldWeight")}</span>
                  <span className="text-gold font-semibold">
                    {goldWeight} {t("redemption.grams")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-white/70">{t("redemption.estimatedValue")}</span>
                  <span className="text-prosperity">₹{goldValue} IDRX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-soft-white/70">{t("redemption.processingFee")}</span>
                  <span className="text-soft-white">₹50 IDRX</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-soft-white">{t("redemption.pegadaianOutlet")}</Label>
                <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                  <SelectTrigger className="bg-navy-900/50 border-gold/20 text-soft-white">
                    <SelectValue placeholder={t("redemption.selectPickupLocation")} />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-800 border-gold/20">
                    {pegadaianOutlets.map((outlet) => (
                      <SelectItem key={outlet.id} value={outlet.id}>
                        <div>
                          <div className="font-medium">{t(outlet.name)}</div>
                          <div className="text-sm text-soft-white/70">{t(outlet.address)}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-gold hover:bg-gold-600 text-navy-900 font-semibold h-12"
                onClick={generateRedeemCode}
                disabled={!amount || !selectedOutlet || Number.parseFloat(amount) <= 0}
              >
                {t("redemption.generateRedemptionCode")}
              </Button>
            </CardContent>
          </Card>

          {/* QR Code / Instructions */}
          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                {showQR ? t("redemption.redemptionCode") : t("redemption.howItWorks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showQR ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-48 w-48 bg-soft-white rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="h-16 w-16 mx-auto mb-2 text-navy-900" />
                        <div className="text-xs text-navy-900 font-mono">{redeemCode}</div>
                      </div>
                    </div>
                    <Badge className="bg-prosperity/20 text-prosperity border-prosperity/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t("redemption.codeGenerated")}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-navy-900/50 rounded-lg p-4">
                      <h4 className="text-soft-white font-semibold mb-2">{t("redemption.redemptionCode")}</h4>
                      <div className="font-mono text-gold text-lg text-center bg-gold/10 rounded p-2">{redeemCode}</div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-gold text-navy-900 flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <div>
                          <p className="text-soft-white font-medium">{t("redemption.visitOutlet")}</p>
                          <p className="text-soft-white/70">{t("redemption.bringValidID")}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-gold text-navy-900 flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <div>
                          <p className="text-soft-white font-medium">{t("redemption.verificationProcess")}</p>
                          <p className="text-soft-white/70">{t("redemption.staffWillVerify")}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-gold text-navy-900 flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <div>
                          <p className="text-soft-white font-medium">{t("redemption.receiveGold")}</p>
                          <p className="text-soft-white/70">{t("redemption.getPhysicalGold")}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="border-prosperity/20 bg-prosperity/10">
                    <CheckCircle className="h-4 w-4 text-prosperity" />
                    <AlertDescription className="text-prosperity">{t("redemption.codeValidFor")}</AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <h4 className="text-soft-white font-semibold mb-1">{t("redemption.visitOutlet")}</h4>
                        <p className="text-soft-white/70 text-sm">{t("redemption.selectPickupLocation")}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <QrCode className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <h4 className="text-soft-white font-semibold mb-1">{t("redemption.redemptionCode")}</h4>
                        <p className="text-soft-white/70 text-sm">{t("redemption.generateRedemptionCode")}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <h4 className="text-soft-white font-semibold mb-1">{t("redemption.receiveGold")}</h4>
                        <p className="text-soft-white/70 text-sm">{t("redemption.getPhysicalGold")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-navy-900/50 rounded-lg p-4">
                    <h4 className="text-soft-white font-semibold mb-2">{t("redemption.requirements")}</h4>
                    <ul className="space-y-1 text-sm text-soft-white/70">
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

          <Card className="bg-navy-800/50 border-prosperity/20 backdrop-blur-sm transition-all duration-300 hover:border-prosperity/40 hover:shadow-lg hover:shadow-prosperity/10">
            <CardHeader>
              <CardTitle className="text-prosperity flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {t("redemption.redemptionDetails")}
              </CardTitle>
              <CardDescription className="text-soft-white/70">{t("redemption.importantInformation")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-navy-900/50 rounded-lg p-4">
                  <h4 className="text-soft-white font-semibold mb-3">{t("redemption.exchangeProcess")}</h4>
                  <ul className="space-y-2 text-sm text-soft-white/70">
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>{t("redemption.tokensAreBurned")}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>{t("redemption.goldReleased")}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>{t("redemption.availableForPickup")}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>{t("redemption.formVerified")}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-prosperity/10 border border-prosperity/20 rounded-lg p-4">
                  <h4 className="text-prosperity font-semibold mb-2">{t("redemption.quickFacts")}</h4>
                  <div className="space-y-1 text-sm text-soft-white/70">
                    <div className="flex justify-between">
                      <span>{t("redemption.minimumAmount")}:</span>
                      <span className="text-prosperity">1.0 G-TOKEN</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("redemption.maximumAmount")}:</span>
                      <span className="text-prosperity">{t("redemption.unlimited")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("redemption.processingTime")}:</span>
                      <span className="text-prosperity">{t("redemption.oneToTwo")}</span>
                    </div>
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
