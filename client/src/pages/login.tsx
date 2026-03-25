import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Mail, ArrowLeft, RotateCcw } from "lucide-react";
import nxtWaveLogo from "@assets/image_1774348454567.png";

const PERSONAL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk",
  "hotmail.com", "hotmail.in", "hotmail.co.in", "outlook.com", "live.com",
  "live.in", "rediffmail.com", "aol.com", "icloud.com", "me.com",
  "ymail.com", "protonmail.com", "tutanota.com", "rocketmail.com",
  "inbox.com", "mail.com", "gmx.com", "gmx.in", "gmail.co.in",
  "msn.com", "pm.me",
]);

function isPersonalEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  return domain ? PERSONAL_DOMAINS.has(domain) : false;
}

function parseServerError(err: any): string {
  try {
    const raw: string = err?.message || "";
    const idx = raw.indexOf("{");
    if (idx !== -1) {
      const parsed = JSON.parse(raw.slice(idx));
      if (parsed?.message) return parsed.message;
    }
  } catch {}
  return "Something went wrong. Please try again.";
}

// ── Step 1: Details form ──────────────────────────────────────────────────────

function DetailsStep({
  onSent,
}: {
  onSent: (email: string) => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sendOtpMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await apiRequest("POST", "/api/auth/send-otp", data);
      return res.json();
    },
    onSuccess: (_data, vars) => {
      onSent(vars.email.trim().toLowerCase());
    },
    onError: (err: any) => {
      const msg = parseServerError(err);
      // Route error to the relevant field if possible
      if (msg.toLowerCase().includes("email")) {
        setErrors({ email: msg });
      } else if (msg.toLowerCase().includes("mobile") || msg.toLowerCase().includes("number")) {
        setErrors({ mobile: msg });
      } else if (msg.toLowerCase().includes("name")) {
        setErrors({ name: msg });
      } else {
        setErrors({ server: msg });
      }
    },
  });

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) {
      e.email = "Work email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    } else if (isPersonalEmail(form.email)) {
      e.email = "Please use your company email. Gmail, Yahoo and similar are not accepted.";
    }
    const digits = form.mobile.replace(/\D/g, "");
    if (!form.mobile.trim()) {
      e.mobile = "Mobile number is required.";
    } else if (digits.length < 10) {
      e.mobile = "Please enter a valid 10-digit mobile number.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: "", server: "" }));
    };
  }

  return (
    <>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-3 py-1 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">Enterprise Access</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-50 tracking-tight">Access NxtWave Edge</h1>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          India's national engineering hiring standard — exclusively for hiring companies.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validate()) sendOtpMutation.mutate(form);
        }}
        noValidate
        className="space-y-5"
      >
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="e.g. Arjun Sharma"
            autoComplete="name"
            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 ${errors.name ? "border-red-500/70" : "border-slate-700"}`}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
        </div>

        {/* Work Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Work Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@company.com"
            autoComplete="email"
            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 ${errors.email ? "border-red-500/70" : "border-slate-700"}`}
          />
          {errors.email ? (
            <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-600">Personal email addresses are not accepted.</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Mobile Number
          </label>
          <div className="flex gap-2">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 text-sm text-slate-400 shrink-0 select-none">
              +91
            </div>
            <input
              type="tel"
              value={form.mobile}
              onChange={handleChange("mobile")}
              placeholder="98765 43210"
              autoComplete="tel"
              maxLength={15}
              className={`flex-1 bg-slate-800 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 ${errors.mobile ? "border-red-500/70" : "border-slate-700"}`}
            />
          </div>
          {errors.mobile && <p className="mt-1.5 text-xs text-red-400">{errors.mobile}</p>}
        </div>

        {errors.server && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <p className="text-sm text-red-400">{errors.server}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors mt-2"
        >
          {sendOtpMutation.isPending ? "Sending code..." : "Send Verification Code →"}
        </button>
      </form>
    </>
  );
}

// ── Step 2: OTP verification ──────────────────────────────────────────────────

function OtpStep({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    otpRef.current?.focus();
  }, []);

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/verify-otp", { email, otp: otp.trim() });
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      navigate("/browse");
    },
    onError: (err: any) => {
      setError(parseServerError(err));
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      // We don't have name/mobile here, but the server still has them in the OTP store.
      // We send just the email to resend — server checks if entry exists.
      // Actually, the send-otp endpoint requires name+mobile again. Since we don't have them,
      // let's call send-otp with empty strings — the server will only resend if entry exists.
      // Better: store them in the OTP store on the server and add a resend-only endpoint.
      // For now, ask the user to go back and re-submit.
      // Actually, we stored name/mobile on first send. Let me add a resend endpoint.
      const res = await apiRequest("POST", "/api/auth/resend-otp", { email });
      return res.json();
    },
    onSuccess: () => {
      setOtp("");
      setError("");
      setResendCooldown(30);
    },
    onError: (err: any) => {
      setError(parseServerError(err));
    },
  });

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Change email
        </button>

        <div className="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-600/20 flex items-center justify-center mb-4">
          <Mail className="w-5 h-5 text-blue-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-50 tracking-tight">Check your email</h1>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          We sent a 6-digit code to{" "}
          <span className="text-slate-200 font-medium">{email}</span>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (otp.trim().length === 6) verifyMutation.mutate();
          else setError("Please enter the full 6-digit code.");
        }}
        className="space-y-5"
      >
        {/* OTP Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Verification Code
          </label>
          <input
            ref={otpRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(v);
              if (error) setError("");
            }}
            placeholder="• • • • • •"
            className={`w-full bg-slate-800 border rounded-lg px-4 py-4 text-xl font-bold text-slate-100 text-center tracking-[0.6em] placeholder:text-slate-700 placeholder:tracking-[0.3em] outline-none transition-colors focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 ${error ? "border-red-500/70" : "border-slate-700"}`}
          />
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
          <p className="mt-2 text-xs text-slate-600">Code expires in 10 minutes.</p>
        </div>

        <button
          type="submit"
          disabled={verifyMutation.isPending || otp.length < 6}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify & Get Access →"}
        </button>

        {/* Resend */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm text-slate-500">Didn't receive it?</span>
          {resendCooldown > 0 ? (
            <span className="text-sm text-slate-600">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {resendMutation.isPending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>
      </form>
    </>
  );
}

// ── Main login page ───────────────────────────────────────────────────────────

export default function LoginPage() {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [sentEmail, setSentEmail] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="h-14 border-b border-slate-800 flex items-center px-6">
        <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto brightness-0 invert" />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
            {step === "details" ? (
              <DetailsStep
                onSent={(email) => {
                  setSentEmail(email);
                  setStep("otp");
                }}
              />
            ) : (
              <OtpStep
                email={sentEmail}
                onBack={() => {
                  setStep("details");
                  setSentEmail("");
                }}
              />
            )}

            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-xs text-slate-600 text-center leading-relaxed">
                NxtWave Edge is a{" "}
                <span className="text-slate-500">B2B platform</span> exclusively for companies
                hiring pre-assessed engineering talent.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: "2,300+", label: "Hiring Partners" },
              { value: "16,000+", label: "Engineers Placed" },
              { value: "WEF 2024", label: "Recognised Standard" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-3 text-center">
                <p className="text-sm font-bold text-slate-100">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
