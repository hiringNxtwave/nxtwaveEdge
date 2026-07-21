import express from "express";
import compression from "compression";
import { registerRoutes } from "../server/routes";
import { runStartupMigrations } from "../server/db";

const app = express();
app.use(compression());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "NxtWave Edge API is running on Vercel",
  });
});

// Register all API routes from server/routes.ts
(async () => {
  try {
    await runStartupMigrations();
    await registerRoutes(app);
    console.log("All API routes registered successfully");
  } catch (error) {
    console.error("Error registering routes:", error);
  }
})();

export default app;
