import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Mail,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SIDEBAR_FULL = 240;
const SIDEBAR_MINI = 72;

const navSections = [
  {
    label: "Platform",
    items: [
      { href: "/browse", icon: Search, label: "Browse Talent" },
      { href: "/jobs", icon: Briefcase, label: "Jobs" },
    ],
  },
];

const adminSections = [
  {
    label: "Management",
    items: [
      { href: "/admin", icon: Shield, label: "Admin" },
    ],
  },
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

  const isActive = (href: string) => {
    return location === href || location.startsWith(href + "/");
  };

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : user?.email?.split("@")[0] || "User";

  const renderNavItems = (items: typeof navSections[0]["items"], activeColor: string) => {
    return items.map((item) => {
      const active = isActive(item.href);
      return (
        <Link key={item.href} href={item.href}>
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
              active
                ? cn("bg-primary/10", activeColor)
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon
              className={cn(
                "w-4 h-4 shrink-0",
                active ? activeColor : "text-muted-foreground"
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </div>
        </Link>
      );
    });
  };

  const sidebarContent = (
    <>
      {/* Logo + Collapse */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-border shrink-0 select-none",
          collapsed ? "px-0 justify-center" : "px-4 gap-3"
        )}
      >
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center justify-center w-full h-full text-muted-foreground hover:text-foreground transition-colors"
            title="Expand sidebar"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>
        ) : (
          <>
            <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">E</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">EDGE</span>
            </Link>
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 overflow-y-auto", collapsed ? "px-2 pt-3" : "px-3")}>
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="px-3 pb-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {renderNavItems(section.items, "text-primary")}
            </div>
          </div>
        ))}

        {/* Admin section */}
        {user?.role === "admin" && adminSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="px-3 pb-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {renderNavItems(section.items, "text-primary")}
            </div>
          </div>
        ))}
      </nav>

      {/* Contact Us */}
      <div className={cn("shrink-0", collapsed ? "px-2 pb-3" : "px-3 pb-3")}>
        <button
          onClick={handleContactUs}
          disabled={contactSending || contactSent}
          className={cn(
            "w-full flex items-center gap-2 rounded-lg text-sm font-medium transition-colors",
            contactSent
              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-70 disabled:cursor-not-allowed",
            collapsed ? "justify-center p-2" : "px-3 py-2"
          )}
          title={contactSent ? "Message Sent" : "Contact Us"}
          data-testid="button-contact-us"
        >
          <Mail className="w-4 h-4 shrink-0" />
          {!collapsed && (
            <span className="truncate">{contactSent ? "Sent!" : contactSending ? "Sending..." : "Contact Us"}</span>
          )}
        </button>
      </div>

      {/* User Section */}
      <div className="border-t border-border p-2 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? displayName : undefined}
            >
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium truncate">{displayName}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            className="w-56"
          >
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild className="mt-1 cursor-pointer">
              <Link href="/jobs" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Jobs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
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
    </>
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col bg-card border-r border-border transition-all duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[240px]",
        "hidden md:flex"
      )}
    >
      {sidebarContent}
    </aside>
  );
}
