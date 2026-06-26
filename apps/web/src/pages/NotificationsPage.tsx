import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, Badge, Skeleton } from "../components/ui";
import { Bell, ShieldCheck, Trophy, Info } from "lucide-react";

export function NotificationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
          <Bell className="h-6 w-6 text-accent dark:text-white" />
          Alert Center
        </h2>
        <p className="text-sm text-muted">Acknowledge challenge created logs, verification milestones, and reward payouts.</p>
      </div>

      <Card className="p-6 border-border/80" id="tour-step-notifications">
        <NotificationsList />
      </Card>
    </div>
  );
}

import { useDappStore } from "../lib/store";

function NotificationsList() {
  const notifications = useDappStore((state) => state.notifications);

  const getIcon = (kind: string) => {
    switch (kind) {
      case "challenge_created":
        return <Trophy className="h-4 w-4 text-blue-500" />;
      case "proof_approved":
        return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
      default:
        return <Info className="h-4 w-4 text-muted" />;
    }
  };

  return notifications.length > 0 ? (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <div key={notif._id} className="flex gap-4 p-4 border border-border/60 rounded-2xl hover:border-border hover:bg-black/[0.005] dark:hover:bg-white/[0.005] transition-all duration-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card shadow-sm shrink-0">
            {getIcon(notif.kind)}
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold text-accent dark:text-white">{notif.title}</h4>
            <p className="text-xs text-muted leading-relaxed">{notif.body}</p>
          </div>
          <div className="text-[10px] text-muted font-mono whitespace-nowrap">
            {new Date(notif.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12">
      <Bell className="h-8 w-8 text-muted/60 mx-auto mb-2" />
      <p className="text-xs font-semibold text-accent dark:text-white">Alert stream clear</p>
      <p className="text-[11px] text-muted mt-1">Milestones and verification responses will alert here.</p>
    </div>
  );
}
