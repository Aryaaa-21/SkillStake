import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, Badge, Skeleton } from "../components/ui";
import { Coins, Trophy, ArrowUpRight, ShieldCheck, HelpCircle } from "lucide-react";
import { formatAmount, truncateAddress } from "../lib/utils";

export function RewardPoolPage() {
  const rewardPool = useQuery({
    queryKey: ["reward-pool"],
    queryFn: api.rewardPool
  });

  const pool = rewardPool.data?.rewardPool ?? {
    currentBalance: 750,
    historicalDistributions: [],
    topContributors: [],
    topEarners: []
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
          <Coins className="h-6 w-6 text-accent dark:text-white" />
          Community Reward Pool
        </h2>
        <p className="text-sm text-muted">Monitor the Soroban contract escrow treasury, validator disbursements, and routing statistics.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-[1fr_1.3fr]" id="tour-step-reward-pool">
        {/* Pool Balance Card */}
        <Card className="p-6 border-border/80 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <Badge className="bg-black/5 dark:bg-white/5 border-border">Escrow treasury</Badge>
            <h3 className="text-lg font-bold text-accent dark:text-white">Active Collateral Pool</h3>
          </div>

          <div className="my-8 text-center">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Treasury Balance</p>
            {rewardPool.isLoading ? (
              <Skeleton className="h-12 w-32 mx-auto mt-2" />
            ) : (
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-accent dark:text-white flex items-baseline justify-center gap-1">
                {formatAmount(pool.currentBalance)}
                <span className="text-sm font-bold text-muted">XLM</span>
              </p>
            )}
          </div>

          <div className="text-xs text-muted leading-relaxed flex items-start gap-2.5 bg-black/[0.01] dark:bg-white/[0.01] p-3 rounded-xl border border-border">
            <HelpCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p>
              This pool grows when stakers abandon commitments or fail community voting thresholds. Locked stakes automatically route here to incentivize community verifiers.
            </p>
          </div>
        </Card>

        {/* Informational Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card className="p-5 border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Top Contributors</span>
              <Coins className="h-4 w-4 text-muted" />
            </div>
            {rewardPool.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : pool.topContributors.length > 0 ? (
              <div className="space-y-2.5">
                {pool.topContributors.slice(0, 3).map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-mono text-muted">{truncateAddress(c.walletAddress)}</span>
                    <span className="font-bold text-accent dark:text-white">{c.amount} XLM</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No contributors logged.</p>
            )}
          </Card>

          <Card className="p-5 border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-accent dark:text-white uppercase tracking-wider">Top Earners</span>
              <Trophy className="h-4 w-4 text-muted" />
            </div>
            {rewardPool.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : pool.topEarners.length > 0 ? (
              <div className="space-y-2.5">
                {pool.topEarners.slice(0, 3).map((e, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-mono text-muted">{truncateAddress(e.walletAddress)}</span>
                    <span className="font-bold text-accent dark:text-white">{e.amount} XLM</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No earners logged.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Historical Distributions Feed */}
      <Card className="p-6 border-border/80 space-y-4">
        <div>
          <h3 className="text-base font-bold text-accent dark:text-white">Transaction disbursement logs</h3>
          <p className="text-xs text-muted">Chronological audit ledger of community payouts.</p>
        </div>

        {rewardPool.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : pool.historicalDistributions.length > 0 ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto safe-scrollbar pr-1">
            {pool.historicalDistributions.map((dist, idx) => (
              <div key={idx} className="rounded-xl border border-border/60 p-4 flex justify-between items-start gap-4 hover:border-border transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-accent dark:text-white">Distribution released</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{dist.reason}</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs font-bold text-accent dark:text-white">+{dist.amount} XLM</span>
                  <p className="text-[10px] text-muted font-mono">{new Date(dist.distributedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShieldCheck className="h-8 w-8 text-muted/60 mx-auto mb-2" />
            <p className="text-xs font-semibold text-accent dark:text-white">No historical disbursements</p>
            <p className="text-[11px] text-muted mt-1">Disbursement audits will log here once voter rewards fire.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
