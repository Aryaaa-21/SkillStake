import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  Legend
} from "recharts";
import { useWallet } from "../lib/wallet";
import { api } from "../lib/api";
import { formatAmount, truncateAddress, getChallengeProgress } from "../lib/utils";
import { Badge, Button, Card } from "../components/ui";
import { LayoutDashboard, Coins, Flame, Star, Trophy, CheckCircle, AlertTriangle, Compass } from "lucide-react";

// Mock data for recharts analytics
const CHALLENGE_ACTIVITY_DATA = [
  { name: "Jan", Challenges: 2, Stakes: 150 },
  { name: "Feb", Challenges: 5, Stakes: 400 },
  { name: "Mar", Challenges: 8, Stakes: 750 },
  { name: "Apr", Challenges: 12, Stakes: 1100 },
  { name: "May", Challenges: 15, Stakes: 1350 },
  { name: "Jun", Challenges: 19, Stakes: 1750 }
];

const POOL_GROWTH_DATA = [
  { name: "Week 1", Balance: 200 },
  { name: "Week 2", Balance: 350 },
  { name: "Week 3", Balance: 500 },
  { name: "Week 4", Balance: 600 },
  { name: "Week 5", Balance: 750 }
];

const WEEKLY_ACTIVITY_DATA = [
  { name: "Mon", Votes: 4, Claims: 1 },
  { name: "Tue", Votes: 7, Claims: 2 },
  { name: "Wed", Votes: 12, Claims: 4 },
  { name: "Thu", Votes: 9, Claims: 3 },
  { name: "Fri", Votes: 15, Claims: 5 },
  { name: "Sat", Votes: 20, Claims: 6 },
  { name: "Sun", Votes: 14, Claims: 2 }
];

const REPUTATION_GROWTH_DATA = [
  { name: "Jan", XP: 100, Reputation: 10 },
  { name: "Feb", XP: 450, Reputation: 25 },
  { name: "Mar", XP: 1100, Reputation: 50 },
  { name: "Apr", XP: 1900, Reputation: 75 },
  { name: "May", XP: 2800, Reputation: 90 },
  { name: "Jun", XP: 3480, Reputation: 98 }
];

const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b"];

