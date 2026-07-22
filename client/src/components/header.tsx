import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Handshake, Menu, Heart, MessageCircle, User, ChevronDown, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useShortlist } from "@/contexts/shortlist-context";
import { Chatbot } from "@/components/chatbot";
import NotificationBell from "@/components/notification-bell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { shortlistCount } = useShortlist();

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="bg-card/80 backdrop-blur-xl shadow-clean border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Handshake className="text-primary-foreground w-4 h-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">NxtWave <span className="text-muted-foreground font-normal">EDGE</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                {location === "/for-students" ? (
                  <>
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                      For Companies
                    </Link>
                    <Link href="/for-colleges" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                      For Colleges
                    </Link>
                    <Link href="/for-students" className="text-sm text-foreground font-medium px-3 py-2 rounded-lg bg-muted">
                      For Students
                    </Link>
                  </>
                ) : location === "/for-colleges" ? (
                  <>
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                      For Companies
                    </Link>
                    <Link href="/for-colleges" className="text-sm text-foreground font-medium px-3 py-2 rounded-lg bg-muted">
                      For Colleges
                    </Link>
                    <Link href="/for-students" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                      For Students
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/for-colleges" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                      For Colleges
                    </Link>
                    <Link href="/for-students" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted">
                      For Students
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={cn(
                    "text-sm transition-colors px-3 py-2 rounded-lg",
                    location === "/" ? "text-foreground font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/browse"
                  className={cn(
                    "text-sm transition-colors px-3 py-2 rounded-lg",
                    location === "/browse" ? "text-foreground font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  Browse Talent
                </Link>
                <Link
                  href="/shortlist"
                  className={cn(
                    "text-sm transition-colors px-3 py-2 rounded-lg inline-flex items-center gap-1.5",
                    location === "/shortlist" ? "text-foreground font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", shortlistCount > 0 && "fill-current text-primary")} />
                  Shortlist
                  {shortlistCount > 0 && (
                    <span className="bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {shortlistCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="min-h-[40px] min-w-[40px] p-2"
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setChatbotOpen(!chatbotOpen)}
                  className={cn(
                    "hidden md:flex items-center gap-2 h-auto px-3 py-2 rounded-lg min-h-[40px]",
                    chatbotOpen ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  data-testid="button-toggle-chatbot"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">AI Assistant</span>
                </Button>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-auto px-2 py-1.5 hover:bg-muted rounded-lg min-h-[40px]"
                      data-testid="button-user-dropdown"
                    >
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      )}
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="p-3">
                      <p className="text-sm font-medium">{user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "User"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/jobs" className="flex items-center gap-2">
                        <span className="text-muted-foreground">Jobs</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer md:hidden">
                      <button onClick={() => setChatbotOpen(!chatbotOpen)} className="w-full flex items-center gap-2">
                        <span className="text-muted-foreground">AI Assistant</span>
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/";
                      }}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => (window.location.href = "/api/login")}
                  className="text-sm min-h-[40px] px-4"
                >
                  Sign In
                </Button>
                {location === "/" && (
                  <Button
                    onClick={() => (window.location.href = "/api/login")}
                    className="text-sm min-h-[40px] px-4 hidden sm:inline-flex"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden min-h-[40px] min-w-[40px] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-3 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {!isAuthenticated ? (
                <>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted">
                    For Companies
                  </Link>
                  <Link href="/for-colleges" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted">
                    For Colleges
                  </Link>
                  <Link href="/for-students" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted">
                    For Students
                  </Link>
                  <div className="border-t border-border mt-2 pt-2">
                    <Button onClick={() => { setMobileMenuOpen(false); window.location.href = "/api/login"; }} className="w-full text-sm min-h-[44px]">
                      Sign In
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className={cn("text-sm px-3 py-2.5 rounded-lg", location === "/" ? "font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    Dashboard
                  </Link>
                  <Link href="/browse" onClick={() => setMobileMenuOpen(false)} className={cn("text-sm px-3 py-2.5 rounded-lg", location === "/browse" ? "font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    Browse Talent
                  </Link>
                  <Link href="/shortlist" onClick={() => setMobileMenuOpen(false)} className={cn("text-sm px-3 py-2.5 rounded-lg inline-flex items-center gap-2", location === "/shortlist" ? "font-medium bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    <Heart className={cn("w-3.5 h-3.5", shortlistCount > 0 && "fill-current text-primary")} />
                    Shortlist
                  </Link>
                  <div className="border-t border-border mt-2 pt-2 space-y-1">
                    <button onClick={() => { setMobileMenuOpen(false); setChatbotOpen(!chatbotOpen); }} className="w-full text-left text-sm text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-lg hover:bg-muted flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      AI Assistant
                    </button>
                    <button onClick={() => { setMobileMenuOpen(false); window.location.href = "/api/logout"; }} className="w-full text-left text-sm text-red-600 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* AI Chatbot */}
      {isAuthenticated && (
        <Chatbot isOpen={chatbotOpen} onToggle={() => setChatbotOpen(!chatbotOpen)} context={{ page: location, user }} />
      )}
    </header>
  );
}
