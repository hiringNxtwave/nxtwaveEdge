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
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group" data-testid="link-home">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-clean">
              <Handshake className="text-primary-foreground w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">NxtWave</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
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
              <div className="flex items-center space-x-3 md:space-x-6">
                <Button
                  variant="ghost"
                  onClick={() => setChatbotOpen(!chatbotOpen)}
                  className={cn(
                    "flex items-center gap-2 h-auto px-3 py-2 hover:bg-accent rounded-lg transition-colors min-h-[44px]",
                    chatbotOpen ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="button-toggle-chatbot"
                  title="AI Assistant"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden md:inline text-sm font-medium">AI Assistant</span>
                  {!chatbotOpen && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 md:gap-3 h-auto px-2 md:px-3 py-2 hover:bg-accent rounded-lg transition-colors min-h-[44px]"
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
                      <div className="hidden md:flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground" data-testid="text-user-name">
                          {user?.firstName || user?.email?.split('@')[0] || 'User'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground md:hidden transition-transform group-data-[state=open]:rotate-180" />
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
              <div className="flex items-center space-x-3 md:space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => window.location.href = "/api/login"}
                  className="min-h-[44px] px-4"
                  data-testid="button-signin"
                >
                  Sign In
                </Button>
                {location === "/" && (
                  <Button 
                    onClick={() => window.location.href = "/api/login"}
                    className="min-h-[44px] px-4 hidden sm:inline-flex"
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
              className="lg:hidden min-h-[44px] min-w-[44px] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-3">
              {!isAuthenticated ? (
                // Mobile navigation for unauthenticated users
                <>
                  {location === "/for-students" ? (
                    <>
                      <Link 
                        href="/" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-companies"
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          For Companies
                        </Button>
                      </Link>
                      <Link 
                        href="/for-colleges" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-colleges"
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          For Colleges
                        </Button>
                      </Link>
                      <Link 
                        href="/for-students" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-students"
                      >
                        <Button 
                          variant="default" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] bg-primary text-primary-foreground"
                        >
                          For Students
                        </Button>
                      </Link>
                    </>
                  ) : location === "/for-colleges" ? (
                    <>
                      <Link 
                        href="/" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-companies"
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          For Companies
                        </Button>
                      </Link>
                      <Link 
                        href="/for-colleges" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-colleges"
                      >
                        <Button 
                          variant="default" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] bg-primary text-primary-foreground"
                        >
                          For Colleges
                        </Button>
                      </Link>
                      <Link 
                        href="/for-students" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-students"
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          For Students
                        </Button>
                      </Link>
                    </>
                  ) : (
                    // Default navigation for landing page
                    <>
                      <Link 
                        href="/for-colleges" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-colleges"
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          For Colleges
                        </Button>
                      </Link>
                      <Link 
                        href="/for-students" 
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="link-mobile-for-students"
                      >
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start font-medium transition-colors min-h-[48px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          For Students
                        </Button>
                      </Link>
                    </>
                  )}
                  <div className="border-t border-border pt-3 mt-3">
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.location.href = "/api/login";
                      }}
                      className="w-full min-h-[48px] font-medium"
                      data-testid="button-mobile-signin"
                    >
                      Sign In
                    </Button>
                  </div>
                </>
              ) : (
                // Mobile navigation for authenticated users
                <>
                  <Link 
                    href="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-dashboard"
                  >
                    <Button 
                      variant={location === "/" ? "default" : "ghost"} 
                      className={cn(
                        "w-full justify-start font-medium transition-colors min-h-[48px]",
                        location === "/" 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link 
                    href="/browse" 
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-browse"
                  >
                    <Button 
                      variant={location === "/browse" ? "default" : "ghost"} 
                      className={cn(
                        "w-full justify-start font-medium transition-colors min-h-[48px]",
                        location === "/browse" 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      Browse Profiles
                    </Button>
                  </Link>
                  <Link 
                    href="/shortlist" 
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-shortlist"
                  >
                    <Button 
                      variant={location === "/shortlist" ? "default" : "ghost"} 
                      className={cn(
                        "w-full justify-start font-medium transition-colors min-h-[48px]",
                        location === "/shortlist" 
                          ? "bg-primary text-primary-foreground" 
                          : shortlistCount > 0 
                            ? "text-primary hover:text-primary hover:bg-primary/10" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Heart className={cn("w-4 h-4 mr-2", shortlistCount > 0 ? "fill-current" : "")} />
                      Shortlisted
                      {shortlistCount > 0 && (
                        <span className="ml-auto bg-primary/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {shortlistCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <div className="border-t border-border pt-3 mt-3">
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md cursor-pointer hover:bg-accent transition-colors text-left min-h-[48px]"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setChatbotOpen(!chatbotOpen);
                      }}
                      data-testid="button-mobile-ai-assistant"
                    >
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">AI Assistant</span>
                    </button>
                    <Link 
                      href="/company-profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md cursor-pointer hover:bg-accent transition-colors min-h-[48px]"
                      data-testid="link-mobile-company-profile"
                    >
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">Company Profile</span>
                    </Link>
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors text-left text-red-600 min-h-[48px]"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.location.href = "/api/logout";
                      }}
                      data-testid="button-mobile-logout"
                    >
                      <span className="text-red-600">Sign Out</span>
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
        <Chatbot 
          isOpen={chatbotOpen} 
          onToggle={() => setChatbotOpen(!chatbotOpen)}
          context={{ page: location, user }}
        />
      )}
    </header>
  );
}
