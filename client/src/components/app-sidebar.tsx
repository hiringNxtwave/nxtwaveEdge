import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useShortlist } from "@/contexts/shortlist-context";
import { useState, useEffect } from "react";
import { Chatbot } from "@/components/chatbot";
import {
  LayoutDashboard,
  Search,
  Heart,
  Building2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  User,
  LogOut,
  Handshake,
  BarChart3,
  Layers,
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
  { href: "/", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/browse", icon: Search, label: "Browse Talent" },
  { href: "/shortlist", icon: Heart, label: "Shortlisted", badge: true },
  { href: "/talent-dashboard", icon: BarChart3, label: "Talent Analytics" },
  { href: "/shortlisting", icon: Layers, label: "Hiring Pipeline" },
  { href: "/company-profile", icon: Building2, label: "Company Profile" },
];

export default function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { shortlistCount } = useShortlist();
  const [collapsed, setCollapsed] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-w",
      `${collapsed ? SIDEBAR_MINI : SIDEBAR_FULL}px`
    );
  }, [collapsed]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location === href || location.startsWith(href + "/");
  };

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : user?.email?.split("@")[0] || "User";

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen z-40 flex flex-col bg-slate-950 border-r border-slate-800/80 transition-all duration-300 ease-in-out shadow-xl shadow-black/10",
          collapsed ? "w-[68px]" : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-14 border-b border-slate-800/80 shrink-0 select-none",
            collapsed ? "px-0 justify-center" : "px-4 gap-3"
          )}
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <Handshake className="w-4 h-4 text-slate-950" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-[15px] tracking-tight">NxtWave</span>
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
            const active = isActive(item.href, item.exact);
            const showBadge = item.badge && shortlistCount > 0;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer group relative",
                    active
                      ? "bg-emerald-500/12 text-emerald-400"
                      : "text-slate-500 hover:text-slate-100 hover:bg-slate-800/70",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && showBadge && (
                    <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                      {shortlistCount}
                    </span>
                  )}
                  {collapsed && showBadge && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/80 p-2 space-y-0.5 shrink-0">
          {/* AI Assistant */}
          <button
            onClick={() => setChatbotOpen(!chatbotOpen)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[13px] font-medium transition-all duration-150 cursor-pointer",
              chatbotOpen
                ? "bg-emerald-500/12 text-emerald-400"
                : "text-slate-500 hover:text-slate-100 hover:bg-slate-800/70",
              collapsed && "justify-center"
            )}
            title={collapsed ? "AI Assistant" : undefined}
          >
            <MessageCircle className={cn("w-4 h-4 shrink-0", chatbotOpen ? "text-emerald-400" : "text-slate-500")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">AI Assistant</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </>
            )}
          </button>

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
                <Link href="/company-profile" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700 my-1" />
              <DropdownMenuItem
                className="text-red-400 focus:text-red-300 focus:bg-slate-800 cursor-pointer"
                onClick={() => (window.location.href = "/api/logout")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full flex items-center rounded-lg px-2.5 py-2 text-slate-700 hover:text-slate-400 hover:bg-slate-800/70 transition-all duration-150",
              collapsed ? "justify-center" : "justify-end"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <>
                <span className="text-[11px] mr-1.5 text-slate-700">Collapse</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Chatbot Panel */}
      {chatbotOpen && <Chatbot />}
    </>
  );
}
