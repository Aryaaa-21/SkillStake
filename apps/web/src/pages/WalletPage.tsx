import { useState } from "react";
import { useWallet } from "../lib/wallet";
import { Card, Button, Badge } from "../components/ui";
import { Wallet, CheckCircle, Copy, LogOut, Loader2, Link2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { analytics } from "../lib/analytics";

export function WalletPage() {
  const wallet = useWallet();
  const [connectingType, setConnectingType] = useState<"freighter" | "albedo" | null>(null);

  const handleConnectFreighter = async () => {
    setConnectingType("freighter");
    try {
      await wallet.connectFreighter();
      toast.success("Freighter Wallet connected successfully!");
      analytics.trackEvent("wallet_connected", { provider: "freighter" });
    } catch (e: any) {
      toast.error(e.message || "Failed to connect Freighter wallet");
    } finally {
      setConnectingType(null);
    }
  };

  const handleConnectAlbedo = async () => {
    setConnectingType("albedo");
    try {
      await wallet.connectAlbedo();
      toast.success("Albedo Wallet connected successfully!");
      analytics.trackEvent("wallet_connected", { provider: "albedo" });
    } catch (e: any) {
      toast.error(e.message || "Failed to connect Albedo wallet");
    } finally {
      setConnectingType(null);
    }
  };

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast.success("Wallet address copied to clipboard");
    }
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2 font-raleway">
          <Wallet className="h-6 w-6 text-accent dark:text-white" />
          Stellar wallet settings
        </h2>
        <p className="text-sm text-muted">Link your Freighter or Albedo account to stake XLM and verify proofs on-chain.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-[1.2fr_0.8fr]" id="tour-step-wallet">
        {/* Left Side: Status / Connection */}
        <Card className="p-6 border-border/80 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-accent dark:text-white font-raleway">Connection Interface</h3>
            <p className="text-xs text-muted">Manage your active public key cryptographic sessions.</p>
          </div>

          {wallet.connected && wallet.address ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider font-raleway">Active connection</p>
                  <p className="text-xs text-muted truncate mt-0.5">Connected via {wallet.provider}</p>
                </div>
                <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shrink-0 font-raleway">Active</Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider font-raleway">Stellar Public Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={wallet.address}
                      className="w-full rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-xs font-mono outline-none truncate"
                    />
                    <Button onClick={handleCopy} variant="secondary" className="px-3">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-border/40 text-xs">
                  <span className="text-muted font-medium">Stellar network context</span>
                  <span className="font-bold text-accent dark:text-white capitalize">{wallet.network}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-border/40 text-xs">
                  <span className="text-muted font-medium">Escrow contract link</span>
                  <span className="font-bold text-accent dark:text-white flex items-center gap-1.5 font-raleway">
                    Soroban
                    <Link2 className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={wallet.disconnect} variant="secondary" className="w-full text-rose-500 border-rose-500/20 hover:bg-rose-500/5 text-xs font-semibold flex items-center justify-center gap-2 font-raleway">
                  <LogOut className="h-4 w-4" />
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <p className="text-xs text-muted leading-relaxed">
                Connect your Stellar browser extension or web profile to interact with locked escrows. No funds are accessed without your explicit signature.
              </p>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 pt-2">
                <Button
                  onClick={handleConnectFreighter}
                  disabled={connectingType !== null}
                  className="h-12 text-xs font-bold rounded-xl flex items-center justify-center gap-2 font-raleway"
                >
                  {connectingType === "freighter" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                  Connect Freighter
                </Button>
                <Button
                  onClick={handleConnectAlbedo}
                  disabled={connectingType !== null}
                  variant="secondary"
                  className="h-12 text-xs font-bold rounded-xl flex items-center justify-center gap-2 font-raleway"
                >
                  {connectingType === "albedo" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                  Connect Albedo
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Right Side: Balance and Assets */}
        <Card className="p-6 border-border/80 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-accent dark:text-white font-raleway">Assets</h3>
            <p className="text-xs text-muted">Stellar native token balance querying.</p>
          </div>

          <div className="my-8 py-6 text-center border-y border-border/40 relative">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Account Balance</p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-accent dark:text-white flex items-baseline justify-center gap-1 font-raleway">
              {wallet.connected ? wallet.balance.toLocaleString() : "0.00"}
              <span className="text-sm font-bold text-muted font-bradley">XLM</span>
            </p>
          </div>

          <div className="space-y-3.5 text-xs text-muted leading-relaxed">
            <p>
              Stellar Lumens (XLM) serves as the primary currency for staking on accountability challenges.
            </p>
            {wallet.connected && (
              <a
                href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-accent dark:text-blue-400 hover:underline font-semibold font-raleway"
              >
                View account on Stellar.expert
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
