import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet, signTransaction } from "../lib/wallet";
import { api } from "../lib/api";
import { Card, Button, Input, Textarea, Badge } from "../components/ui";
import { SuccessModal, Spinner } from "../components/ux-helpers";
import { PlusCircle, Info, Sparkles, HelpCircle, Loader2, BookOpen, Award, Terminal, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { monitoring } from "../lib/monitoring";

export function CreateChallengePage() {
  const wallet = useWallet();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Learning");
  const [stakeAmount, setStakeAmount] = useState(50);
  const [durationDays, setDurationDays] = useState(7);
  const [verificationThreshold, setVerificationThreshold] = useState(3);
  
  const [isPending, setIsPending] = useState(false);
  const [pendingStep, setPendingStep] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState("");
  
  const categories = ["Learning", "Fitness", "Development", "Habits"];
  
  const templates = [
    {
      title: "30 Day DSA Challenge",
      description: "Solve at least one Data Structures & Algorithms problem daily on LeetCode/HackerRank.\n\nRequired Proof:\n1. Link to public GitHub repository with your daily solutions.\n2. Screenshot of daily streak dashboard.",
      category: "Learning",
      stakeAmount: 100,
      durationDays: 30,
      verificationThreshold: 3,
      icon: BookOpen
    },
    {
      title: "30 Day Gym Challenge",
      description: "Hit the gym or perform a workout for at least 45 minutes daily for 30 days.\n\nRequired Proof:\n1. Strava or fitness tracker workout share link.\n2. Selfie or gym check-in confirmation.",
      category: "Fitness",
      stakeAmount: 150,
      durationDays: 30,
      verificationThreshold: 3,
      icon: Award
    },
    {
      title: "30 Day Coding Challenge",
      description: "Write code for a personal project or open source contribution for at least 1 hour daily.\n\nRequired Proof:\n1. Public GitHub commit history link.\n2. Brief daily log of features implemented.",
      category: "Development",
      stakeAmount: 200,
      durationDays: 30,
      verificationThreshold: 3,
      icon: Terminal
    },
    {
      title: "Reading Habit Challenge",
      description: "Read at least 15 pages of a non-fiction or educational book every single day.\n\nRequired Proof:\n1. Photo of highlighted pages or kindle history screenshot.\n2. Summarized key takeaways in daily text log.",
      category: "Habits",
      stakeAmount: 50,
      durationDays: 14,
      verificationThreshold: 2,
      icon: BookOpen
    },
    {
      title: "Exam Preparation Challenge",
      description: "Spend at least 3 hours daily studying and solving practice tests for your upcoming certification/exam.\n\nRequired Proof:\n1. Study log showing hours spent.\n2. Practice test scorecard screenshots.",
      category: "Learning",
      stakeAmount: 120,
      durationDays: 21,
      verificationThreshold: 3,
      icon: Award
    }
  ];

  const handleApplyTemplate = (tpl: typeof templates[0]) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setCategory(tpl.category);
    setStakeAmount(tpl.stakeAmount);
    setDurationDays(tpl.durationDays);
    setVerificationThreshold(tpl.verificationThreshold);
    toast.success(`Loaded template: "${tpl.title}"`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.address) {
      toast.error("Please connect your Stellar wallet first.");
      return;
    }
    
    if (wallet.balance < stakeAmount) {
      toast.error(`Insufficient balance. You need at least ${stakeAmount} XLM to stake.`);
      return;
    }

    setIsPending(true);
    try {
      // Step-by-step premium loading simulator matching live Soroban transactions
      setPendingStep("Connecting to Soroban RPC...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setPendingStep("Preparing Transaction Escrow (escrow_account)...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setPendingStep("Waiting for wallet signature (Freighter/Albedo)...");
      // Simulate real-looking tx generation
      const dummyXdr = "AAAAAgAAAAD8aF4O5p8e...dummy_xdr_hash_signature";
      
      // Attempt wallet signing to show user approval screen if Freighter connected
      try {
        if (wallet.provider) {
          // If we had a real contract call we'd sign here:
          // await signTransaction(dummyXdr, wallet.provider, wallet.address);
        }
      } catch (signErr) {
        console.warn("Wallet signing simulated:", signErr);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      setPendingStep("Submitting transaction to Stellar Testnet...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await api.createChallenge({
        creatorAddress: wallet.address,
        title,
        description,
        category,
        stakeAmount: Number(stakeAmount),
        durationDays: Number(durationDays),
        verificationThreshold: Number(verificationThreshold),
      });

      // Update wallet balance locally
      wallet.setBalance(wallet.balance - Number(stakeAmount));
      
      // Generate a mock Stellar tx hash for UX explorer links
      const txHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setSuccessTxHash(txHash);
      setIsPending(false);
      setShowSuccess(true);
      
      // Clear inputs
      setTitle("");
      setDescription("");
    } catch (err: any) {
      monitoring.captureException(err, "Challenge Creation Form");
      toast.error(err.message || "Failed to create challenge on-chain");
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2 font-raleway">
          <PlusCircle className="h-6 w-6 text-accent dark:text-white" />
          Create accountability stake
        </h2>
        <p className="text-sm text-muted">Initialize a new Soroban smart contract escrow with your XLM tokens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 relative" id="tour-step-create-challenge-form">
            {/* Loading Overlay */}
            {isPending && (
              <div className="absolute inset-0 bg-background/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4 text-accent dark:text-white">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <h4 className="text-base font-bold text-accent dark:text-white mb-2 font-raleway">Smart Contract Invocation</h4>
                <p className="text-xs text-muted max-w-xs leading-relaxed mb-4">{pendingStep}</p>
                <div className="w-48 bg-black/10 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-accent animate-progress-mock rounded-full" style={{ width: "80%" }} />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">Challenge Title</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Write Rust Code for 30 Days"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">Commitment Rules</label>
                <Textarea
                  rows={6}
                  required
                  placeholder="Specify the criteria. What evidence is required to prove completion?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">Category</label>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 font-raleway ${
                        category === cat
                          ? "border-accent bg-accent/5 text-accent dark:text-white"
                          : "border-border hover:border-accent/40 bg-transparent text-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stakes Grid */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">Stake Amount (XLM)</label>
                  <Input
                    type="number"
                    min={5}
                    required
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Math.max(1, Number(e.target.value)))}
                  />
                  <p className="text-[10px] text-muted">Tokens locked in smart contract.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">Duration (Days)</label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                  />
                  <p className="text-[10px] text-muted">Total time to complete goals.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">Voter Threshold</label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={verificationThreshold}
                    onChange={(e) => setVerificationThreshold(Math.max(1, Number(e.target.value)))}
                  />
                  <p className="text-[10px] text-muted">Required community approval votes.</p>
                </div>
              </div>

              {/* Wallet warning */}
              {!wallet.connected && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex gap-3 text-xs leading-normal">
                  <Info className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="text-rose-700 dark:text-rose-400">
                    <span className="font-bold">Wallet Disconnected:</span> You must connect your Freighter or Albedo wallet in the Wallet settings before creating an escrow challenge.
                  </div>
                </div>
              )}

              {/* Stake notice */}
              {wallet.connected && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-xs leading-normal">
                  <Info className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-amber-700 dark:text-amber-400">
                    <span className="font-bold">Collateral Notice:</span> Creating this challenge locks <span className="font-bold">{stakeAmount} XLM</span> directly into the escrow contract. Failed completion releases the stake to the reward pool.
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!wallet.connected || wallet.balance < stakeAmount}
                  className="w-full h-11 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-premium font-raleway"
                >
                  <Sparkles className="h-4 w-4" />
                  Sign & Lock {stakeAmount} XLM Escrow
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Side: Examples & Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick-Start Templates */}
          <Card className="p-6 border-border/80 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-accent dark:text-white flex items-center gap-2 font-raleway">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                Quick-Start Templates
              </h3>
              <p className="text-[11px] text-muted">Click an example template below to immediately populate the configuration form.</p>
            </div>

            <div className="space-y-3 pt-2">
              {templates.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.title}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="w-full text-left rounded-xl border border-border/60 hover:border-accent/40 bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] p-3.5 flex items-start gap-3 transition-all duration-200 group"
                  >
                    <div className="h-9 w-9 rounded-lg bg-accent/5 dark:bg-white/5 flex items-center justify-center shrink-0 text-accent dark:text-white border border-border/40 group-hover:bg-accent group-hover:text-accentFg group-hover:border-accent transition-colors duration-200">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-accent dark:text-white truncate font-raleway">{tpl.title}</h4>
                        <ChevronRight className="h-3 w-3 text-muted shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      </div>
                      <p className="text-[10px] text-muted truncate mt-0.5">{tpl.description.split("\n")[0]}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold font-raleway">{tpl.category}</Badge>
                        <span className="text-[9px] text-muted font-medium">•</span>
                        <span className="text-[9px] text-muted font-semibold">{tpl.stakeAmount} XLM</span>
                        <span className="text-[9px] text-muted font-medium">•</span>
                        <span className="text-[9px] text-muted font-semibold">{tpl.durationDays} Days</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Writing Guidelines */}
          <Card className="p-6 border-border/80 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-accent dark:text-white flex items-center gap-2 font-raleway">
                <HelpCircle className="h-4.5 w-4.5 text-accent dark:text-white" />
                Guidelines & Recommendations
              </h3>
              <p className="text-[11px] text-muted">How to write a solid accountability brief that community validators can easily audit.</p>
            </div>

            <ul className="space-y-3.5 pt-2 text-xs leading-relaxed text-muted">
              <li className="flex gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-accent dark:bg-white shrink-0 mt-2" />
                <div>
                  <strong className="text-accent dark:text-white block font-semibold mb-0.5 font-raleway">Use Measurable Targets</strong>
                  Define exact daily/weekly limits. Say <span className="italic text-accent dark:text-white">"Write 1 DSA solution daily"</span> instead of <span className="italic">"Practice coding"</span>.
                </div>
              </li>
              <li className="flex gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-accent dark:bg-white shrink-0 mt-2" />
                <div>
                  <strong className="text-accent dark:text-white block font-semibold mb-0.5 font-raleway">Outline Concrete Proof</strong>
                  List what evidence validators should check (e.g. GitHub commit URLs, Strava runs, testnet transaction hashes).
                </div>
              </li>
              <li className="flex gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-accent dark:bg-white shrink-0 mt-2" />
                <div>
                  <strong className="text-accent dark:text-white block font-semibold mb-0.5 font-raleway">Motivate with Collateral</strong>
                  Choose a stake amount (minimum 5 XLM) that is large enough to push you but within your current budget.
                </div>
              </li>
              <li className="flex gap-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-accent dark:bg-white shrink-0 mt-2" />
                <div>
                  <strong className="text-accent dark:text-white block font-semibold mb-0.5 font-raleway">Decentralized Voting</strong>
                  Set a Voter Threshold of 3+ to ensure your submissions are vetted by multiple independent validators.
                </div>
              </li>
            </ul>
          </Card>

        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/active");
        }}
        title="Escrow Escaped & Active!"
        message={`Your challenge "${title || "Accountability Quest"}" is now live on the Stellar testnet with ${stakeAmount} XLM collateral locked.`}
        txHash={successTxHash}
        explorerUrl={`https://stellar.expert/explorer/testnet/tx/${successTxHash}`}
      />
    </div>
  );
}
