"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Lock, Gift, TrendingUp, Info } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"

const rewardData = [
  { day: "Sen", yield: 0.12 },
  { day: "Sel", yield: 0.15 },
  { day: "Rab", yield: 0.18 },
  { day: "Kam", yield: 0.14 },
  { day: "Jum", yield: 0.16 },
  { day: "Sab", yield: 0.13 },
  { day: "Ming", yield: 0.17 },
]

const cardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"

export default function StakingPage() {
  const { t } = useLanguage()

  return (
    <TooltipProvider>
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-soft-white/50">Aurix DeFi</p>
              <h1 className="text-4xl font-bold text-soft-white md:text-5xl">{t("staking.title")}</h1>
              <p className="max-w-2xl text-soft-white/50">{t("staking.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-prosperity/20 bg-prosperity/10 px-5 py-3">
              <TrendingUp className="h-5 w-5 text-prosperity" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-soft-white/50">{t("staking.currentAPY")}</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-prosperity">5.2%</span>
                  <span className="pb-1 text-sm text-soft-white/50">{t("staking.rewardPoolYield")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className={`lg:col-span-2 ${cardClass}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
                      <Lock className="h-5 w-5 text-gold" />
                      {t("staking.yourStakingPosition")}
                    </CardTitle>
                    <CardDescription className="mt-2 text-soft-white/50">{t("staking.currentStatus")}</CardDescription>
                  </div>
                  <Badge className="border border-gold/20 bg-gold/10 text-gold">{t("staking.currentAPY")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-gold/10 bg-gold/10 p-5">
                    <p className="text-sm text-soft-white/50">{t("staking.gTokensStaked")}</p>
                    <div className="mt-3 text-3xl font-bold text-soft-white">125.500000</div>
                    <p className="mt-2 text-sm text-gold">G-TOKEN</p>
                  </div>
                  <div className="rounded-2xl border border-prosperity/10 bg-prosperity/10 p-5">
                    <p className="text-sm text-soft-white/50">{t("staking.estimatedRewards")}</p>
                    <div className="mt-3 text-3xl font-bold text-prosperity">2.847</div>
                    <p className="mt-2 text-sm text-soft-white/50">{t("staking.dailyYield")}</p>
                  </div>
                  <div className="rounded-2xl border border-soft-white/5 bg-navy-900/50 p-5">
                    <p className="text-sm text-soft-white/50">{t("staking.durationStaked")}</p>
                    <div className="mt-3 text-3xl font-bold text-soft-white">
                      47 <span className="text-lg text-soft-white/50">{t("staking.days")}</span>
                    </div>
                    <p className="mt-2 text-sm text-soft-white/50">{t("staking.minimumStaking")}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-soft-white/5 bg-navy-900/40 p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-soft-white/50">{t("staking.stakingProgress")}</p>
                      <p className="mt-1 text-2xl font-bold text-soft-white">52%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gold">47/90 {t("staking.days")}</p>
                      <p className="mt-1 text-xs text-soft-white/50">{t("staking.minimumStaking")}</p>
                    </div>
                  </div>
                  <Progress value={52} className="h-3 bg-soft-white/5" />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <Button className="h-12 rounded-xl bg-gold font-semibold text-navy-900 hover:bg-gold-600">
                    <Lock className="mr-2 h-4 w-4" />
                    {t("staking.stakeMore")}
                  </Button>
                  <Button className="h-12 rounded-xl bg-prosperity font-semibold text-navy-900 hover:bg-prosperity/80">
                    <Gift className="mr-2 h-4 w-4" />
                    {t("staking.claimRewards")}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-gold/20 bg-transparent text-soft-white hover:bg-gold/10"
                  >
                    {t("staking.unstake")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader className="pb-4">
                <CardTitle className="text-soft-white font-bold">{t("staking.stakeGTokens")}</CardTitle>
                <CardDescription className="text-soft-white/50">{t("staking.lockTokens")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-2xl border border-gold/15 bg-gold/10 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-soft-white/50">{t("staking.currentAPY")}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <span className="text-4xl font-bold text-gold">5.2%</span>
                    <span className="text-sm text-prosperity">{t("staking.estimatedDaily")}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-soft-white/50">{t("staking.amountToStake")}</Label>
                  <Input
                    type="number"
                    placeholder="0.000000"
                    className="h-12 rounded-xl border-soft-white/10 bg-navy-900/50 text-soft-white placeholder:text-soft-white/30"
                  />
                  <div className="text-sm text-soft-white/50">{t("staking.available")}: 45.250000 G-TOKEN</div>
                </div>

                <div className="space-y-3 rounded-2xl border border-soft-white/5 bg-navy-900/50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-soft-white/50">{t("staking.currentAPY")}</span>
                    <span className="font-semibold text-prosperity">5.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-soft-white/50">{t("staking.lockPeriod")}</span>
                    <span className="text-soft-white">30-90 {t("staking.days")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-soft-white/50">{t("staking.estimatedDaily")}</span>
                    <span className="text-gold">0.142% {t("staking.yield")}</span>
                  </div>
                </div>

                <Button className="h-12 w-full rounded-xl bg-gold font-semibold text-navy-900 hover:bg-gold-600">
                  {t("staking.stakeNow")}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className={`${cardClass} mt-8`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
                    <TrendingUp className="h-5 w-5 text-gold" />
                    {t("staking.dailyYield")}
                  </CardTitle>
                  <CardDescription className="mt-2 text-soft-white/50">{t("staking.rewardPoolYield")}</CardDescription>
                </div>
                <div className="rounded-xl border border-prosperity/20 bg-prosperity/10 px-4 py-2 text-right">
                  <p className="text-xs text-soft-white/50">{t("staking.estimatedDaily")}</p>
                  <p className="text-lg font-bold text-prosperity">0.142%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-soft-white/5 bg-navy-900/40 p-4">
                <ChartContainer
                  config={{
                    yield: {
                      label: "Daily Yield %",
                      color: "hsl(var(--prosperity))",
                    },
                  }}
                  className="h-[320px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rewardData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#33CC99" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#33CC99" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#F8F5F0", opacity: 0.5 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#F8F5F0", opacity: 0.5 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="yield" stroke="#33CC99" strokeWidth={3} fillOpacity={1} fill="url(#yieldGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={`${cardClass} mt-8`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-soft-white font-bold">
                <Info className="h-5 w-5 text-gold" />
                {t("staking.howStakingWorks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-prosperity/10 bg-navy-900/40 p-5">
                  <div className="mb-4 h-10 w-10 rounded-full bg-prosperity/15 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-prosperity" />
                  </div>
                  <h4 className="text-soft-white font-bold">{t("staking.sustainableRewards")}</h4>
                  <p className="mt-2 text-sm text-soft-white/50">{t("staking.sustainableDesc")}</p>
                </div>

                <div className="rounded-2xl border border-gold/10 bg-navy-900/40 p-5">
                  <div className="mb-4 h-10 w-10 rounded-full bg-gold/15 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-gold" />
                  </div>
                  <h4 className="text-soft-white font-bold">{t("staking.feeDistribution")}</h4>
                  <p className="mt-2 text-sm text-soft-white/50">{t("staking.feeDistributionDesc")}</p>
                </div>

                <div className="rounded-2xl border border-prosperity/10 bg-navy-900/40 p-5">
                  <div className="mb-4 h-10 w-10 rounded-full bg-prosperity/15 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-prosperity" />
                  </div>
                  <h4 className="text-soft-white font-bold">{t("staking.lockPeriodBenefits")}</h4>
                  <p className="mt-2 text-sm text-soft-white/50">{t("staking.lockPeriodBenefitsDesc")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
