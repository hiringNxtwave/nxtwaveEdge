import { Link, useLocation } from "wouter";
import nxtWaveLogo from "@assets/image_1774348454567.png";
import { EdgeBadge } from "@/components/edge-badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Building2,
  ChevronLeft,
  User,
  LogOut,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SIDEBAR_FULL = 220;
const SIDEBAR_MINI = 68;

const navItems = [
  { href: "/browse", icon: Search, label: "Browse Talent", exact: false },
  { href: "/jobs", icon: Building2, label: "Jobs" },
];

export default function AppSidebar() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const handleContactUs = useCallback(async () => {
    if (contactSending || contactSent) return;
    setContactSending(true);
    try {
      const res = await fetch("/api/contact-general", { method: "POST", credentials: "include" });
      if (res.ok) {
        setContactSent(true);
        toast({ title: "Message sent!", description: "Our team will reach out to you shortly." });
        setTimeout(() => setContactSent(false), 5000);
      } else {
        toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to send", description: "Please try again.", variant: "destructive" });
    } finally {
      setContactSending(false);
    }
  }, [contactSending, contactSent, toast]);

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("sidebar-collapsed") === "1"; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-w",
      `${collapsed ? SIDEBAR_MINI : SIDEBAR_FULL}px`
    );
    try { localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);

  const isActive = (item: typeof navItems[0]) => {
    const { href, exact, aliases } = item as any;
    const allPaths = [href, ...(aliases || [])];
    if (exact === false || !exact) {
      return allPaths.some(p => location === p || location.startsWith(p + "/"));
    }
    return allPaths.some(p => location === p);
  };

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : user?.email?.split("@")[0] || "User";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col bg-slate-950 border-r border-slate-800/80 transition-all duration-300 ease-in-out shadow-xl shadow-black/10",
        collapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      {/* Logo + Collapse toggle */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-slate-800/80 shrink-0 select-none",
          collapsed ? "px-0 justify-center" : "px-4 gap-3"
        )}
      >
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center w-full h-full text-slate-600 hover:text-slate-300 transition-colors"
            title="Expand sidebar"
          >
            <img src={nxtWaveLogo} alt="NxtWave" className="h-6 w-auto brightness-0 invert" />
          </button>
        ) : (
          <>
            <Link href="/" className="flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity">
              <img src={nxtWaveLogo} alt="NxtWave" className="h-8 w-auto brightness-0 invert max-w-[130px]" />
              <EdgeBadge className="mt-0.5" />
            </Link>
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1 rounded-md text-slate-600 hover:text-slate-300 hover:bg-slate-800/70 transition-all shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Recruiting
          </span>
        </div>
      )}

      {/* Nav Items */}
      <nav className={cn("flex-1 overflow-y-auto space-y-0.5", collapsed ? "px-2 pt-4" : "px-2")}>
        {navItems.map((item) => {
          const active = isActive(item);

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer group relative",
                  active
                    ? "bg-blue-500/12 text-blue-400"
                    : "text-slate-500 hover:text-slate-100 hover:bg-slate-800/70",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Contact Us */}
      <div className={cn("shrink-0", collapsed ? "px-2 pb-3" : "px-3 pb-3")}>
        {collapsed ? (
          <button
            onClick={handleContactUs}
            disabled={contactSending || contactSent}
            className="w-full flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white p-2 transition-colors"
            title={contactSent ? "Message Sent ✓" : "Contact Us"}
            data-testid="button-contact-us"
          >
            <Mail className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleContactUs}
            disabled={contactSending || contactSent}
            className="w-full flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-[12px] font-semibold px-3 py-2 transition-colors"
            title="Contact NxtWave Edge"
            data-testid="button-contact-us"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>{contactSent ? "Message Sent ✓" : contactSending ? "Sending…" : "Contact Us"}</span>
          </button>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-800/80 p-2 space-y-0.5 shrink-0">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer text-slate-500 hover:text-slate-100 hover:bg-slate-800/70",
                collapsed && "justify-center"
              )}
              title={collapsed ? displayName : undefined}
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-slate-400" />
                </div>
              )}
              {!collapsed && (
                <span className="flex-1 text-left truncate text-slate-400">{displayName}</span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            className="w-56 bg-slate-900 border-slate-700 text-slate-200"
          >
            <div className="px-3 py-2.5 border-b border-slate-700">
              <p className="text-sm font-semibold text-slate-100 truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild className="mt-1 cursor-pointer focus:bg-slate-800 focus:text-white text-slate-300">
              <Link href="/jobs" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Jobs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700 my-1" />
            <DropdownMenuItem
              className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                navigate("/");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </aside>
  );
}
