import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function NotFound() {
  useScrollToTop();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-foreground/10 dark:text-foreground/5 tracking-tighter select-none">
            404
          </h1>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Page not found
          </h2>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          className="h-10 px-6 text-sm font-semibold"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}