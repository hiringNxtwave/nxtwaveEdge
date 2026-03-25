import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Mail, RotateCcw, ShieldCheck, Eye, X, MapPin, GraduationCap, Star, ChevronLeft, ChevronRight } from "lucide-react";
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

/* ── Sliding candidates ──────────────────────────────────── */

const slidingCandidates = [
  { name: "Arjun S.", college: "IIT Kharagpur", role: "Full Stack Developer", score: 156, verdict: "Very Strong", initials: "A", avatarBg: "bg-blue-100 text-blue-700" },
  { name: "Priya M.", college: "NIT Trichy", role: "Backend Engineer", score: 148, verdict: "Strong", initials: "P", avatarBg: "bg-indigo-100 text-indigo-700" },
  { name: "Rahul K.", college: "BITS Pilani", role: "Frontend Developer", score: 162, verdict: "Very Strong", initials: "R", avatarBg: "bg-sky-100 text-sky-700" },
  { name: "Sneha R.", college: "IIT Madras", role: "SDE", score: 151, verdict: "Strong", initials: "S", avatarBg: "bg-blue-100 text-blue-700" },
  { name: "Vikram D.", college: "IIIT Hyderabad", role: "Backend Developer", score: 159, verdict: "Very Strong", initials: "V", avatarBg: "bg-indigo-100 text-indigo-700" },
];

const hiringLogos = [
  { name: "Persistent", logo: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/persistent%20logo.avif" },
  { name: "[x]cube Labs", logo: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/xcube-logo-black.png" },
];

function CandidateCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % slidingCandidates.length);
        setAnimating(false);
      }, 300);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const c = slidingCandidates[current];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 max-w-sm">
      {/* Header row */}
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
        {/* Dots indicator */}
        <div className="flex items-center gap-1">
          {slidingCandidates.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? "w-5 h-1.5 bg-blue-600" : "w-1.5 h-1.5 bg-slate-200 hover:bg-slate-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Candidate — slides in/out */}
      <div
        className={`transition-all duration-300 ${animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${c.avatarBg}`}>
            {c.initials}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{c.name}</p>
            <p className="text-xs text-slate-400">{c.college}</p>
          </div>
        </div>

        <div className="h-px bg-slate-100 mb-4" />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Role Fit</p>
            <p className="text-[12px] font-bold text-slate-800 leading-tight">{c.role}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Score</p>
            <p className="text-[13px] font-bold text-slate-800">{c.score}/170</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Verdict</p>
            <p className="text-[13px] font-bold text-blue-600">{c.verdict}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sample profile modal ────────────────────────────────── */

function SampleProfileModal({ onClose }: { onClose: () => void }) {
  const { data: student, isLoading } = useQuery<any>({
    queryKey: ["/api/public/sample-student"],
  });

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  function parseJson(val: any): string[] {
    if (!val) return [];
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : Object.values(p); } catch { return []; }
  }

  const roles = parseJson(student?.preferredRoles);
  const locations = parseJson(student?.preferredLocations);

  const verdictColor =
    student?.recommendation === "Strong Hire" ? "bg-blue-50 text-blue-700 border-blue-200" :
    student?.recommendation === "Hire"        ? "bg-slate-50 text-slate-700 border-slate-200" :
    "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header bar */}
        <div className="bg-[#EEF4FF] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-sm font-bold text-blue-700 uppercase tracking-widest">Sample Profile</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-blue-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : student ? (
          <div className="px-6 py-6 space-y-5">
            {/* Identity */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-xl shrink-0">
                {student.fullName?.charAt(0) ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{student.fullName}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-sm">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{student.university}</span>
                </div>
                {student.branch && (
                  <p className="text-xs text-slate-400 mt-0.5">{student.branch} · {student.graduationYear}</p>
                )}
              </div>
              <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${verdictColor}`}>
                {student.recommendation}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Score */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Assessment Score</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {student.overallAssessmentScore ?? "—"}<span className="text-sm font-semibold text-slate-400">/170</span>
                </p>
              </div>
              {student.cgpa && (
                <div className="bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">CGPA</p>
                  <p className="text-2xl font-extrabold text-slate-900">{parseFloat(student.cgpa).toFixed(1)}</p>
                </div>
              )}
            </div>

            {/* Roles */}
            {roles.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Role Strengths</p>
                <div className="flex flex-wrap gap-1.5">
                  {roles.slice(0, 4).map((r: string) => (
                    <span key={r} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg">{r}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Locations */}
            {locations.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Open to Locations</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {locations.slice(0, 4).map((l: string) => (
                    <span key={l} className="text-sm text-slate-600 font-medium">{l}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="h-px bg-slate-100" />

            {/* CTA */}
            <p className="text-xs text-slate-500 text-center">
              This is a live profile from our pool of <span className="font-semibold text-slate-700">327+ pre-assessed freshers</span>. Log in to see full contact details and assessment reports.
            </p>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">Could not load profile. Please try again.</div>
        )}
      </div>
    </div>
  );
}

/* ── Left marketing panel ────────────────────────────────── */

function LeftPanel({ onPreview }: { onPreview: () => void }) {
  const [, navigate] = useLocation();

  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#EEF4FF] px-10 py-10 h-full min-h-screen">
      {/* Logo — click goes to landing */}
      <div>
        <button onClick={() => navigate("/")} className="focus:outline-none">
          <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-8 w-auto hover:opacity-80 transition-opacity" />
        </button>
      </div>

      {/* Main copy */}
      <div className="flex-1 flex flex-col justify-center gap-8 py-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Your <span className="text-blue-600">Pre-Vetted</span><br />
            Shortlist is Ready.
          </h1>
          <p className="text-slate-600 text-base mt-4 leading-relaxed max-w-sm">
            2,500+ companies use Edge to hire top freshers, pre-vetted,
            benchmark-verified, and ready to deploy.
          </p>
        </div>

        {/* Sliding candidate card */}
        <CandidateCarousel />

        {/* Preview link */}
        <button
          onClick={onPreview}
          className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors w-fit"
        >
          <Eye className="w-4 h-4" />
          Preview a Sample Profile
        </button>

        {/* Trusted by with real logos */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Trusted By</p>
          <div className="flex items-center gap-5 flex-wrap">
            {hiringLogos.map(p => (
              <img
                key={p.name}
                src={p.logo}
                alt={p.name}
                className="h-6 w-auto object-contain grayscale opacity-60"
              />
            ))}
            <span className="text-[13px] text-slate-400 font-medium">and 2,500+ more companies</span>
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
        <p className="text-slate-500 text-sm mt-1.5">One quick step — tell us about yourself to set up your account.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (validate()) profileMutation.mutate(); }} noValidate className="space-y-4">
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
  const [location, navigate] = useLocation();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [sentEmail, setSentEmail] = useState("");
  const [showSampleProfile, setShowSampleProfile] = useState(false);

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
        <LeftPanel onPreview={() => setShowSampleProfile(true)} />
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center h-14 border-b border-slate-100 px-6">
          <button onClick={() => navigate("/")} className="focus:outline-none">
            <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            {/* Desktop logo */}
            <div className="hidden lg:block mb-8">
              <button onClick={() => navigate("/")} className="focus:outline-none">
                <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-8 w-auto hover:opacity-80 transition-opacity" />
              </button>
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

      {/* Sample profile modal */}
      {showSampleProfile && <SampleProfileModal onClose={() => setShowSampleProfile(false)} />}
    </div>
  );
}
