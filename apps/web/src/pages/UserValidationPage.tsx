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
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2 font-raleway">
            <ShieldCheck className="h-6 w-6 text-accent dark:text-white" />
            User Validation Control Center
          </h2>
          <p className="text-sm text-muted">Auditable logs of 10+ wallet transactions, staker feedback logs, and telemetry data export options.</p>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1.35fr_0.65fr]" id="tour-step-user-validation">
        {/* Left Side: Telemetry logs Table */}
        <Card className="p-6 border-border/80 space-y-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/40 pb-4">
            <div>
              <h3 className="text-base font-bold text-accent dark:text-white flex items-center gap-1.5 font-raleway">
                <Terminal className="h-4.5 w-4.5 text-muted" />
                On-Chain Telemetry Log Ledger
              </h3>
              <p className="text-xs text-muted">Audited interactions with the deployed Soroban contract.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-black/5 dark:bg-white/5 border-border font-raleway">
                {telemetryLogs.length} Entries
              </Badge>
              <Button onClick={exportTelemetryJson} variant="secondary" className="text-xs h-8 px-3 rounded-lg flex items-center gap-1.5 font-raleway">
                <Download className="h-3.5 w-3.5" />
                Export JSON
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto safe-scrollbar -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="min-w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-border/30 bg-black/[0.005] dark:bg-white/[0.002] text-[10px] font-bold text-muted uppercase tracking-wider">
                    <th className="py-3 px-3 w-[220px]">Address</th>
                    <th className="py-3 px-3 w-[160px]">Action</th>
                    <th className="py-3 px-3 w-[140px]">Date</th>
                    <th className="py-3 px-3 w-[120px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20 text-xs">
                  {telemetryLogs.map((log) => {
                    const truncatedAddr = log.walletAddress.slice(0, 10) + "..." + log.walletAddress.slice(-4);
                    return (
                      <tr key={log._id} className="hover:bg-black/[0.005] dark:hover:bg-white/[0.003] transition-colors">
                        {/* Address Column */}
                        <td className="py-3 px-3 w-[220px] font-mono font-medium truncate">
                          <span 
                            className="cursor-help border-b border-dashed border-muted/40 pb-0.5" 
                            title={log.walletAddress}
                          >
                            {truncatedAddr}
                          </span>
                        </td>

                        {/* Action Column */}
                        <td className="py-3 px-3 w-[160px] align-middle">
                          <Badge className="px-2 py-0.5 text-[9px] select-none bg-accent/5 text-accent dark:text-white capitalize border-accent/25">
                            {log.actionType.replaceAll("_", " ")}
                          </Badge>
                        </td>

                        {/* Date Column */}
                        <td className="py-3 px-3 w-[140px] text-muted whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>

                        {/* Status Column */}
                        <td className="py-3 px-3 w-[120px] align-middle">
                          <div className="flex flex-col gap-1">
                            <span 
                              className="inline-flex items-center gap-1 w-fit text-[9px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-full"
                            >
                              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                              Success
                            </span>
                            <div 
                              className="flex items-center gap-0.5 text-[9px] text-muted font-mono cursor-pointer hover:text-fg select-none max-w-[110px]"
                              title={`Click to copy Transaction Hash:\n${log.txHash}`}
                              onClick={() => copyHash(log.txHash)}
                            >
                              <span className="truncate overflow-hidden text-ellipsis">{log.txHash}</span>
                              <Clipboard className="h-2.5 w-2.5 shrink-0" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Right Side: Feedback Submission and logs */}
        <div className="space-y-6">
          {/* Submit Feedback Form */}
          <Card className="p-6 border-border/80 space-y-5">
            <div>
              <h3 className="text-base font-bold text-accent dark:text-white flex items-center gap-1.5 font-raleway">
                <MessageSquare className="h-4.5 w-4.5 text-muted" />
                Submit Product Feedback
              </h3>
              <p className="text-xs text-muted">Submit your validation score directly to local storage.</p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted tracking-wide font-raleway">Display Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Rustacean"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted tracking-wide font-raleway">Rating (Stars)</label>
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
                <label className="text-[11px] font-semibold text-muted tracking-wide font-raleway">Feedback Message</label>
                <Textarea
                  required
                  placeholder="What is your experience staking on Stellar?"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[140px]"
                />
              </div>

              <Button
                type="submit"
                disabled={!wallet.connected}
                className="w-full h-11 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-premium font-raleway"
              >
                Submit feedback
              </Button>
            </form>
          </Card>

          {/* Feedback list */}
          <Card className="p-6 border-border/80 space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold text-accent dark:text-white font-raleway">
                Recent Staker Comments
              </h3>
              <Badge className="bg-black/5 dark:bg-white/5 border-border font-raleway">
                {feedbackLogs.length} Feedbacks
              </Badge>
            </div>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto safe-scrollbar pr-1">
              {feedbackLogs.map((fb) => (
                <div 
                  key={fb._id} 
                  className="rounded-xl border border-border/60 p-4 bg-black/[0.01] dark:bg-white/[0.01] hover:border-border transition-all duration-200 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar placement */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent dark:bg-white/10 dark:text-white font-raleway font-bold text-xs select-none">
                      {fb.displayName.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Metadata & rating */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-accent dark:text-white font-raleway text-xs truncate max-w-[120px]">{fb.displayName}</span>
                          <span 
                            className="text-[9px] text-muted font-mono cursor-help"
                            title={fb.walletAddress}
                          >
                            ({fb.walletAddress.slice(0, 6)}...{fb.walletAddress.slice(-4)})
                          </span>
                        </div>
                        {/* Rating badge alignment */}
                        <div className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-1.5 py-0.5">
                          <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-500">{fb.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-muted leading-relaxed mt-2 text-xs">{fb.feedbackText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
