import { Link } from "react-router-dom";
import { Card, Button } from "../components/ui";
import { AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 mx-auto text-rose-500">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-accent dark:text-white">Page Not Found</h3>
      <p className="text-xs text-muted leading-relaxed">
        The route you are trying to view does not exist on this dashboard. Verify the navigation link or return to Dashboard.
      </p>
      <Button asChild className="text-xs h-9.5 px-4 rounded-xl">
        <Link to="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
