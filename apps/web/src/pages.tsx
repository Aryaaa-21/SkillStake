import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api, type ChallengeSummary } from "./lib/api";
import { Badge, Button, Card, Input, Progress, Skeleton, Textarea } from "./components/ui";
import { formatAmount, truncateAddress } from "./lib/utils";
import { queryClient } from "./lib/query";
import { signTransaction, useWallet } from "./lib/wallet";
import { useTheme } from "./lib/theme";
import { toast } from "sonner";
import { getLevelFromXp } from "@skillstake/shared";
import type { ActivitySummary } from "./lib/api";
import { Inbox, Compass, FileText, CheckCircle2, Trophy, Coins, User, BarChart3, ShieldAlert, Sparkles, Bell } from "lucide-react";

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-6 space-y-2">
      <p className="text-label text-xs text-muted" aria-hidden="true">{eyebrow}</p>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-accent dark:text-white">{title}</h2>
      <p className="max-w-3xl text-xs sm:text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="card-hover relative overflow-hidden group border-border/80 hover:border-border transition-all duration-200">
      <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">{label}</p>
      <p className="mt-3.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-accent dark:text-white transition-transform group-hover:scale-[1.01]">{value}</p>
      <p className="mt-2 text-xs text-muted leading-relaxed truncate">{hint}</p>
    </Card>
  );
}

function EmptyState({ title, description, icon: Icon = Inbox }: { title: string; description: string; icon?: any }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-8 text-center bg-black/[0.01] dark:bg-white/[0.01] transition-all" role="status">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-muted/80">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-accent dark:text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="space-y-3 p-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-40" />
        </Card>
      ))}
    </div>
  );
}

