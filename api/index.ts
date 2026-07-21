// api/index.ts — Vercel serverless entry point
// Bundle this with esbuild during build so @shared/* path aliases are resolved.

import express from "express";
import compression from "compression";

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Security headers (same as server/index.ts)
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Health check — available immediately, no DB required
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "NxtWave Edge API is running on Vercel",
  });
});

// All other routes gated behind async initialization
let initDone = false;
let initError: string | null = null;

const initPromise = (async () => {
  try {
    const { runStartupMigrations } = await import("../server/db");
    const { registerRoutes } = await import("../server/routes");

    await runStartupMigrations();
    await registerRoutes(app);

    // Global error handler — must be after routes
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`[Vercel] Error ${status}: ${message}`);
      res.status(status).json({ message });
    });

    initDone = true;
    console.log("[Vercel] All API routes registered successfully");
  } catch (err: any) {
    console.error("[Vercel] Init error:", err);
    initError = err.message || "Initialization failed";
    initDone = true; // Mark done so requests don't hang forever
  }
})();

// Middleware: hold non-health requests until init completes
app.use((req, res, next) => {
  if (req.path === "/api/health") return next();
  if (initDone) {
    if (initError && req.path.startsWith("/api")) {
      return res.status(503).json({ message: "API initializing", error: initError });
    }
    return next();
  }
  initPromise.then(() => next()).catch(() => next());
});

export default app;
