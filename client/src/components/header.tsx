import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Handshake, Menu, Heart, Trophy, BookOpen, MessageCircle, User, Settings, Building, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useShortlist } from "@/contexts/shortlist-context";
import { Chatbot } from "@/components/chatbot";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { shortlistCount } = useShortlist();

  return (
    <header className="bg-card/95 backdrop-blur-md shadow-clean border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group" data-testid="link-home">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-clean">
              <Handshake className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">NxtWave</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-10">
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
              // Clean navigation for authenticated users
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
                  data-testid="link-browse-profiles"
                >
                  Browse Profiles
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
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={() => setChatbotOpen(!chatbotOpen)}
                  className={cn(
                    "flex items-center gap-2 h-auto px-3 py-2 hover:bg-accent rounded-lg transition-colors",
                    chatbotOpen ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="button-toggle-chatbot"
                  title="AI Assistant"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">AI Assistant</span>
                  {!chatbotOpen && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-3 h-auto px-3 py-2 hover:bg-accent rounded-lg transition-colors"
                      data-testid="button-user-dropdown"
                    >
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                          data-testid="img-profile-avatar"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-border">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className="hidden sm:flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground" data-testid="text-user-name">
                          {user?.firstName || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground sm:hidden transition-transform group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2">
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        {user?.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold leading-none text-foreground">
                            {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="p-0">
                      <Link 
                        href="/company-profile" 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer hover:bg-accent transition-colors"
                        data-testid="link-company-profile"
                      >
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">Company Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-0">
                      <button 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer hover:bg-accent transition-colors text-left"
                        onClick={() => setChatbotOpen(!chatbotOpen)}
                        data-testid="button-ai-assistant"
                      >
                        <MessageCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">AI Assistant</span>
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem asChild className="p-0">
                      <button 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors text-left text-red-600"
                        onClick={() => window.location.href = "/api/logout"}
                        data-testid="button-logout"
                      >
                        <span className="text-red-600">Sign Out</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
      
      {/* AI Chatbot */}
      {isAuthenticated && (
        <Chatbot 
          isOpen={chatbotOpen} 
          onToggle={() => setChatbotOpen(!chatbotOpen)}
          context={{ page: location, user }}
        />
      )}
    </header>
  );
}
