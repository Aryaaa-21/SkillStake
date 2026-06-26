import { useState } from "react";
import { useDappStore } from "../lib/store";
import { useWallet } from "../lib/wallet";
import { Card, Button, Input, Textarea, Badge } from "../components/ui";
import { ShieldCheck, Download, Clipboard, Star, MessageSquare, Terminal, Eye } from "lucide-react";
import { toast } from "sonner";

export function UserValidationPage() {
  const wallet = useWallet();
  const { telemetryLogs, feedbackLogs, addFeedback } = useDappStore();
  
  const [displayName, setDisplayName] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.address) {
      toast.error("Please connect your wallet to submit feedback.");
      return;
    }
    if (!feedbackText.trim()) {
      toast.error("Feedback text cannot be empty.");
      return;
    }

    addFeedback(wallet.address, displayName || "Anonymous Staker", rating, feedbackText);
    
    // Clear form
    setDisplayName("");
    setRating(5);
    setFeedbackText("");
  };

  const exportTelemetryJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify({
          exportedAt: new Date().toISOString(),
          totalInteractionsCount: telemetryLogs.length,
          totalFeedbacksCount: feedbackLogs.length,
          telemetryLogs,
          feedbackLogs
        }, null, 2)
      );
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "skillstake_validation_telemetry.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Telemetry logs exported successfully!");
    } catch (err) {
      toast.error("Failed to export telemetry data");
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Transaction Hash copied to clipboard");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent dark:text-white" />
            User Validation Control Center
          </h2>
          <p className="text-sm text-muted">Auditable logs of 10+ wallet transactions, staker feedback logs, and telemetry data export options.</p>
        </div>
        <Button onClick={exportTelemetryJson} className="text-xs h-9.5 px-4 rounded-xl flex items-center gap-1.5 shadow-premium">
          <Download className="h-4 w-4" />
          Export telemetry JSON
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1.3fr_0.7fr]" id="tour-step-user-validation">
        {/* Left Side: Telemetry logs */}
        <Card className="p-6 border-border/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-accent dark:text-white flex items-center gap-1.5">
                <Terminal className="h-4.5 w-4.5 text-muted" />
                On-Chain Telemetry Log Ledger
              </h3>
              <p className="text-xs text-muted">Audited interactions with the deployed Soroban contract.</p>
            </div>
            <Badge className="bg-black/5 dark:bg-white/5 border-border">
              {telemetryLogs.length} Entries
            </Badge>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto safe-scrollbar pr-1">
            {telemetryLogs.map((log) => (
              <div 
                key={log._id} 
                className="p-3.5 border border-border/60 rounded-xl hover:border-border hover:bg-black/[0.005] dark:hover:bg-white/[0.005] transition-all duration-200 text-xs space-y-2"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-[10px] text-muted truncate max-w-[120px] sm:max-w-xs">{log.walletAddress}</span>
                    <Badge className="scale-90 text-[9px] px-1 py-0 select-none bg-accent/5 text-accent dark:text-white capitalize">
                      {log.actionType.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center rounded-lg border border-border bg-black/[0.01] dark:bg-white/[0.01] px-2.5 py-1.5 font-mono text-[10px]">
                  <span className="text-muted truncate select-none">Tx Hash: {log.txHash}</span>
                  <button onClick={() => copyHash(log.txHash)} className="hover:text-fg ml-2 shrink-0 transition-colors">
                    <Clipboard className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Side: Feedback Submission and logs */}
        <div className="space-y-6">
          {/* Submit Feedback Form */}
          <Card className="p-5.5 border-border/80 space-y-4">
            <div>
              <h3 className="text-base font-bold text-accent dark:text-white flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-muted" />
                Submit product feedback
              </h3>
              <p className="text-xs text-muted">Submit your validation score directly to local storage.</p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Display Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Rustacean"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Rating (Stars)</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className={`h-5 w-5 ${star <= rating ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Feedback Message</label>
                <Textarea
                  rows={3}
                  required
                  placeholder="What is your experience staking on Stellar?"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={!wallet.connected}
                className="w-full h-10 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-premium"
              >
                Submit feedback
              </Button>
            </form>
          </Card>

          {/* Feedback list */}
          <Card className="p-5.5 border-border/80 space-y-4">
            <h3 className="text-sm font-bold text-accent dark:text-white">Recent staker comments</h3>
            
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto safe-scrollbar pr-1">
              {feedbackLogs.map((fb) => (
                <div key={fb._id} className="space-y-1 pb-3 border-b border-border/40 last:border-0 last:pb-0 text-xs">
                  <div className="flex justify-between items-baseline gap-2 flex-wrap">
                    <span className="font-bold text-accent dark:text-white">{fb.displayName}</span>
                    <span className="text-[10px] text-muted font-mono truncate max-w-[80px]">{fb.walletAddress}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: fb.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-muted leading-relaxed leading-normal mt-1">{fb.feedbackText}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
