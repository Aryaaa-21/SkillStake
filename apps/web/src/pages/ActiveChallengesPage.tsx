import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Card, Button, Input, Badge, Progress } from "../components/ui";
import { Search, Trophy, Clock, CheckCircle2, XCircle, ChevronRight, Compass } from "lucide-react";

export function ActiveChallengesPage({ completedOnly }: { completedOnly?: boolean }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "proof_submitted" | "completed" | "failed">(completedOnly ? "completed" : "all");
  
  const challenges = useQuery({
    queryKey: ["challenges"],
    queryFn: api.challenges
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />;
      case "failed":
        return <XCircle className="h-4.5 w-4.5 text-rose-500" />;
      case "proof_submitted":
        return <Clock className="h-4.5 w-4.5 text-amber-500" />;
      default:
        return <Trophy className="h-4.5 w-4.5 text-blue-500" />;
    }
  };

  const filtered = (challenges.data?.challenges ?? []).filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-accent dark:text-white" />
            Accountability commitments
          </h2>
          <p className="text-sm text-muted">Browse escrow challenges, check proof validation logs, and audit staker votes.</p>
        </div>
        <Button asChild className="text-xs h-9.5 px-4 rounded-xl shadow-premium">
          <Link to="/create">Create Challenge</Link>
        </Button>
      </div>

      {/* Filter and Search controls */}
      <Card className="p-4 border-border/80 flex flex-col md:flex-row gap-4 items-center justify-between" id="tour-step-browse">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
          <Input
            type="text"
            placeholder="Search challenges..."
            className="pl-10 py-2 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto safe-scrollbar pb-1 md:pb-0">
          {(["all", "active", "proof_submitted", "completed", "failed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                filterStatus === status
                  ? "border-accent bg-accent/5 text-accent dark:text-white"
                  : "border-border hover:border-accent/40 bg-transparent text-muted"
              }`}
            >
              {status.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </Card>

      {/* Grid List */}
      {challenges.isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="h-48 animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />
          <Card className="h-48 animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />
          <Card className="h-48 animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            // Vote resolution progress percentage
            const totalVotes = c.approvedVotes + c.rejectedVotes;
            const progressVal = c.verificationThreshold > 0 
              ? Math.min(100, Math.round((c.approvedVotes / c.verificationThreshold) * 100)) 
              : 0;

            return (
              <Card key={c._id} className="p-5 border-border/80 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <Badge className="bg-black/5 dark:bg-white/5 border-border">{c.category}</Badge>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(c.status)}
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider capitalize whitespace-nowrap">
                        {c.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-accent dark:text-white line-clamp-1">{c.title}</h3>
                    <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-2">{c.description}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 pt-4 border-t border-border/40">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-muted font-mono">
                      <span>Approval progress</span>
                      <span>{c.approvedVotes} / {c.verificationThreshold} votes</span>
                    </div>
                    <Progress value={progressVal} />
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Stake Amount</p>
                      <p className="text-xs font-bold text-accent dark:text-white">{c.stakeAmount} XLM</p>
                    </div>

                    <Button asChild className="text-[10px] h-8 px-3 rounded-lg flex items-center font-semibold">
                      <Link to={`/challenge/${c._id}`}>
                        Inspect Details
                        <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center border-dashed border-border bg-transparent">
          <Compass className="h-10 w-10 text-muted/60 mb-2" />
          <h4 className="font-bold text-accent dark:text-white text-sm">No accountability matches</h4>
          <p className="text-xs text-muted max-w-xs mt-1">Try tweaking your search term or select another filter tab above.</p>
        </Card>
      )}
    </div>
  );
}