export function DashboardPage() {
  const wallet = useWallet();
  const rewardPool = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });
  const challenges = useQuery({ queryKey: ["challenges"], queryFn: api.challenges });
  const activities = useQuery({ queryKey: ["activities"], queryFn: api.activities });

  const challengesList = challenges.data?.challenges ?? [];
  const activeCount = challengesList.filter((c) => c.status === "active" || c.status === "proof_submitted").length;
  const completedCount = challengesList.filter((c) => c.status === "completed").length;
  const failedCount = challengesList.filter((c) => c.status === "failed").length;
  const totalCount = challengesList.length;

  const totalStaked = challengesList.reduce((acc, c) => acc + c.stakeAmount, 0);
  
  // Calculate success rate
  const successRate = totalCount > 0 
    ? Math.round((completedCount / (completedCount + failedCount || 1)) * 100) 
    : 94; // Fallback to demo defaults

  const currentStreak = wallet.connected ? 3 : 0;
  const reputationScore = wallet.connected ? 98 : 0;
  const rewardsEarned = wallet.connected ? 150 : 0;

  // Pie chart completion rate data
  const completionData = [
    { name: "Completed", value: completedCount || 3 },
    { name: "Failed", value: failedCount || 1 }
  ];

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2 font-raleway">
            <LayoutDashboard className="h-6 w-6 text-accent dark:text-white" />
            Control Surface Dashboard
          </h2>
          <p className="text-sm text-muted">DeFi accountability metrics, smart contract escrow logs, and telemetry charts.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="text-xs h-9.5 px-4 rounded-xl shadow-premium font-raleway">
            <Link to="/create">Create Challenge</Link>
          </Button>
          <Button variant="secondary" asChild className="text-xs h-9.5 px-4 rounded-xl font-raleway">
            <Link to="/validation">User Validation</Link>
          </Button>
        </div>
      </div>

      {/* Analytics Statistics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="tour-step-stats">
        <Card className="border-border/80 relative overflow-hidden group p-6">
          <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Total XLM Staked</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-accent dark:text-white flex items-baseline gap-1 font-raleway">
            <CountUp end={totalStaked || 500} duration={1.5} separator="," decimals={0} />
            <span className="text-xs font-semibold text-muted font-bradley">XLM</span>
          </p>
          <p className="mt-2 text-xs text-muted leading-relaxed truncate">Total locked across challenge escrows.</p>
          <Coins className="absolute bottom-4 right-4 h-6 w-6 text-muted/20 group-hover:scale-110 transition-transform" />
        </Card>

        <Card className="border-border/80 relative overflow-hidden group p-6">
          <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Success Rate</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-accent dark:text-white flex items-baseline gap-1 font-raleway">
            <CountUp end={successRate} duration={1.5} />
            <span className="text-xs font-semibold text-muted font-bradley">%</span>
          </p>
          <p className="mt-2 text-xs text-muted leading-relaxed truncate">Ratio of completed to failed challenges.</p>
          <Trophy className="absolute bottom-4 right-4 h-6 w-6 text-muted/20 group-hover:scale-110 transition-transform" />
        </Card>

        <Card className="border-border/80 relative overflow-hidden group p-6">
          <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Current Streak</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-accent dark:text-white flex items-baseline gap-1 font-raleway">
            <CountUp end={currentStreak} duration={1.5} />
            <span className="text-xs font-semibold text-muted font-bradley">Days</span>
          </p>
          <p className="mt-2 text-xs text-muted leading-relaxed truncate">Consecutive days of logged habit validation.</p>
          <Flame className="absolute bottom-4 right-4 h-6 w-6 text-muted/20 group-hover:scale-110 transition-transform" />
        </Card>

        <Card className="border-border/80 relative overflow-hidden group p-6">
          <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Reputation Score</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-accent dark:text-white flex items-baseline gap-1 font-raleway">
            <CountUp end={reputationScore} duration={1.5} />
            <span className="text-xs font-semibold text-muted font-bradley">/100</span>
          </p>
          <p className="mt-2 text-xs text-muted leading-relaxed truncate">Weighted score of validator consistency.</p>
          <Star className="absolute bottom-4 right-4 h-6 w-6 text-muted/20 group-hover:scale-110 transition-transform" />
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">
        <Card className="border-border/80 text-center p-6">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Challenges</p>
          <p className="mt-1.5 text-2xl font-bold text-accent dark:text-white font-raleway">
            <CountUp end={totalCount || 3} duration={1.2} />
          </p>
        </Card>
        <Card className="border-border/80 text-center p-6">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Active</p>
          <p className="mt-1.5 text-2xl font-bold text-accent dark:text-white font-raleway">
            <CountUp end={activeCount || 2} duration={1.2} />
          </p>
        </Card>
        <Card className="border-border/80 text-center text-emerald-500 p-6">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Completed</p>
          <p className="mt-1.5 text-2xl font-bold font-raleway">
            <CountUp end={completedCount || 1} duration={1.2} />
          </p>
        </Card>
        <Card className="border-border/80 text-center text-rose-500 p-6">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Failed</p>
          <p className="mt-1.5 text-2xl font-bold font-raleway">
            <CountUp end={failedCount || 0} duration={1.2} />
          </p>
        </Card>
      </div>

      {/* Dashboard Analytics Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2" id="tour-step-charts">
        {/* Chart 1: Challenge Activity */}
        <Card className="p-5 border-border/80">
          <div className="mb-4">
            <h4 className="font-bold text-accent dark:text-white text-sm">Challenge Activity & Escrow Value</h4>
            <p className="text-xs text-muted">Accumulated commitments over time.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHALLENGE_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStakes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                <Area type="monotone" dataKey="Stakes" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStakes)" strokeWidth={2} />
                <Area type="monotone" dataKey="Challenges" stroke="#10b981" fill="none" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Completion Rate */}
        <Card className="p-5 border-border/80 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="font-bold text-accent dark:text-white text-sm">Completion vs Failure Ratio</h4>
            <p className="text-xs text-muted">Distribution of smart contract resolutions.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-48 w-48 mx-auto sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || "#000"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3 w-full text-xs">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  Completed Contracts
                </span>
                <span className="font-bold">{completedCount || 3} ({Math.round(successRate)}%)</span>
              </div>
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  Failed Escrows
                </span>
                <span className="font-bold">{failedCount || 1} ({Math.round(100 - successRate)}%)</span>
              </div>
              <p className="text-[10px] text-muted leading-relaxed">
                Stakes from failed challenges automatically flow into the treasury to reward community verifiers.
              </p>
            </div>
          </div>
        </Card>

        {/* Chart 3: Reward Pool Growth */}
        <Card className="p-5 border-border/80">
          <div className="mb-4">
            <h4 className="font-bold text-accent dark:text-white text-sm">Reward Pool Growth (XLM)</h4>
            <p className="text-xs text-muted">On-chain treasury assets over time.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={POOL_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                <Line type="monotone" dataKey="Balance" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Reputation & XP Growth */}
        <Card className="p-5 border-border/80">
          <div className="mb-4">
            <h4 className="font-bold text-accent dark:text-white text-sm">Reputation & XP Scaling</h4>
            <p className="text-xs text-muted">User levels mapped to verification consistency.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={REPUTATION_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis yAxisId="left" stroke="#888888" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "12px" }} />
                <Bar yAxisId="left" dataKey="XP" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={25} />
                <Line yAxisId="right" type="monotone" dataKey="Reputation" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Active Challenges Progress Tracking */}
      {(() => {
        const activeChallenges = challengesList.filter((c) => c.status === "active" || c.status === "proof_submitted");
        return (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Timeline Tracking</p>
                <h3 className="text-lg font-bold text-accent dark:text-white">Active Challenge Progress</h3>
              </div>
              <Button variant="ghost" asChild className="text-[10px] h-8 px-3 rounded-lg font-semibold">
                <Link to="/active">View All</Link>
              </Button>
            </div>

            {activeChallenges.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {activeChallenges.slice(0, 3).map((c) => {
                  const prog = getChallengeProgress({ _id: c._id, durationDays: c.durationDays, createdAt: c.createdAt });
                  return (
                    <Card key={c._id} className="p-5 border-border/80 flex flex-col justify-between hover:shadow-md transition-all duration-200">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Badge className="bg-black/5 dark:bg-white/5 border-border text-[9px]">{c.category}</Badge>
                          <span className="text-[10px] font-bold text-orange-500 font-mono">Day {prog.elapsed} / {c.durationDays}</span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-accent dark:text-white line-clamp-1">{c.title}</h4>
                          <p className="text-[11px] text-muted line-clamp-2 mt-1">{c.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                        <div className="flex justify-between text-[10px] text-muted">
                          <span>{prog.percentage}% Complete</span>
                          <span>{prog.remaining} days remaining</span>
                        </div>
                        <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5">
                          <div className="bg-accent dark:bg-white h-1.5 rounded-full" style={{ width: `${prog.percentage}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center pt-1.5">
                          <span className="text-[10px] font-bold text-accent dark:text-white">{c.stakeAmount} XLM Staked</span>
                          <Button variant="secondary" asChild className="text-[9px] h-7 px-2.5 rounded-md font-semibold">
                            <Link to={`/challenge/${c._id}`}>Track</Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="flex min-h-[160px] flex-col items-center justify-center p-6 text-center border-dashed border-border bg-transparent">
                <Trophy className="h-7 w-7 text-muted/60 mb-2" />
                <h5 className="font-semibold text-accent dark:text-white text-xs">No active challenges</h5>
                <p className="text-[11px] text-muted max-w-xs mt-1">Start a new escrow commitment to track daily streak progression here.</p>
                <Button asChild className="mt-3 text-[10px] h-8 px-3 rounded-lg font-semibold">
                  <Link to="/create">Create Challenge</Link>
                </Button>
              </Card>
            )}
          </section>
        );
      })()}

      {/* Recent Activity */}
      <section className="grid gap-6 grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5.5 border-border/80">
          <div className="mb-4 space-y-1">
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Account Activity</p>
            <h3 className="text-lg font-bold text-accent dark:text-white">Recent on-chain signals</h3>
          </div>
          
          {activities.isLoading ? (
            <div className="space-y-3 mt-4">
              <div className="h-16 w-full animate-pulse bg-black/5 dark:bg-white/5 rounded-xl" />
              <div className="h-16 w-full animate-pulse bg-black/5 dark:bg-white/5 rounded-xl" />
              <div className="h-16 w-full animate-pulse bg-black/5 dark:bg-white/5 rounded-xl" />
            </div>
          ) : (activities.data?.activities && activities.data.activities.length > 0) ? (
            <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto safe-scrollbar pr-1">
              {(activities.data?.activities ?? []).slice(0, 5).map((activity) => (
                <div key={activity._id} className="rounded-xl border border-border/60 p-4 transition-colors hover:border-border/90 bg-black/[0.005] dark:bg-white/[0.005] flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold capitalize text-accent dark:text-white">{activity.kind.replaceAll("_", " ")}</p>
                    <p className="text-xs text-muted leading-normal">{activity.message}</p>
                  </div>
                  <span className="text-[10px] text-muted font-mono">{new Date(activity.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <Card className="flex min-h-[200px] flex-col items-center justify-center p-6 text-center border-dashed border-border bg-transparent">
                <Compass className="h-8 w-8 text-muted/60 mb-2" />
                <h5 className="font-semibold text-accent dark:text-white text-xs">No local activity</h5>
                <p className="text-[11px] text-muted max-w-xs mt-1">Activities will log automatically as smart contracts are created and settled.</p>
              </Card>
            </div>
          )}
        </Card>

        <Card className="p-5.5 border-border/80">
          <div className="mb-4 space-y-1">
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Treasury Overview</p>
            <h3 className="text-lg font-bold text-accent dark:text-white">Escrow Escapes</h3>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center rounded-xl border border-border/60 p-3 bg-black/[0.01] dark:bg-white/[0.01]">
              <span className="text-xs text-muted font-medium">Reward Pool Treasury</span>
              <span className="text-sm font-bold text-accent dark:text-white">
                {formatAmount(rewardPool.data?.rewardPool.currentBalance ?? 750)} XLM
              </span>
            </div>
            <div className="text-xs text-muted leading-relaxed space-y-2">
              <p>
                When a staker defaults, their entire locked XLM collateral is permanently released to the Community Treasury.
              </p>
              <p>
                This pool rewards community verifiers for checking Git repos, Strava links, and other accountability proofs.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
