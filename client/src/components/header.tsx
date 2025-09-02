import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Handshake, Menu, Heart, Trophy, BookOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useShortlist } from "@/contexts/shortlist-context";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { shortlistCount } = useShortlist();

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Handshake className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-foreground">NxtWave</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              // Marketing navigation for unauthenticated users
              <>
                {/* Only show relevant navigation based on current page */}
                {location === "/for-students" ? (
                  <>
                    <Link 
                      href="/" 
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-block py-1"
                      data-testid="link-for-companies"
                    >
                      For Companies
                    </Link>
                    <Link 
                      href="/for-colleges" 
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-block py-1"
                      data-testid="link-for-colleges"
                    >
                      For Colleges
                    </Link>
                    <Link 
                      href="/for-students" 
                      className="text-foreground border-b-2 border-primary transition-colors font-medium inline-block py-1"
                      data-testid="link-for-students"
                    >
                      For Students
                    </Link>
                  </>
                ) : location === "/for-colleges" ? (
                  <>
                    <Link 
                      href="/" 
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-block py-1"
                      data-testid="link-for-companies"
                    >
                      For Companies
                    </Link>
                    <Link 
                      href="/for-colleges" 
                      className="text-foreground border-b-2 border-primary transition-colors font-medium inline-block py-1"
                      data-testid="link-for-colleges"
                    >
                      For Colleges
                    </Link>
                    <Link 
                      href="/for-students" 
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-block py-1"
                      data-testid="link-for-students"
                    >
                      For Students
                    </Link>
                  </>
                ) : (
                  // Default navigation for landing page
                  <>
                    <Link 
                      href="/for-colleges" 
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-block py-1"
                      data-testid="link-for-colleges"
                    >
                      For Colleges
                    </Link>
                    <Link 
                      href="/for-students" 
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium inline-block py-1"
                      data-testid="link-for-students"
                    >
                      For Students
                    </Link>
                  </>
                )}
              </>
            ) : (
              // Functional navigation for authenticated users
              <>
                <Link 
                  href="/" 
                  className={cn(
                    "transition-colors font-medium inline-block py-1",
                    location === "/" 
                      ? "text-foreground border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="link-dashboard"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/browse" 
                  className={cn(
                    "transition-colors font-medium inline-block py-1",
                    location === "/browse" 
                      ? "text-foreground border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="link-browse-talent"
                >
                  Browse Talent
                </Link>
                <Link 
                  href="/talent-dashboard" 
                  className={cn(
                    "transition-colors font-medium inline-block py-1",
                    location === "/talent-dashboard" 
                      ? "text-foreground border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="link-talent-dashboard"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm">
                    <Trophy className="w-4 h-4" />
                    Talent Dashboard
                  </span>
                </Link>
                <Link 
                  href="/student-dashboard" 
                  className={cn(
                    "transition-colors font-medium inline-block py-1",
                    location === "/student-dashboard" 
                      ? "text-foreground border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="link-student-dashboard"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium text-sm">
                    <BookOpen className="w-4 h-4" />
                    Student Portal
                  </span>
                </Link>
                <Link 
                  href="/shortlist" 
                  className={cn(
                    "transition-colors font-medium inline-flex items-center gap-2 py-1 px-3 rounded-full",
                    location === "/shortlist" 
                      ? "text-white bg-primary" 
                      : shortlistCount > 0 
                        ? "text-primary bg-primary/10 hover:bg-primary/20" 
                        : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="link-shortlist"
                >
                  <Heart className={cn("w-4 h-4", shortlistCount > 0 ? "fill-current" : "")} />
                  Shortlisted
                  {shortlistCount > 0 && (
                    <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs font-semibold">
                      {shortlistCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                      data-testid="img-profile-avatar"
                    />
                  )}
                  <span className="text-sm font-medium" data-testid="text-user-name">
                    {user?.firstName || user?.email}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = "/api/logout"}
                  data-testid="button-logout"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-signin"
                >
                  Sign In
                </Button>
                {location === "/" && (
                  <Button 
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-start-hiring"
                  >
                    Browse Candidates
                  </Button>
                )}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/browse" 
                onClick={() => setMobileMenuOpen(false)}
                data-testid="link-mobile-browse"
              >
                <Button 
                  variant={location === "/browse" ? "default" : "ghost"} 
                  className={cn(
                    "w-full justify-start font-medium transition-colors",
                    location === "/browse" 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  Browse Candidates
                </Button>
              </Link>
              {shortlistCount > 0 && (
                <Link 
                  href="/shortlist" 
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-mobile-shortlist"
                >
                  <Button 
                    variant={location === "/shortlist" ? "default" : "ghost"} 
                    className={cn(
                      "w-full justify-start font-medium transition-colors",
                      location === "/shortlist" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Shortlisted ({shortlistCount})
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
