"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
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

export default function StakingPage() {
  const { t } = useLanguage()

  return (
    <TooltipProvider>
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-soft-white mb-2">{t("staking.title")}</h1>
            <p className="text-soft-white/70">{t("staking.subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Staking Overview */}
            <Card className="lg:col-span-2 bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  {t("staking.yourStakingPosition")}
                </CardTitle>
                <CardDescription className="text-soft-white/70">{t("staking.currentStatus")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gold/10 rounded-lg">
                    <div className="text-2xl font-bold text-gold">125.500000</div>
                    <div className="text-sm text-soft-white/70">{t("staking.gTokensStaked")}</div>
                  </div>
                  <div className="text-center p-4 bg-prosperity/10 rounded-lg">
                    <div className="text-2xl font-bold text-prosperity">2.847</div>
                    <div className="text-sm text-soft-white/70">{t("staking.estimatedRewards")}</div>
                  </div>
                  <div className="text-center p-4 bg-navy-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-soft-white">47 {t("staking.days")}</div>
                    <div className="text-sm text-soft-white/70">{t("staking.durationStaked")}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-soft-white/70">{t("staking.stakingProgress")}</span>
                    <span className="text-gold">47/90 {t("staking.days")}</span>
                  </div>
                  <Progress value={52} className="h-2 bg-navy-900" />
                  <div className="text-sm text-soft-white/50">{t("staking.minimumStaking")}</div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-gold hover:bg-gold-600 text-navy-900 font-semibold">
                    <Lock className="h-4 w-4 mr-2" />
                    {t("staking.stakeMore")}
                  </Button>
                  <Button className="flex-1 bg-prosperity hover:bg-prosperity/80 text-navy-900 font-semibold">
                    <Gift className="h-4 w-4 mr-2" />
                    {t("staking.claimRewards")}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gold/20 text-soft-white hover:bg-gold/10 bg-transparent"
                  >
                    {t("staking.unstake")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stake New Tokens */}
            <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold">{t("staking.stakeGTokens")}</CardTitle>
                <CardDescription className="text-soft-white/70">{t("staking.lockTokens")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-soft-white">{t("staking.amountToStake")}</Label>
                  <Input
                    type="number"
                    placeholder="0.000000"
                    className="bg-navy-900/50 border-gold/20 text-soft-white"
                  />
                  <div className="text-sm text-soft-white/50">{t("staking.available")}: 45.250000 G-TOKEN</div>
                </div>

                <div className="bg-navy-900/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-soft-white/70">{t("staking.currentAPY")}</span>
                    <span className="text-prosperity font-semibold">5.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-soft-white/70">{t("staking.lockPeriod")}</span>
                    <span className="text-soft-white">30-90 {t("staking.days")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-soft-white/70">{t("staking.estimatedDaily")}</span>
                    <span className="text-gold">0.142% {t("staking.yield")}</span>
                  </div>
                </div>

                <Button className="w-full bg-gold hover:bg-gold-600 text-navy-900 font-semibold">
                  {t("staking.stakeNow")}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reward Pool Chart */}
          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                {t("staking.dailyYield")}
              </CardTitle>
              <CardDescription className="text-soft-white/70">{t("staking.rewardPoolYield")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  yield: {
                    label: "Daily Yield %",
                    color: "hsl(var(--prosperity))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rewardData}>
                    <defs>
                      <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#33CC99" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#33CC99" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="yield" stroke="#33CC99" fillOpacity={1} fill="url(#yieldGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Reward Mechanism */}
          <Card className="bg-navy-800/50 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold flex items-center">
                <Info className="h-5 w-5 mr-2" />
                {t("staking.howStakingWorks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-navy-900/50 rounded-lg p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-prosperity mt-2"></div>
                  <div>
                    <h4 className="text-soft-white font-semibold mb-1">{t("staking.sustainableRewards")}</h4>
                    <p className="text-soft-white/70 text-sm">{t("staking.sustainableDesc")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-gold mt-2"></div>
                  <div>
                    <h4 className="text-soft-white font-semibold mb-1">{t("staking.feeDistribution")}</h4>
                    <p className="text-soft-white/70 text-sm">{t("staking.feeDistributionDesc")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-prosperity mt-2"></div>
                  <div>
                    <h4 className="text-soft-white font-semibold mb-1">{t("staking.lockPeriodBenefits")}</h4>
                    <p className="text-soft-white/70 text-sm">{t("staking.lockPeriodBenefitsDesc")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
