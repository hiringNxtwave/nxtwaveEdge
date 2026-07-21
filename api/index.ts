// api/index.ts — Vercel serverless entry point
// Self-contained: registers all routes before export, no dependency on dist/index.js

import express from "express";
import compression from "compression";

const app = express();
app.use(compression());
app.use(express.json());

// Health check (always available, no DB needed)
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "NxtWave Edge API is running on Vercel",
  });
});

// Initialize all routes before handling any request
let initDone = false;
const initPromise = (async () => {
  try {
    const { registerRoutes } = await import("../server/routes");
    const { runStartupMigrations } = await import("../server/db");

    await runStartupMigrations();
    await registerRoutes(app);
    initDone = true;
    console.log("[Vercel] All API routes registered");
  } catch (err) {
    console.error("[Vercel] Init error:", err);
    // Mark as done anyway so health check still works
    initDone = true;
  }
})();

// Gate all non-health requests behind initialization
app.use((req, res, next) => {
  if (req.path === "/api/health") return next();
  if (initDone) return next();
  initPromise.then(() => next()).catch(() => next());
});

export default app;
