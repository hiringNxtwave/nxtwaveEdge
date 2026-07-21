import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { registerRoutes } from "./routes";
import { runStartupMigrations } from "./db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const log = (message: string) => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [express] ${message}`);
};

const app = express();
// Gzip/Brotli compression for all text responses (HTML, JSON, JS, CSS)
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Security headers ──────────────────────────────────────────────────────────
app.use((_req, res, next) => {
  // Prevent browsers inferring a different MIME type
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Deny framing by other origins (clickjacking protection)
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  // Force HTTPS for 2 years (only meaningful on the deployed domain)
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  // Allow popups (needed for OAuth flows) but isolate window context
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  // Don't send the full URL as referrer to third parties
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Restrict powerful browser APIs
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  // Content Security Policy — permissive enough for all analytics + strict enough to block XSS
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://assets.apollo.io https://snap.licdn.com https://js.hsforms.net https://js.hs-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https:",
      "frame-src 'self' https://www.googletagmanager.com https://forms.hubspot.com https://forms.hsforms.com",
      "worker-src blob: 'self'",
      "child-src blob: 'self'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ")
  );
  next();
});

// Health check — registered first so Cloud Run can verify the app is up
// even while the rest of initialisation (DB seed, route setup) is still running
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// For Vercel serverless: export the app without listening
// For local development: listen on a port
const isVercel = process.env.VERCEL === "true";
const port = parseInt(process.env.PORT || "5000", 10);

if (!isVercel) {
  // Local development: create HTTP server and start listening
  const server = http.createServer(app);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
} else {
  // Vercel: just log that we're running serverless
  log("running in Vercel serverless mode");
}

// Async initialisation — runs after the server is already accepting requests
(async () => {
  try {
    await runStartupMigrations();
    await registerRoutes(app);

    // Global error handler — must be added after routes
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error ${status}: ${message}`);
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      // Vite dev middleware (import kept dynamic so it's never evaluated in prod)
      const { createServer: createViteServer } = await import("vite");
      try {
        const vite = await createViteServer({
          server: { middlewareMode: true, hmr: { server }, allowedHosts: true as const },
          appType: "custom",
        });
        app.use(vite.middlewares);
        app.use("*", async (req, res, next) => {
          try {
            const clientTemplate = path.resolve(__dirname, "..", "client", "index.html");
            let template = await fs.promises.readFile(clientTemplate, "utf-8");
            const page = await vite.transformIndexHtml(req.originalUrl, template);
            res.status(200).set({ "Content-Type": "text/html" }).end(page);
          } catch (e) {
            vite.ssrFixStacktrace(e as Error);
            next(e);
          }
        });
      } catch (viteErr) {
        log(`Vite setup failed: ${viteErr} — falling back to static serving`);
        mountStatic(app);
      }
    } else {
      mountStatic(app);
    }

    log("Server fully initialised");
  } catch (err) {
    log(`Fatal startup error: ${err}`);
    console.error(err);
    process.exit(1);
  }
})();

function mountStatic(app: express.Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    log(`Static build not found at ${distPath}`);
    return;
  }

  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// Export for Vercel serverless
export default app;
