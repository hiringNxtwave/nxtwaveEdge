import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Mail, RotateCcw, ShieldCheck, Eye } from "lucide-react";
import nxtWaveLogo from "@assets/image_1774348454567.png";

/* ── helpers ─────────────────────────────────────────────── */

const PERSONAL_DOMAINS = new Set([
  "gmail.com","yahoo.com","yahoo.in","yahoo.co.in","hotmail.com","hotmail.in",
  "outlook.com","live.com","live.in","rediffmail.com","aol.com","icloud.com",
  "me.com","ymail.com","protonmail.com","tutanota.com","rocketmail.com",
  "inbox.com","mail.com","gmx.com","gmx.in","msn.com","pm.me",
]);

function isPersonalEmail(email: string) {
  const d = email.trim().toLowerCase().split("@")[1];
  return d ? PERSONAL_DOMAINS.has(d) : false;
}

function parseServerError(err: any): string {
  try {
    const raw: string = err?.message || "";
    const idx = raw.indexOf("{");
    if (idx !== -1) { const p = JSON.parse(raw.slice(idx)); if (p?.message) return p.message; }
  } catch {}
  return "Something went wrong. Please try again.";
}

/* ── Left marketing panel ────────────────────────────────── */

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#EEF4FF] px-10 py-10 h-full min-h-screen">
      {/* Logo */}
      <div>
        <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-8 w-auto" />
      </div>

      {/* Main copy */}
      <div className="flex-1 flex flex-col justify-center gap-8 py-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Your <span className="text-blue-600">Pre-Vetted</span><br />
            Shortlist is Ready.
          </h1>
          <p className="text-slate-600 text-base mt-4 leading-relaxed max-w-sm">
            2,500+ companies use Edge to hire top 0.1% freshers, pre-vetted,
            benchmark-verified, and ready to deploy.
          </p>
        </div>

        {/* Sample profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
                <div className="w-2.5 h-2.5 grid grid-cols-2 gap-0.5">
                  {[...Array(4)].map((_,i)=><div key={i} className="bg-blue-500 rounded-[1px]"/>)}
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Shortlisted Profiles
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-1.5 rounded-full bg-blue-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
          </div>

          {/* Candidate row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Arjun S.</p>
              <p className="text-xs text-slate-400">IIT Kharagpur</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 mb-4" />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Role Fit</p>
              <p className="text-[13px] font-bold text-slate-800">Full Stack Developer</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Score</p>
              <p className="text-[13px] font-bold text-slate-800">156/170</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Verdict</p>
              <p className="text-[13px] font-bold text-blue-600">Very Strong</p>
            </div>
          </div>
        </div>

        {/* Preview link */}
        <button className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors w-fit">
          <Eye className="w-4 h-4" />
          Preview a Sample Profile
        </button>

        {/* Trusted by */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Trusted By</p>
          <div className="flex items-center gap-4 flex-wrap">
            {["Persistent", "[x]cube Labs", "Infosys BPM", "LTIMindtree"].map(c => (
              <span key={c} className="text-[13px] font-semibold text-slate-500">{c}</span>
            ))}
            <span className="text-[13px] text-slate-400">and 2,500+ more companies</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Step 1: Email ───────────────────────────────────────── */

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/send-otp", { email: email.trim().toLowerCase() });
      return res.json();
    },
    onSuccess: () => onSent(email.trim().toLowerCase()),
    onError: (err: any) => setError(parseServerError(err)),
  });

  function validate() {
    if (!email.trim()) { setError("Work email is required."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Please enter a valid email address."); return false; }
    if (isPersonalEmail(email)) { setError("Please use your company email. Gmail, Yahoo and similar are not accepted."); return false; }
    return true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Get Started</h2>
        <p className="text-slate-500 text-sm mt-1.5">Enter your work email to access the platform.</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        <div className="h-1 flex-1 rounded-full bg-blue-600" />
        <div className="h-1 flex-1 rounded-full bg-slate-200" />
        <div className="h-1 flex-1 rounded-full bg-slate-200" />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (validate()) sendOtpMutation.mutate(); }} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            placeholder="name@company.com"
            autoComplete="email"
            autoFocus
            className={`w-full border rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
          />
          {error
            ? <p className="mt-1.5 text-xs text-red-500">{error}</p>
            : <p className="mt-1.5 text-xs text-slate-400">Personal emails (Gmail, Yahoo, etc.) are not accepted.</p>
          }
        </div>

        <button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {sendOtpMutation.isPending ? "Sending…" : <>View Shortlisted Profiles <span className="text-base">→</span></>}
        </button>
      </form>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        We respect your inbox. No spam, ever.
      </div>
    </div>
  );
}

/* ── Step 2: OTP ─────────────────────────────────────────── */

function OtpStep({ email, onBack }: { email: string; onBack: () => void }) {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Prevent browser back while on OTP step
  useEffect(() => {
    history.pushState(null, "", window.location.href);
    const handler = () => { history.pushState(null, "", window.location.href); };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/verify-otp", { email, otp: otp.trim() });
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      navigate("/login/profile");
    },
    onError: (err: any) => setError(parseServerError(err)),
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/resend-otp", { email });
      return res.json();
    },
    onSuccess: () => { setOtp(""); setError(""); setResendCooldown(30); },
    onError: (err: any) => setError(parseServerError(err)),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Check your email</h2>
        <p className="text-slate-500 text-sm mt-1.5">
          We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        <div className="h-1 flex-1 rounded-full bg-blue-600" />
        <div className="h-1 flex-1 rounded-full bg-blue-600" />
        <div className="h-1 flex-1 rounded-full bg-slate-200" />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (otp.trim().length === 6) verifyMutation.mutate(); else setError("Please enter the full 6-digit code."); }} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
            placeholder="• • • • • •"
            className={`w-full border rounded-xl px-4 py-4 text-2xl font-bold text-slate-900 text-center tracking-[0.5em] placeholder:text-slate-300 placeholder:tracking-[0.2em] outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
          />
          {error
            ? <p className="mt-1.5 text-xs text-red-500">{error}</p>
            : <p className="mt-1.5 text-xs text-slate-400">Code expires in 10 minutes.</p>
          }
        </div>

        <button
          type="submit"
          disabled={verifyMutation.isPending || otp.length < 6}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors"
        >
          {verifyMutation.isPending ? "Verifying…" : "Verify & Continue →"}
        </button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors text-xs">
          ← Change email
        </button>
        <div className="flex items-center gap-2 text-slate-500">
          <span>Didn't receive it?</span>
          {resendCooldown > 0
            ? <span className="text-slate-400">Resend in {resendCooldown}s</span>
            : <button type="button" onClick={() => resendMutation.mutate()} disabled={resendMutation.isPending} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                {resendMutation.isPending ? "Sending…" : "Resend"}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: Profile setup ───────────────────────────────── */

function ProfileStep() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", company: "", mobile: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent leaving mid-profile
  useEffect(() => {
    history.pushState(null, "", window.location.href);
    const pop = () => history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", pop);
    const unload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", unload);
    return () => { window.removeEventListener("popstate", pop); window.removeEventListener("beforeunload", unload); };
  }, []);

  const profileMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("PATCH", "/api/auth/profile", {
        name: form.name.trim(),
        company: form.company.trim(),
        mobile: form.mobile.trim(),
      });
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      navigate("/browse");
    },
    onError: (err: any) => setErrors({ server: parseServerError(err) }),
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.company.trim()) e.company = "Company name is required.";
    const digits = form.mobile.replace(/\D/g, "");
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (digits.length < 10) e.mobile = "Please enter a valid 10-digit mobile number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function field(k: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setForm(p => ({ ...p, [k]: e.target.value }));
      setErrors(p => ({ ...p, [k]: "", server: "" }));
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Almost there!</h2>
        <p className="text-slate-500 text-sm mt-1.5">Tell us a bit about yourself to set up your recruiter profile.</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        <div className="h-1 flex-1 rounded-full bg-blue-600" />
        <div className="h-1 flex-1 rounded-full bg-blue-600" />
        <div className="h-1 flex-1 rounded-full bg-blue-600" />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (validate()) profileMutation.mutate(); }} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={field("name")}
            placeholder="e.g. Arjun Sharma"
            autoComplete="name"
            autoFocus
            className={`w-full border rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
          <input
            type="text"
            value={form.company}
            onChange={field("company")}
            placeholder="e.g. Infosys, TCS, your startup"
            autoComplete="organization"
            className={`w-full border rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${errors.company ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
          />
          {errors.company && <p className="mt-1.5 text-xs text-red-500">{errors.company}</p>}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
          <div className="flex gap-2">
            <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl px-3 text-sm text-slate-500 shrink-0 select-none font-medium">
              +91
            </div>
            <input
              type="tel"
              value={form.mobile}
              onChange={field("mobile")}
              placeholder="98765 43210"
              autoComplete="tel"
              maxLength={15}
              className={`flex-1 border rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${errors.mobile ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
            />
          </div>
          {errors.mobile && <p className="mt-1.5 text-xs text-red-500">{errors.mobile}</p>}
        </div>

        {errors.server && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{errors.server}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={profileMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors"
        >
          {profileMutation.isPending ? "Saving…" : "Access Platform →"}
        </button>
      </form>
    </div>
  );
}

/* ── Main login page ─────────────────────────────────────── */

export default function LoginPage() {
  const [location] = useLocation();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [sentEmail, setSentEmail] = useState("");

  const isProfileRoute = location === "/login/profile";

  // Prevent accidental page leave during OTP step
  useEffect(() => {
    if (step !== "otp") return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [step]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel — hidden on mobile */}
      <div className="flex-1">
        <LeftPanel />
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center h-14 border-b border-slate-100 px-6">
          <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto" />
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            {/* Desktop logo */}
            <div className="hidden lg:block mb-8">
              <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-8 w-auto" />
            </div>

            {isProfileRoute ? (
              <ProfileStep />
            ) : step === "email" ? (
              <EmailStep onSent={(email) => { setSentEmail(email); setStep("otp"); }} />
            ) : (
              <OtpStep
                email={sentEmail}
                onBack={() => { setStep("email"); setSentEmail(""); }}
              />
            )}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                NxtWave Edge is a <span className="text-slate-500">B2B platform</span> exclusively for companies hiring pre-assessed engineering talent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