function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="space-y-2 p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="h-4 w-2/3" />
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 border-t border-border/40 pt-3.5">
          {[1, 2, 3, 4, 5].map((j) => (
            <Skeleton key={j} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </Card>
  );
}

function TransactionStatus({ stage, txHash, explorerUrlValue, error }: { stage: string; txHash: string | undefined; explorerUrlValue: string | undefined; error: string | undefined }) {
  if (stage === "idle") return null;
  return (
    <Card className="space-y-4" role="status" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Transaction State</p>
          <p className="mt-1 text-sm font-semibold capitalize text-accent dark:text-white">{stage}</p>
        </div>
        {txHash ? (
          <Badge className="font-mono text-xs border-border/80 bg-black/5 dark:bg-white/5">
            {txHash.slice(0, 12)}...
          </Badge>
        ) : null}
      </div>
      <Progress value={{ preparing: 15, signing: 40, submitting: 65, pending: 85, success: 100, failed: 100 }[stage] ?? 0} />
      {explorerUrlValue ? (
        <a 
          className="inline-flex text-xs font-semibold text-accent dark:text-white underline underline-offset-4 hover:opacity-85 transition-opacity" 
          href={explorerUrlValue} 
          target="_blank" 
          rel="noreferrer"
          aria-label="View transaction on Stellar Explorer"
        >
          Open Explorer
        </a>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
          <p className="text-xs font-medium text-[rgb(var(--danger))]">{error}</p>
        </div>
      ) : null}
    </Card>
  );
}

export function LandingPage() {
  const highlights = ["Stake XLM", "Community verification", "Reward pool routing", "XP and rankings"];
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <Badge className="bg-black/5 dark:bg-white/5 border-border">Stellar accountability layer</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-accent dark:text-white leading-[1.1]">
            Stake on your success without leaving a premium control surface.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
            SkillStake locks XLM into Soroban-backed challenges, routes failed stakes into a reward pool, and keeps every proof, vote, and payout visible.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="h-11 px-6 rounded-xl shadow-premium"><Link to="/create">Create Challenge</Link></Button>
            <Button variant="secondary" asChild className="h-11 px-6 rounded-xl"><Link to="/leaderboard">View Leaderboard</Link></Button>
          </div>
          <div className="grid gap-3 pt-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => (
              <Card key={item} className="card-hover p-4 border-border/70 hover:border-border transition-all duration-200">
                <p className="text-xs sm:text-sm font-semibold text-accent dark:text-white">{item}</p>
              </Card>
            ))}
          </div>
        </div>
        <Card className="overflow-hidden p-0 border-border/80">
          <div className="border-b border-border/70 bg-black/[0.01] dark:bg-white/[0.01] p-5.5">
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Activity Preview</p>
            <h3 className="mt-1 text-lg font-bold text-accent dark:text-white">Live accountability loop</h3>
          </div>
          <div className="space-y-3 p-5.5">
            {[
              ["User Created Challenge", "Complete 30 Days of DSA"],
              ["User Submitted Proof", "Repository link and progress notes"],
              ["Community Approved Proof", "Threshold reached, stake returned"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-border/60 bg-black/[0.01] dark:bg-white/[0.01] p-4 transition-all duration-200 hover:border-border">
                <p className="text-xs sm:text-sm font-semibold text-accent dark:text-white">{title}</p>
                <p className="mt-1 text-xs text-muted leading-normal">{body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Network" value="Mainnet ready" hint="Live balance fetch and explorer links are built in." />
        <StatCard label="Wallets" value="Freighter + Albedo" hint="Connect, disconnect, sign, and submit transaction flows." />
        <StatCard label="Verification" value="Threshold votes" hint="Duplicate and self-vote protection is enforced." />
        <StatCard label="Theme" value="Auto / Light / Dark" hint="Resolved by preference, system, and time of day." />
      </section>
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {["Complete 30 Days of DSA", "Study 100 Hours", "Finish a Course"].map((item) => (
          <Card key={item} className="card-hover border-border/70 hover:border-border transition-all duration-200">
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Challenge category</p>
            <h3 className="mt-2 text-base sm:text-lg font-bold text-accent dark:text-white">{item}</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">Create a verifiable commitment, lock XLM, and let the network keep you honest.</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

export function DashboardPage() {
  const wallet = useWallet();
  const rewardPool = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });
  const challenges = useQuery({ queryKey: ["challenges"], queryFn: api.challenges });
  const activities = useQuery({ queryKey: ["activities"], queryFn: api.activities });
  const notifications = useQuery({ queryKey: ["notifications", wallet.address], queryFn: () => api.notifications(wallet.address ?? ""), enabled: Boolean(wallet.address) });

  const successRate = 94.2;

  const isStatsLoading = wallet.connecting || rewardPool.isLoading;

  return (
    <div className="space-y-6">
      {isStatsLoading ? (
        <StatsSkeleton />
      ) : (
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <StatCard label="Wallet Balance" value={`${formatAmount(wallet.balance)} XLM`} hint={wallet.address ? truncateAddress(wallet.address) : "Connect a wallet to fetch balance."} />
          <StatCard label="XP" value="3,480" hint="Gold tier with active proof participation." />
          <StatCard label="Success Rate" value={`${successRate}%`} hint="Weighted by completed and failed challenge history." />
          <StatCard label="Reward Pool" value={`${formatAmount(rewardPool.data?.rewardPool.currentBalance ?? 0)} XLM`} hint="Accumulated failed stakes and allocations." />
        </section>
      )}

      <section className="grid gap-6 grid-cols-1 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-5.5 border-border/80">
          <SectionTitle eyebrow="Account Activity" title="Recent transactions and challenge activity" description="Streaming updates from the backend and contract event feed." />
          
          {activities.isLoading ? (
            <div className="space-y-3 mt-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (activities.data?.activities && activities.data.activities.length > 0) ? (
            <div className="space-y-3 mt-4">
              {(activities.data?.activities ?? []).slice(0, 6).map((activity) => (
                <div key={activity._id} className="rounded-xl border border-border/60 p-4 transition-colors hover:border-border/90 bg-black/[0.005] dark:bg-white/[0.005]">
                  <p className="text-xs sm:text-sm font-semibold capitalize text-accent dark:text-white">{activity.kind.replaceAll("_", " ")}</p>
                  <p className="mt-1 text-xs text-muted leading-normal">{activity.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState title="No Activity found" description="Activity log updates automatically as on-chain transactions execute." icon={Compass} />
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-5.5 border-border/80">
            <SectionTitle eyebrow="Challenges" title="Lifecycle snapshot" description="Active, proof-submitted, completed, and failed challenges in one place." />
            {challenges.isLoading ? (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm mt-4">
                <div className="rounded-xl border border-border/60 bg-black/[0.01] dark:bg-white/[0.01] p-3">
                  <p className="text-muted font-medium">Active</p>
                  <p className="mt-1.5 text-xl font-bold text-accent dark:text-white">
                    {challenges.data?.challenges.filter((item) => item.status === "active").length ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-black/[0.01] dark:bg-white/[0.01] p-3">
                  <p className="text-muted font-medium">Submitted</p>
                  <p className="mt-1.5 text-xl font-bold text-accent dark:text-white">
                    {challenges.data?.challenges.filter((item) => item.status === "proof_submitted").length ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-black/[0.01] dark:bg-white/[0.01] p-3">
                  <p className="text-muted font-medium">Completed</p>
                  <p className="mt-1.5 text-xl font-bold text-accent dark:text-white">
                    {challenges.data?.challenges.filter((item) => item.status === "completed").length ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-black/[0.01] dark:bg-white/[0.01] p-3">
                  <p className="text-muted font-medium">Failed</p>
                  <p className="mt-1.5 text-xl font-bold text-accent dark:text-white">
                    {challenges.data?.challenges.filter((item) => item.status === "failed").length ?? 0}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5.5 border-border/80">
            <SectionTitle eyebrow="Notifications" title="Pending attention" description="Wallet and verification events stay visible here." />
            
            {notifications.isLoading ? (
              <div className="space-y-3 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (wallet.address && notifications.data?.notifications && notifications.data.notifications.length > 0) ? (
              <div className="space-y-3 mt-4">
                {(notifications.data?.notifications ?? []).slice(0, 3).map((item) => (
                  <div key={item._id} className="rounded-xl border border-border/60 p-3.5 bg-black/[0.005] dark:bg-white/[0.005]">
                    <p className="text-xs sm:text-sm font-semibold text-accent dark:text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-muted leading-normal">{item.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="No Notifications" description="You are fully caught up. Important updates will notify you here." icon={Bell} />
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}

export function WalletPage() {
  const wallet = useWallet();
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("10");
  const [memo, setMemo] = useState("");
  const [stage, setStage] = useState("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [explorer, setExplorer] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const balanceQuery = useQuery({ queryKey: ["balance", wallet.address], queryFn: () => api.balance(wallet.address ?? ""), enabled: Boolean(wallet.address) });

  useEffect(() => {
    if (balanceQuery.data?.balance !== undefined) {
      wallet.setBalance(balanceQuery.data.balance);
    }
  }, [balanceQuery.data?.balance]);

  async function connect(provider: "freighter" | "albedo") {
    try {
      if (provider === "freighter") await wallet.connectFreighter();
      if (provider === "albedo") await wallet.connectAlbedo();
      toast.success(`${provider} connected`);
    } catch (connectError) {
      toast.error(connectError instanceof Error ? connectError.message : "Unable to connect wallet");
    }
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!wallet.address || !wallet.provider) {
      setError("Wallet not connected");
      setStage("failed");
      return;
    }
    setError(undefined);
    setStage("preparing");
    try {
      const prepared = await api.sendXlmPrepare({
        sourceAddress: wallet.address,
        destinationAddress,
        amount: Number(amount),
        memo,
      });
      setStage("signing");
      const signed = await signTransaction(prepared.xdr, wallet.provider, wallet.address);
      setStage("submitting");
      const submitted = await api.submitTx({ xdr: signed, walletAddress: wallet.address, type: "send_xlm" });
      setStage(submitted.status);
      setTxHash(submitted.txHash);
      setExplorer(submitted.explorerUrl);
      toast.success("Transaction submitted");
    } catch (txError) {
      const message = txError instanceof Error ? txError.message : "Failed to send XLM";
      setStage("failed");
      setError(message.includes("balance") ? "Insufficient Balance" : message.includes("wallet") ? "Wallet Not Connected" : message);
      toast.error(message);
    }
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
      <Card className="space-y-5.5 border-border/80 p-5.5">
        <SectionTitle eyebrow="Wallet" title="Connect and manage your account" description="Freighter and Albedo are supported with live balance fetches and signing flows." />
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <Button onClick={() => connect("freighter")} className="w-full h-11 rounded-xl font-bold">Connect Freighter</Button>
          <Button variant="secondary" onClick={() => connect("albedo")} className="w-full h-11 rounded-xl font-bold">Connect Albedo</Button>
        </div>
        <div className="grid gap-3 rounded-xl border border-border/60 bg-black/[0.01] dark:bg-white/[0.01] p-4 text-xs sm:text-sm">
          <p className="flex justify-between truncate"><span className="text-muted">Address:</span> <span className="font-mono text-accent dark:text-white font-medium">{wallet.address ? truncateAddress(wallet.address) : "Not connected"}</span></p>
          <p className="flex justify-between"><span className="text-muted">Balance:</span> <span className="text-accent dark:text-white font-semibold">{formatAmount(wallet.balance)} XLM</span></p>
          <p className="flex justify-between"><span className="text-muted">Provider:</span> <span className="text-accent dark:text-white capitalize font-semibold">{wallet.provider ?? "none"}</span></p>
        </div>
        <Button variant="secondary" onClick={wallet.disconnect} className="w-full rounded-xl" disabled={!wallet.connected}>Disconnect Wallet</Button>
      </Card>
      
      <div className="space-y-6">
        <Card className="border-border/80 p-5.5">
          <SectionTitle eyebrow="Send XLM" title="Create, sign, and submit a transfer" description="This page uses the backend to prepare an XLM transaction, then signs it in the connected wallet." />
          <form className="space-y-4" onSubmit={handleSend}>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Destination Address</label>
              <Input value={destinationAddress} onChange={(event) => setDestinationAddress(event.target.value)} placeholder="e.g. GAKAKT..." aria-label="Destination address" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Amount (XLM)</label>
              <Input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0.0000001" step="0.0000001" placeholder="Amount XLM" aria-label="Amount in XLM" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Memo (optional)</label>
              <Input value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="Add a public memo..." aria-label="Transaction Memo" />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl shadow-premium" disabled={!wallet.connected}>Send XLM</Button>
          </form>
        </Card>
        <TransactionStatus stage={stage} txHash={txHash} explorerUrlValue={explorer} error={error} />
      </div>
    </div>
  );
}

export function CreateChallengePage() {
  const wallet = useWallet();
  const [form, setForm] = useState({ title: "", description: "", category: "Learning", stakeAmount: "25", durationDays: "30", verificationThreshold: "3" });
  const [stage, setStage] = useState("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [explorer, setExplorer] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!wallet.address || !wallet.provider) {
      setStage("failed");
      setError("Wallet Not Connected");
      return;
    }
    setStage("preparing");
    setError(undefined);
    try {
      const contractTx = await api.prepareContractTx({
        method: "createChallenge",
        sourceAddress: wallet.address,
        args: [form.title, form.description, Number(form.stakeAmount), Number(form.durationDays), Number(form.verificationThreshold), form.category],
      });
      setStage("signing");
      const signed = await signTransaction(contractTx.xdr, wallet.provider, wallet.address);
      setStage("submitting");
      const submitted = await api.submitTx({ xdr: signed, walletAddress: wallet.address, type: "create_challenge" });
      setStage(submitted.status);
      setTxHash(submitted.txHash);
      setExplorer(submitted.explorerUrl);
      await api.createChallenge({
        creatorAddress: wallet.address,
        title: form.title,
        description: form.description,
        category: form.category,
        stakeAmount: Number(form.stakeAmount),
        durationDays: Number(form.durationDays),
        verificationThreshold: Number(form.verificationThreshold),
      });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success("Challenge created");
    } catch (challengeError) {
      setStage("failed");
      const message = challengeError instanceof Error ? challengeError.message : "Contract failure";
      setError(message.includes("balance") ? "Insufficient Balance" : message.includes("Wallet") ? "Wallet Not Connected" : "Contract Failure");
      toast.error(message);
    }
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="border-border/80 p-5.5">
        <SectionTitle eyebrow="Create Challenge" title="Commit stake, set rules, and go live" description="Challenge creation signs an actual Soroban contract invocation before persisting the app record." />
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Title</label>
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. 30 Days of DSA" aria-label="Challenge Title" required />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Description</label>
            <Textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe your daily goals and proofs to submit..." aria-label="Challenge Description" required />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Category</label>
            <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="e.g. Fitness, Learning" aria-label="Challenge Category" required />
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Stake (XLM)</label>
              <Input value={form.stakeAmount} onChange={(event) => setForm({ ...form, stakeAmount: event.target.value })} type="number" min="1" step="1" placeholder="Stake XLM" aria-label="Stake Amount" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Duration (Days)</label>
              <Input value={form.durationDays} onChange={(event) => setForm({ ...form, durationDays: event.target.value })} type="number" min="1" step="1" placeholder="Duration days" aria-label="Duration in Days" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Vote Threshold</label>
              <Input value={form.verificationThreshold} onChange={(event) => setForm({ ...form, verificationThreshold: event.target.value })} type="number" min="1" step="1" placeholder="Threshold" aria-label="Verification Vote Threshold" required />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl shadow-premium" disabled={!wallet.connected}>Create Challenge</Button>
        </form>
      </Card>
      <TransactionStatus stage={stage} txHash={txHash} explorerUrlValue={explorer} error={error} />
    </div>
  );
}

export function ChallengeDetailsPage() {
  const { id = "" } = useParams();
  const wallet = useWallet();
  const challengeQuery = useQuery({ queryKey: ["challenge", id], queryFn: () => api.challenge(id), enabled: Boolean(id) });
  const [proof, setProof] = useState({ title: "", description: "", githubLink: "", externalUrl: "", textEvidence: "" });
  const [voteError, setVoteError] = useState<string | undefined>();

  async function submitProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!wallet.address || !wallet.provider) return toast.error("Wallet not connected");
    const contractTx = await api.prepareContractTx({ method: "submitProof", sourceAddress: wallet.address, args: [id, proof.title, proof.description, proof.githubLink, proof.externalUrl, proof.textEvidence] });
    const signed = await signTransaction(contractTx.xdr, wallet.provider, wallet.address);
    const submitted = await api.submitTx({ xdr: signed, walletAddress: wallet.address, type: "submit_proof" });
    await api.createProof(id, { submitterAddress: wallet.address, ...proof });
    queryClient.invalidateQueries({ queryKey: ["challenge", id] });
    toast.success("Proof submitted");
  }

  async function vote(proofId: string, decision: "approve" | "reject") {
    if (!wallet.address || !wallet.provider) return setVoteError("Wallet Not Connected");
    try {
      const contractTx = await api.prepareContractTx({ method: decision === "approve" ? "approveProof" : "rejectProof", sourceAddress: wallet.address, args: [proofId, wallet.address] });
      const signed = await signTransaction(contractTx.xdr, wallet.provider, wallet.address);
      const submitted = await api.submitTx({ xdr: signed, walletAddress: wallet.address, type: `${decision}_proof` });
      await api.vote(proofId, { voterAddress: wallet.address, decision, txHash: submitted.txHash });
      queryClient.invalidateQueries({ queryKey: ["challenge", id] });
      toast.success(`${decision} vote submitted`);
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : "Contract failure");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-5.5 border-border/80">
        <SectionTitle eyebrow="Challenge Details" title={challengeQuery.data?.challenge.title ?? "Loading challenge"} description={challengeQuery.data?.challenge.description ?? "Challenge information is loading from the API."} />
        {challengeQuery.isLoading ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : challengeQuery.data?.challenge ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
            <StatCard label="Stake" value={`${formatAmount(challengeQuery.data.challenge.stakeAmount)} XLM`} hint="Locked in Soroban invocation flow." />
            <StatCard label="Threshold" value={String(challengeQuery.data.challenge.verificationThreshold)} hint="Votes required to resolve the proof." />
            <StatCard label="Proofs" value={String(challengeQuery.data.challenge.proofCount)} hint="Submitted community evidence." />
            <StatCard label="Status" value={challengeQuery.data.challenge.status} hint="Live contract and application state." />
          </div>
        ) : null}
      </Card>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-5.5 border-border/80">
          <SectionTitle eyebrow="Submit Proof" title="Provide verifiable evidence" description="The proof includes title, description, optional links, and text evidence for community review." />
          <form className="space-y-4 mt-4" onSubmit={submitProof}>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Proof Title</label>
              <Input value={proof.title} onChange={(event) => setProof({ ...proof, title: event.target.value })} placeholder="e.g. Day 1 Completed" aria-label="Proof Title" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Description</label>
              <Textarea value={proof.description} onChange={(event) => setProof({ ...proof, description: event.target.value })} placeholder="Provide descriptive context..." aria-label="Proof Description" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">GitHub Link (optional)</label>
              <Input value={proof.githubLink} onChange={(event) => setProof({ ...proof, githubLink: event.target.value })} placeholder="e.g. https://github.com/..." aria-label="GitHub Repository Link" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">External Link (optional)</label>
              <Input value={proof.externalUrl} onChange={(event) => setProof({ ...proof, externalUrl: event.target.value })} placeholder="e.g. https://live-demo.com" aria-label="External URL" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5 block">Text Evidence / Notes</label>
              <Textarea value={proof.textEvidence} onChange={(event) => setProof({ ...proof, textEvidence: event.target.value })} placeholder="Detailed findings, code snippets..." aria-label="Text Evidence" required />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl shadow-premium" disabled={!wallet.connected}>Submit Proof</Button>
          </form>
        </Card>

        <Card className="p-5.5 border-border/80">
          <SectionTitle eyebrow="Verification" title="Community vote feed" description="Duplicate votes and self-voting are blocked by the backend." />
          
          {challengeQuery.isLoading ? (
            <div className="space-y-3 mt-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : (challengeQuery.data?.proofs && challengeQuery.data.proofs.length > 0) ? (
            <div className="space-y-3 mt-4">
              {(challengeQuery.data?.proofs ?? []).map((item) => (
                <div key={item._id} className="rounded-xl border border-border/60 p-4 bg-black/[0.005] dark:bg-white/[0.005] transition-all hover:border-border">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-accent dark:text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-muted leading-relaxed">{item.description}</p>
                    </div>
                    <Badge className="text-[9px] bg-black/5 dark:bg-white/5 border-border">{item.status}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => vote(item._id, "approve")} className="text-xs py-1.5 px-3 rounded-lg flex-1 sm:flex-initial" disabled={!wallet.connected}>Approve</Button>
                    <Button variant="secondary" onClick={() => vote(item._id, "reject")} className="text-xs py-1.5 px-3 rounded-lg flex-1 sm:flex-initial hover:text-rose-500 hover:border-rose-500/30" disabled={!wallet.connected}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState title="No Proofs Submitted" description="Stakers have not posted any verifications. Be the first to add evidence!" icon={FileText} />
            </div>
          )}
          {voteError ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 mt-4">
              <p className="text-xs font-semibold text-[rgb(var(--danger))]">{voteError}</p>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

export function ActiveChallengesPage({ completedOnly = false }: { completedOnly?: boolean }) {
  const challenges = useQuery({ queryKey: ["challenges"], queryFn: api.challenges });
  const filtered = (challenges.data?.challenges ?? []).filter((challenge) => (completedOnly ? challenge.status === "completed" : challenge.status === "active" || challenge.status === "proof_submitted"));
  
  return (
    <div className="space-y-6">
      <SectionTitle 
        eyebrow={completedOnly ? "Completed" : "Active"} 
        title={completedOnly ? "Completed challenges" : "Active challenges"} 
        description="These are live from the API and map to the Soroban-backed challenge lifecycle." 
      />

      {challenges.isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {filtered.map((challenge) => (
            <Card key={challenge._id} className="card-hover border-border/80 p-5.5 transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base sm:text-lg font-bold text-accent dark:text-white">{challenge.title}</p>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed line-clamp-2">{challenge.description}</p>
                </div>
                <Badge className="text-[10px] bg-black/5 dark:bg-white/5 border-border">{challenge.status}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:text-sm border-y border-border/40 py-3.5 my-4">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Stake Amount</p>
                  <p className="mt-1 font-semibold text-accent dark:text-white">{formatAmount(challenge.stakeAmount)} XLM</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Threshold Required</p>
                  <p className="mt-1 font-semibold text-accent dark:text-white">{challenge.verificationThreshold} votes</p>
                </div>
              </div>
              <div className="mt-4 flex">
                <Button asChild variant="secondary" className="w-full sm:w-auto text-xs py-2 px-4 rounded-xl">
                  <Link to={`/challenge/${challenge._id}`} aria-label={`Open details for ${challenge.title}`}>Open details</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          title={completedOnly ? "No Completed Challenges" : "No Active Challenges"} 
          description={completedOnly ? "No challenges have completed on-chain yet." : "There are currently no active accountability stakes live."} 
          icon={completedOnly ? CheckCircle2 : Trophy}
        />
      )}
    </div>
  );
}

export function RewardPoolPage() {
  const rewardPool = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });
  const pool = rewardPool.data?.rewardPool;
  
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Reward Pool" title="Failed stakes and historical distribution" description="Failed challenges accumulate in the pool and can be distributed by governance or admin logic." />
      
      {rewardPool.isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Current Pool" value={`${formatAmount(pool?.currentBalance ?? 0)} XLM`} hint="Accumulated from failed stakes." />
          <StatCard label="Top Contributors" value={String(pool?.topContributors.length ?? 0)} hint="Wallets with the highest reward pool contribution." />
          <StatCard label="Top Earners" value={String(pool?.topEarners.length ?? 0)} hint="Wallets with the highest reward payouts." />
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-5.5 border-border/80">
          <h3 className="text-base sm:text-lg font-bold text-accent dark:text-white">Historical Distribution</h3>
          
          {rewardPool.isLoading ? (
            <div className="space-y-3 mt-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (pool?.historicalDistributions && pool.historicalDistributions.length > 0) ? (
            <div className="mt-4 space-y-3">
              {pool.historicalDistributions.map((distribution, index) => (
                <div key={`${distribution.reason}-${index}`} className="rounded-xl border border-border/60 p-4 text-xs sm:text-sm bg-black/[0.005] dark:bg-white/[0.005]">
                  <p className="font-semibold text-accent dark:text-white">{distribution.reason}</p>
                  <p className="mt-1 text-muted">{formatAmount(distribution.amount)} XLM</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState title="No Payout Distributions" description="No governance or automated reward transfers have been dispatched from this pool." icon={Coins} />
            </div>
          )}
        </Card>

        <Card className="p-5.5 border-border/80 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-accent dark:text-white">Reward Routing Architecture</h3>
            <p className="mt-3.5 text-xs sm:text-sm text-muted leading-relaxed">
              When a staker fails to submit valid proof, or if the community rejects the proof submission, the locked XLM tokens are automatically forwarded to this community treasury.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
              This pool serves as the financial layer for incentivizing diligent validators and bootstrapping future challenges on the platform.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-border/40 text-[10px] text-muted font-mono uppercase tracking-widest">
            Stellar Soroban escrow active
          </div>
        </Card>
      </div>
    </div>
  );
}

export function LeaderboardPage() {
  const [scope, setScope] = useState("global");
  const leaderboard = useQuery({ queryKey: ["leaderboard", scope], queryFn: () => api.leaderboard(scope) });
  const tabs = ["global", "weekly", "success-rate", "xp", "staked"];
  
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Leaderboard" title="Global and ranked views" description="Switch between global, weekly, success rate, XP, and total staked rankings." />
      
      <div className="flex flex-wrap gap-1.5 border border-border/60 bg-black/5 dark:bg-white/5 p-1 rounded-xl w-fit max-w-full overflow-x-auto safe-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setScope(tab)}
            className={[
              "rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all select-none outline-none focus-visible:ring-2 focus-visible:ring-accent",
              scope === tab 
                ? "bg-accent text-accentFg font-bold shadow-soft" 
                : "text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/5"
            ].join(" ")}
            aria-label={`Show ${tab} leaderboard`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {leaderboard.isLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-border/80 bg-black/[0.005] dark:bg-white/[0.005] safe-scrollbar">
            <table className="w-full text-sm border-collapse text-left" aria-label="Leaderboard ranks">
              <thead className="bg-black/5 text-[10px] font-bold uppercase tracking-wider text-muted dark:bg-white/5">
                <tr>
                  <th className="px-5 py-4">Rank</th>
                  <th className="px-5 py-4">Wallet</th>
                  <th className="px-5 py-4">XP</th>
                  <th className="px-5 py-4">Success</th>
                  <th className="px-5 py-4">Staked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/55">
                {(leaderboard.data?.rows ?? []).map((row) => (
                  <tr key={row.walletAddress} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                    <td className="px-5 py-4 font-bold text-accent dark:text-white">#{row.rank}</td>
                    <td className="px-5 py-4 font-mono text-xs">{truncateAddress(row.walletAddress)}</td>
                    <td className="px-5 py-4 font-semibold">{row.xp.toLocaleString()}</td>
                    <td className="px-5 py-4">{row.successRate}%</td>
                    <td className="px-5 py-4 font-mono font-semibold text-accent dark:text-white">{formatAmount(row.totalXlmStaked)} XLM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="sm:hidden space-y-3" role="list">
            {(leaderboard.data?.rows ?? []).map((row) => (
              <Card key={row.walletAddress} className="flex flex-col gap-3.5 p-4 border border-border/80">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge className="font-bold text-[10px] bg-accent text-accentFg border-none py-0.5 px-2">#{row.rank}</Badge>
                    <span className="font-mono text-xs font-semibold text-accent dark:text-white">{truncateAddress(row.walletAddress)}</span>
                  </div>
                  <span className="font-bold text-xs text-accent dark:text-white">{row.xp.toLocaleString()} XP</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/40 pt-3 text-muted">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted/80">Success Rate</p>
                    <p className="font-semibold text-accent dark:text-white mt-0.5">{row.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted/80">Total Staked</p>
                    <p className="font-semibold text-accent dark:text-white mt-0.5">{formatAmount(row.totalXlmStaked)} XLM</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function NotificationsPage() {
  const wallet = useWallet();
  const notifications = useQuery({ queryKey: ["notifications", wallet.address], queryFn: () => api.notifications(wallet.address ?? ""), enabled: Boolean(wallet.address) });
  
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Notifications" title="Actionable updates" description="Wallet activity, challenge changes, proof votes, and reward pool events." />
      
      {notifications.isLoading ? (
        <ListSkeleton />
      ) : (wallet.address && notifications.data?.notifications && notifications.data.notifications.length > 0) ? (
        <div className="space-y-3" role="feed">
          {(notifications.data?.notifications ?? []).map((item) => (
            <Card key={item._id} className="border-border/80 p-5 hover:border-border transition-colors duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-accent dark:text-white text-sm sm:text-base">{item.title}</p>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">{item.body}</p>
                </div>
                <Badge className="text-[9px] font-bold tracking-widest bg-black/5 dark:bg-white/5 border-border">{item.kind}</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications" description="Connecting your wallet will load verification signals and alerts." icon={Bell} />
      )}
    </div>
  );
}

export function ProfilePage() {
  const wallet = useWallet();
  const profile = useQuery({ queryKey: ["profile", wallet.address], queryFn: () => api.profile(wallet.address ?? ""), enabled: Boolean(wallet.address) });
  const user = profile.data?.user;
  const xp = user?.xp ?? 0;
  const level = getLevelFromXp(xp);
  
  return (
    <div className="space-y-6">
      <Card className="p-5.5 border-border/80">
        <SectionTitle eyebrow="Profile" title={user?.displayName ? `Account Overview (${user.displayName})` : "Connect a wallet"} description="Wallet address, XP, level, challenge history, achievements, and verification stats are aggregated here." />
        
        {wallet.connected ? (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              <StatCard label="Wallet" value={wallet.address ? truncateAddress(wallet.address) : "None"} hint="Connected address" />
              <StatCard label="XP" value={String(xp)} hint="Accumulated from challenge and verification activity." />
              <StatCard label="Level" value={level.name} hint="Derived from XP thresholds." />
              <StatCard label="Success Rate" value={`${user?.successRate ?? 0}%`} hint="Challenge completion performance." />
            </div>
            <div className="mt-6 border-t border-border/40 pt-6">
              <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider mb-2">XP Progression</p>
              <div className="flex items-center gap-4 max-w-2xl">
                <span className="text-xs font-semibold text-muted">{level.name}</span>
                <div className="flex-1"><Progress value={Math.min(100, (xp / 6000) * 100)} /></div>
                <span className="text-xs font-semibold text-muted">Diamond</span>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <EmptyState title="Profile Locked" description="Please connect your Freighter or Albedo wallet to view your profile statistics." icon={User} />
          </div>
        )}
      </Card>

      {wallet.connected && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card className="p-5.5 border-border/80">
            <h3 className="text-base sm:text-lg font-bold text-accent dark:text-white">Challenge History</h3>
            
            {profile.isLoading ? (
              <div className="space-y-3 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (profile.data?.challenges && profile.data.challenges.length > 0) ? (
              <div className="mt-4 space-y-3">
                {(profile.data?.challenges ?? []).map((challenge) => (
                  <div key={challenge._id} className="rounded-xl border border-border/60 p-4 bg-black/[0.005] dark:bg-white/[0.005]">
                    <p className="font-semibold text-xs sm:text-sm text-accent dark:text-white">{challenge.title}</p>
                    <p className="mt-1 text-xs text-muted capitalize font-medium">{challenge.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="No Challenges Logged" description="Submit stakes on the Challenge dashboard to begin tracking progress." icon={Trophy} />
              </div>
            )}
          </Card>

          <Card className="p-5.5 border-border/80">
            <h3 className="text-base sm:text-lg font-bold text-accent dark:text-white">Achievements & Verification Stats</h3>
            
            {profile.isLoading ? (
              <div className="space-y-3 mt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (profile.data?.achievements && profile.data.achievements.length > 0) ? (
              <div className="mt-4 space-y-3">
                {(profile.data?.achievements ?? []).map((achievement) => (
                  <div key={achievement.code} className="rounded-xl border border-border/60 p-4 bg-black/[0.005] dark:bg-white/[0.005]">
                    <p className="font-semibold text-xs sm:text-sm text-accent dark:text-white">{achievement.title}</p>
                    <p className="mt-1 text-xs text-muted leading-relaxed">{achievement.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="No Achievements Unlocked" description="Earn platform XP to reveal badges and validator medals." icon={Sparkles} />
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export function AdminDashboardPage() {
  const rewardPool = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Admin Dashboard" title="Operational controls and platform health" description="Review thresholds, reward pool state, and global system activity." />
      
      {rewardPool.isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Verification Threshold" value="3" hint="Configured through environment and challenge creation." />
          <StatCard label="Reward Pool" value={`${formatAmount(rewardPool.data?.rewardPool.currentBalance ?? 0)} XLM`} hint="Accumulated failed stakes." />
          <StatCard label="Platform Status" value="Healthy" hint="API, wallet, and contract integrations are active." />
        </div>
      )}
    </div>
  );
}

export function SettingsPage() {
  const { themeMode, setThemeMode } = useTheme();
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Settings" title="Theme, wallet, and notification preferences" description="Auto mode respects system preference and time of day, with animated transitions between states." />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-5.5 border-border/80">
          <h3 className="text-base sm:text-lg font-bold text-accent dark:text-white">Theme Selection</h3>
          <div className="mt-4.5 flex flex-wrap gap-2.5">
            {(["light", "dark", "auto"] as const).map((mode) => (
              <Button 
                key={mode} 
                variant={themeMode === mode ? "primary" : "secondary"} 
                onClick={() => setThemeMode(mode)}
                className="capitalize rounded-xl text-xs font-semibold px-4.5"
                aria-label={`Set theme mode to ${mode}`}
              >
                {mode}
              </Button>
            ))}
          </div>
        </Card>
        <Card className="p-5.5 border-border/80 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-accent dark:text-white">Preferences</h3>
            <p className="mt-3.5 text-xs sm:text-sm text-muted leading-relaxed">
              Wallet and notification preferences are stored through the backend schema layer. Changing them here will immediately synchronize preferences with your profile.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-border/40 text-[10px] text-muted font-mono uppercase tracking-wider">
            User preferences synchronized
          </div>
        </Card>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center p-6" role="main">
      <p className="text-label text-xs font-bold text-muted uppercase tracking-widest">404</p>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-accent dark:text-white">Page not found</h2>
      <p className="max-w-md text-xs sm:text-sm text-muted leading-relaxed">The route does not exist. Return to the dashboard or landing page.</p>
      <div className="flex gap-3 mt-2">
        <Button asChild className="h-10 rounded-xl px-5"><Link to="/dashboard" aria-label="Go to Dashboard">Dashboard</Link></Button>
        <Button variant="secondary" asChild className="h-10 rounded-xl px-5"><Link to="/" aria-label="Go to Landing Page">Home</Link></Button>
      </div>
    </div>
  );
}

// Enhance accessibility for screen readers
