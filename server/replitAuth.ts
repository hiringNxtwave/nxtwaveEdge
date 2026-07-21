import session from "express-session";
import type { Express, RequestHandler } from "express";

// Extend express-session to include our userId
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const isVercel = process.env.VERCEL === "true";

export async function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  if (isVercel) {
    // Vercel serverless: use cookie-based sessions (no DB pool needed)
    // Note: This means sessions won't persist across serverless function instances,
    // but for OTP-based auth this is acceptable since verification happens quickly.
    return session({
      secret: process.env.SESSION_SECRET ?? "nxtwave-edge-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: sessionTtl,
        sameSite: "lax",
      },
    });
  }

  // Local development: use PostgreSQL session store
  const connectPg = await import("connect-pg-simple");
  const pgStore = connectPg.default(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  return session({
    secret: process.env.SESSION_SECRET ?? "nxtwave-edge-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(await getSession());
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};
