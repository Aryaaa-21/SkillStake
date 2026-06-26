import { useMemo, useState, useEffect, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Button, Card } from "./components/ui";
import { useTheme } from "./lib/theme";
import { useWallet } from "./lib/wallet";
import { api } from "./lib/api";
import { formatAmount, truncateAddress } from "./lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  Trophy,
  CheckCircle2,
  Coins,
  BarChart3,
  Bell,
  User,
  ShieldAlert,
  Settings,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
  Laptop
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/create", label: "Create Challenge", icon: PlusCircle },
  { to: "/active", label: "Active Challenges", icon: Trophy },
  { to: "/completed", label: "Completed Challenges", icon: CheckCircle2 },
  { to: "/reward-pool", label: "Reward Pool", icon: Coins },
  { to: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin Dashboard", icon: ShieldAlert },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { themeMode, setThemeMode } = useTheme();
  const wallet = useWallet();
  const networkQuery = useQuery({ queryKey: ["network"], queryFn: api.network });
  const rewardPoolQuery = useQuery({ queryKey: ["reward-pool"], queryFn: api.rewardPool });

  const [isOpen, setIsOpen] = useState(false);

  const activeLabel = useMemo(() => navItems.find((item) => item.to === location.pathname)?.label ?? "SkillStake", [location.pathname]);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const themeIcon = useMemo(() => {
    if (themeMode === "dark") return <Moon className="h-4 w-4" />;
    if (themeMode === "light") return <Sun className="h-4 w-4" />;
    return <Laptop className="h-4 w-4" />;
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(themeMode === "dark" ? "light" : themeMode === "light" ? "auto" : "dark");
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col p-6">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-bold tracking-tight" aria-label="SkillStake Home">
          <Sparkles className="h-6 w-6 text-accent dark:text-white" />
          <span>SkillStake</span>
        </Link>
        <p className="mt-2 text-xs text-muted leading-relaxed">Stake XLM on goals, verify progress, and earn XP.</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 safe-scrollbar" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "bg-accent text-accentFg font-semibold shadow-premium"
                    : "text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-fg",
                ].join(" ")
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.to === "/dashboard" ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      <Card className="mt-6 space-y-3.5 border-border/60 bg-black/[0.02] dark:bg-white/[0.02] p-4.5 rounded-xl">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Wallet Connection</span>
          {wallet.connected ? (
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          ) : (
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
          )}
        </div>
        <div className="grid gap-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted">Address</span>
            <span className="font-mono font-medium">{wallet.address ? truncateAddress(wallet.address) : "Not connected"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Network</span>
            <span className="font-medium">
              {networkQuery.data
                ? networkQuery.data.passphrase.includes("Public")
                  ? "Public"
                  : "Testnet"
                : "Loading"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Reward Pool</span>
            <span className="font-semibold text-accent dark:text-white">
              {formatAmount(rewardPoolQuery.data?.rewardPool.currentBalance ?? 0)} XLM
            </span>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="page-shell min-h-screen text-fg">
      <div className="noise-grid fixed inset-0 pointer-events-none opacity-[0.35]" />
      
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        
        {/* DESKTOP FIXED SIDEBAR */}
        <aside className="glass sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border/80 lg:flex z-30">
          {renderSidebarContent()}
        </aside>

        {/* MOBILE SLIDE-OUT DRAWER */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* BACKDROP OVERLAY */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                aria-hidden="true"
              />
              
              {/* SIDEBAR DRAWER */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="glass fixed bottom-0 left-0 top-0 z-50 h-full w-72 max-w-[85vw] border-r border-border/80 lg:hidden flex flex-col shadow-2xl"
              >
                <div className="absolute right-4 top-5">
                  <Button
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="h-9 w-9 p-0 rounded-lg flex items-center justify-center text-muted hover:text-fg"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {renderSidebarContent()}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* MAIN APPLICATION CONTAINER */}
        <div className="flex flex-1 flex-col min-w-0">
          
          {/* HEADER */}
          <header className="sticky top-0 z-30 border-b border-border/60 bg-[rgb(var(--bg)/0.8)] backdrop-blur-md">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              
              {/* MOBILE LEFT ELEMENT: HAMBURGER & TITLE */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(true)}
                  className="h-10 w-10 p-0 rounded-xl lg:hidden flex items-center justify-center text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider text-label lg:block hidden">
                    {activeLabel}
                  </p>
                  <h1 className="text-base lg:text-lg font-bold tracking-tight text-accent dark:text-white flex items-center gap-2">
                    <span className="lg:hidden block">{activeLabel}</span>
                    <span className="hidden lg:block">Control Panel</span>
                  </h1>
                </div>
              </div>

              {/* RIGHT UTILITIES */}
              <div className="flex items-center gap-2.5">
                {/* NETWORK BADGE - HIDDEN ON VERY SMALL MOBILE */}
                <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-black/[0.02] dark:bg-white/[0.02] px-3 py-1.5 text-xs text-muted font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="truncate max-w-[120px]">
                    {networkQuery.data ? networkQuery.data.passphrase : "Resolving"}
                  </span>
                </div>

                {/* THEME TOGGLE */}
                <Button
                  variant="secondary"
                  onClick={toggleTheme}
                  className="h-9.5 px-3 rounded-xl flex items-center gap-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label={`Switch theme (currently ${themeMode})`}
                >
                  {themeIcon}
                  <span className="capitalize hidden md:inline">{themeMode}</span>
                </Button>

                {/* WALLET BUTTON */}
                {wallet.connected ? (
                  <Button
                    variant="secondary"
                    onClick={wallet.disconnect}
                    className="h-9.5 px-3.5 rounded-xl text-xs font-semibold border-border/80 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-all duration-200"
                    aria-label="Disconnect wallet"
                  >
                    <span className="hidden md:inline">Disconnect</span>
                    <span className="font-mono ml-1 md:ml-0">
                      {wallet.address ? truncateAddress(wallet.address) : "Wallet"}
                    </span>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="h-9.5 px-4 rounded-xl text-xs font-semibold shadow-premium"
                  >
                    <Link to="/wallet" aria-label="Connect wallet page">Connect Wallet</Link>
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* MAIN PAGE BODY */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
            >
              {children}
            </motion.div>
          </main>
        </div>

      </div>
    </div>
  );
}

// Main wrapper for application pages
