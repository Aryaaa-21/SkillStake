import { Link } from "react-router-dom";
import { Compass, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "../components/ui";

export function LandingPage() {
  const highlights = ["Stake XLM", "Community verification", "Reward pool routing", "XP and rankings"];
  
  return (
    <div className="space-y-12 max-w-[1440px] mx-auto">
      {/* Hero Section - 2 Column Desktop, Stacked Mobile */}
      <section className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left column: Hero content (Max-width 700px) */}
        <div className="flex-1 max-w-[700px] space-y-6">
          <Badge className="bg-black/5 dark:bg-white/5 border-border">Stellar accountability layer</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-accent dark:text-white leading-[1.1] font-raleway">
            Stake on your success without leaving a premium control surface.
          </h2>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            SkillStake locks XLM into Soroban-backed challenges, routes failed stakes into a reward pool, and keeps every proof, vote, and payout visible on-chain.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="h-11 px-6 rounded-xl shadow-premium font-raleway" id="tour-step-create-challenge-landing">
              <Link to="/create">Create Challenge</Link>
            </Button>
            <Button variant="secondary" asChild className="h-11 px-6 rounded-xl font-raleway">
              <Link to="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
          <div className="grid gap-4 pt-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {highlights.map((item) => (
              <Card key={item} className="card-hover p-6 border-border/70 hover:border-border transition-all duration-200">
                <p className="text-xs sm:text-sm font-semibold text-accent dark:text-white font-raleway">{item}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Right column: Activity panel (width 380px) */}
        <Card className="w-full lg:w-[380px] shrink-0 overflow-hidden p-0 border-border/80 shadow-md">
          <div className="border-b border-border/70 bg-black/[0.01] dark:bg-white/[0.01] p-6">
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Activity Preview</p>
            <h3 className="mt-1 text-lg font-bold text-accent dark:text-white flex items-center gap-1 font-raleway">
              <Sparkles className="h-4.5 w-4.5 text-amber-500" />
              Live accountability loop
            </h3>
          </div>
          <div className="space-y-4 p-6">
            {[
              ["User Created Challenge", "Complete 30 Days of DSA"],
              ["User Submitted Proof", "Repository link and progress notes"],
              ["Community Approved Proof", "Threshold reached, stake returned"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-border/60 bg-black/[0.01] dark:bg-white/[0.01] p-4 transition-all duration-200 hover:border-border">
                <p className="text-xs sm:text-sm font-semibold text-accent dark:text-white font-raleway">{title}</p>
                <p className="mt-1 text-xs text-muted leading-normal">{body}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Highlights Grid */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border-border/80 text-center flex flex-col justify-between h-full">
          <div>
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Network</p>
            <p className="mt-2.5 text-lg font-extrabold text-accent dark:text-white font-raleway">Stellar Testnet</p>
          </div>
          <p className="mt-2 text-xs text-muted leading-normal">Soroban RPC integration is live.</p>
        </Card>
        <Card className="p-6 border-border/80 text-center flex flex-col justify-between h-full">
          <div>
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Wallets</p>
            <p className="mt-2.5 text-lg font-extrabold text-accent dark:text-white font-raleway font-semibold">Freighter + Albedo</p>
          </div>
          <p className="mt-2 text-xs text-muted leading-normal">Connect, sign, and disconnect easily.</p>
        </Card>
        <Card className="p-6 border-border/80 text-center flex flex-col justify-between h-full">
          <div>
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Verification</p>
            <p className="mt-2.5 text-lg font-extrabold text-accent dark:text-white font-raleway font-semibold">Decentralized Voting</p>
          </div>
          <p className="mt-2 text-xs text-muted leading-normal">Multi-party threshold verification.</p>
        </Card>
        <Card className="p-6 border-border/80 text-center flex flex-col justify-between h-full">
          <div>
            <p className="text-label text-[10px] font-bold text-muted uppercase tracking-wider">Rewards</p>
            <p className="mt-2.5 text-lg font-extrabold text-accent dark:text-white font-raleway font-semibold">Escrow Routing</p>
          </div>
          <p className="mt-2 text-xs text-muted leading-normal">Failed stakes enrich the reward pool.</p>
        </Card>
      </section>
    </div>
  );
}
