import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Handshake, Menu, Heart } from "lucide-react";
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
            <span className="text-xl font-bold text-foreground">TalentConnect India</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse" data-testid="link-browse">
              <Button 
                variant={location === "/browse" ? "default" : "ghost"} 
                className={cn(
                  "font-medium transition-colors",
                  location === "/browse" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Browse Candidates
              </Button>
            </Link>
            {isAuthenticated && shortlistCount > 0 && (
              <Link 
                href="/shortlist" 
                className={cn(
                  "transition-colors flex items-center gap-2",
                  location === "/shortlist" 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid="link-shortlist"
              >
                <Heart className="w-4 h-4" />
                Shortlisted ({shortlistCount})
              </Link>
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
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  data-testid="button-start-hiring"
                >
                  Browse Candidates
                </Button>
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
        {mobileMenuOpen && (
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
