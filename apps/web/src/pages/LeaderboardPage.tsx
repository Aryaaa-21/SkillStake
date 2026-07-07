import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, Badge, Skeleton } from "../components/ui";
import { Trophy, BarChart3, Award, Star } from "lucide-react";
import { truncateAddress } from "../lib/utils";

export function LeaderboardPage() {
  const [scope, setScope] = useState<"xp" | "staked" | "success-rate">("xp");
  
  const leaderboard = useQuery({
    queryKey: ["leaderboard", scope],
    queryFn: () => api.leaderboard(scope)
  });

  const list = leaderboard.data?.rows ?? [];

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2 font-raleway">
            <Trophy className="h-6 w-6 text-accent dark:text-white" />
            Rankings and Reputation
          </h2>
          <p className="text-sm text-muted">Audited table of active validators, top accountability stakers, and XP achievements.</p>
        </div>
      </div>

      {/* Scope Toggles */}
      <Card className="border-border/80 flex flex-wrap gap-4 items-center justify-between p-6" id="tour-step-leaderboard">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4.5 w-4.5 text-muted" />
          <span className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider font-raleway">Sort metrics</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["xp", "staked", "success-rate"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setScope(tab)}
              className={`rounded-xl border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap font-raleway ${
                scope === tab
                  ? "border-accent bg-accent/5 text-accent dark:text-white"
                  : "border-border hover:border-accent/40 bg-transparent text-muted"
              }`}
            >
              {tab.replaceAll("-", " ")}
            </button>
          ))}
        </div>
      </Card>

      {/* Table Card */}
      <Card className="border-border/80 overflow-hidden p-0">
        <div className="overflow-x-auto safe-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-black/[0.01] dark:bg-white/[0.005] text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">Participant</th>
                <th className="py-4 px-6 text-center">XP Level</th>
                <th className="py-4 px-6 text-center">Staked XLM</th>
                <th className="py-4 px-6 text-center">Success Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-xs">
              {leaderboard.isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="h-16">
                    <td className="p-6"><Skeleton className="h-6 w-8 mx-auto" /></td>
                    <td className="p-6"><Skeleton className="h-6 w-40" /></td>
                    <td className="p-6"><Skeleton className="h-6 w-16 mx-auto" /></td>
                    <td className="p-6"><Skeleton className="h-6 w-16 mx-auto" /></td>
                    <td className="p-6"><Skeleton className="h-6 w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : list.length > 0 ? (
                list.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-black/[0.005] dark:hover:bg-white/[0.003] transition-colors">
                    <td className="py-4 px-6 text-center font-extrabold text-accent dark:text-white font-raleway">
                      {row.rank === 1 ? (
                        <Award className="h-5 w-5 text-amber-500 mx-auto" />
                      ) : row.rank === 2 ? (
                        <Award className="h-5 w-5 text-slate-400 mx-auto" />
                      ) : row.rank === 3 ? (
                        <Award className="h-5 w-5 text-amber-700 mx-auto" />
                      ) : (
                        row.rank
                      )}
                    </td>
                    <td className="py-4 px-6 font-medium">
                      <div className="space-y-0.5">
                        <p className="font-bold text-accent dark:text-white font-raleway">{row.displayName}</p>
                        <p className="text-[10px] text-muted font-mono">{truncateAddress(row.walletAddress)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-accent dark:text-white flex items-center justify-center gap-1 border-none mt-4">
                      <Star className="h-3.5 w-3.5 text-purple-500 fill-purple-500" />
                      <span>{row.xp.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-accent dark:text-white">{row.totalXlmStaked.toLocaleString()} XLM</td>
                    <td className="py-4 px-6 text-center">
                      <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                        {row.successRate}%
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    No participants logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
