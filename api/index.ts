import express from "express";
import compression from "compression";

const app = express();
app.use(compression());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "NxtWave Edge API is running on Vercel",
  });
});

// Placeholder routes - will be migrated from server/routes.ts
app.get("/api/students", async (_req, res) => {
  res.json({ message: "Students endpoint - migration pending" });
});

app.get("/api/skills", async (_req, res) => {
  res.json({ message: "Skills endpoint - migration pending" });
});

export default app;
