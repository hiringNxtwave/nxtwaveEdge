import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Mail, RotateCcw, ShieldCheck, Eye, X, MapPin, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import nxtWaveLogo from "@assets/image_1774348454567.png";
import { sendGTMEvent } from "@/lib/gtm";

const BLOCKED_DOMAINS = new Set([
  "gmail.com","gmail.co","gmail.net","gmail.co.in",
  "gmai.com","gmal.com","gmial.com","gmali.com","gmall.com",
  "gmeil.com","gemail.com","googmail.com","googlemail.com",
  "yahoo.com","yahoo.in","yahoo.co.in","yahoo.co.uk",
  "yaho.com","yahooo.com","yahoomail.com","yahoo.com.in",
  "ymail.com","rocketmail.com",
  "outlook.com","outlook.in","outlook.co.in",
  "hotmail.com","hotmail.in","hotmail.co.in","hotmail.co.uk",
  "live.com","live.in","live.co.in","live.co.uk",
  "msn.com","windowslive.com",
  "rediffmail.com","rediff.com",
  "aol.com","aim.com",
  "icloud.com","me.com","mac.com",
  "protonmail.com","protonmail.ch","pm.me",
  "tutanota.com","tutanota.de","tutamail.com","tuta.io",
  "inbox.com","mail.com","gmx.com","gmx.in","gmx.net","gmx.de",
  "zohomail.com","zoho.com",
  "yandex.com","yandex.ru",
  "fastmail.com","fastmail.fm",
  "guerrillamail.com","tempmail.com","throwam.com",
]);

const BLOCKED_SUFFIXES = [
  ".edu",".ac.in",".edu.in",".ac.uk",".edu.au",
  ".ac.nz",".edu.sg",".ac.id",".edu.pk",".ac.za",
  ".gov.in",".gov.com",".nic.in",
];

function getEmailError(email: string): string | null {
  const d = email.trim().toLowerCase().split("@")[1];
  if (!d) return null;
  if (BLOCKED_DOMAINS.has(d))
    return "Personal email addresses are not accepted. Please use your company email.";
  for (const suffix of BLOCKED_SUFFIXES) {
    if (d === suffix.slice(1) || d.endsWith(suffix))
      return "Academic and government email addresses are not accepted. Please use your company email.";
  }
  return null;
}

function parseServerError(err: any): string {
  try {
    const raw: string = err?.message || "";
    const idx = raw.indexOf("{");
    if (idx !== -1) { const p = JSON.parse(raw.slice(idx)); if (p?.message) return p.message; }
  } catch {}
  return "Something went wrong. Please try again.";
}

const slidingCandidates = [
  { name: "Aditya P.", college: "NIT Bhopal (MANIT)", role: "Full Stack Developer", score: 99, verdict: "Strong Hire", initials: "A", avatarBg: "bg-primary/10 text-primary" },
  { name: "Aman M.", college: "NIT Bhopal (MANIT)", role: "Backend Developer", score: 98, verdict: "Strong Hire", initials: "A", avatarBg: "bg-primary/10 text-primary" },
  { name: "Rajveer S.", college: "HBTU, Uttar Pradesh", role: "Full Stack Developer", score: 99, verdict: "Strong Hire", initials: "R", avatarBg: "bg-primary/10 text-primary" },
  { name: "Aditi R.", college: "NIT Uttarakhand", role: "Full Stack Developer", score: 98, verdict: "Strong Hire", initials: "A", avatarBg: "bg-primary/10 text-primary" },
  { name: "Devansh G.", college: "HBTU, Kanpur", role: "Backend Developer", score: 94, verdict: "Strong Hire", initials: "D", avatarBg: "bg-primary/10 text-primary" },
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
    <div className="surface-card p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
            <div className="w-2 h-2 grid grid-cols-2 gap-px">
              {[...Array(4)].map((_,i)=><div key={i} className="bg-primary rounded-[0.5px]"/>)}
            </div>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Shortlisted Profiles
          </span>
        </div>
        <div className="flex items-center gap-1">
          {slidingCandidates.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? "w-4 h-1 bg-primary" : "w-1 h-1 bg-border hover:bg-muted-foreground/40"}`}
            />
          ))}
        </div>
      </div>

      <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${c.avatarBg}`}>
            {c.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
            <p className="text-xs text-muted-foreground truncate">{c.college}</p>
          </div>
        </div>

        <div className="h-px bg-border mb-3" />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Role Fit</p>
            <p className="text-xs font-semibold text-foreground leading-tight">{c.role}</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Score</p>
            <p className="text-xs font-semibold text-foreground">{c.score}/100</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Verdict</p>
            <p className="text-xs font-semibold text-primary">{c.verdict}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SampleProfileModal({ onClose }: { onClose: () => void }) {
  const { data: student, isLoading } = useQuery<any>({
    queryKey: ["sample-student-public"],
    queryFn: async () => {
      const res = await fetch("/api/public/sample-student", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: Infinity,
    retry: false,
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

  const strengths = parseJson(student?.preferredRoles);

  const verdictColor =
    student?.recommendation === "Strong Hire" ? "bg-primary/10 text-primary border-primary/20" :
    student?.recommendation === "Hire" ? "bg-muted text-foreground border-border" :
    "bg-muted text-muted-foreground border-border";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md relative overflow-hidden animate-slide-up">
        <div className="bg-muted/50 px-5 py-3.5 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sample Profile</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {isLoading ? (
          <div className="px-5 py-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : student ? (
          <div className="px-5 py-5 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {student.fullName?.charAt(0) ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground tracking-tight">{student.fullName}</h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground text-xs">
                  <GraduationCap className="w-3 h-3 shrink-0" />
                  <span className="truncate">{student.university}</span>
                </div>
                <div className="flex items-center gap-2.5 mt-0.5">
                  {student.major && <p className="text-[11px] text-muted-foreground">{student.major} · {student.graduationYear}</p>}
                  {student.location && student.location !== "India" && (
                    <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                      <MapPin className="w-2.5 h-2.5" />
                      {student.location}
                    </div>
                  )}
                </div>
              </div>
              <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${verdictColor}`}>
                {student.recommendation}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div>
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assessment Scores</p>
              <div className="grid grid-cols-4 gap-1.5">
                <div className="bg-primary/5 rounded-lg px-2 py-2 text-center border border-primary/10">
                  <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Overall</p>
                  <p className="text-sm font-bold text-primary">{student.overallAssessmentScore ?? "—"}</p>
                  <p className="text-[8px] text-muted-foreground">/ 100</p>
                </div>
                <div className="bg-muted rounded-lg px-2 py-2 text-center">
                  <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">DSA</p>
                  <p className="text-sm font-bold text-foreground">{student.dsaScore ?? "—"}</p>
                  <p className="text-[8px] text-muted-foreground">/ 100</p>
                </div>
                <div className="bg-muted rounded-lg px-2 py-2 text-center">
                  <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">CS Fund.</p>
                  <p className="text-sm font-bold text-foreground">{student.csFundamentalsScore ?? "—"}</p>
                  <p className="text-[8px] text-muted-foreground">/ 100</p>
                </div>
                <div className="bg-muted rounded-lg px-2 py-2 text-center">
                  <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Aptitude</p>
                  <p className="text-sm font-bold text-foreground">{student.aptitudeScore ?? "—"}</p>
                  <p className="text-[8px] text-muted-foreground">/ 100</p>
                </div>
              </div>
            </div>

            {strengths.length > 0 && (
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Assessor Highlights</p>
                <ul className="space-y-1.5">
                  {strengths.slice(0, 4).map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="mt-1 w-1 h-1 rounded-full bg-primary shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="h-px bg-border" />

            <p className="text-xs text-muted-foreground text-center">
              This is a live profile from our pre-assessed talent pool. Log in to see full contact details and assessment reports.
            </p>
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-muted-foreground text-sm">Could not load profile. Please try again.</div>
        )}
      </div>
    </div>
  );
}

function LeftPanel({ onPreview }: { onPreview: () => void }) {
  const [, navigate] = useLocation();

  return (
    <div className="flex flex-col items-center bg-muted/30 dark:bg-muted/20 px-8 py-10 h-full w-full border-r border-border">
      <div className="w-full max-w-[340px]">
        <button onClick={() => navigate("/")} className="focus:outline-none">
          <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto hover:opacity-80 transition-opacity dark:brightness-90" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-7 w-full max-w-[340px]">
        <div>
          <h1 className="text-3xl font-bold text-foreground leading-tight tracking-tight">
            Your <span className="text-primary">Pre-Vetted</span><br />
            Shortlist is Ready.
          </h1>
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
            2,500+ companies use Edge to hire top freshers, pre-vetted,
            benchmark-verified, and ready to deploy.
          </p>
        </div>

        <CandidateCarousel />

        <button
          id="login_page_left_preview_profile_click"
          onClick={() => { sendGTMEvent("login_page_left_preview_profile_click"); onPreview(); }}
          className="flex items-center gap-2 text-primary text-sm font-semibold hover:text-primary/80 transition-colors w-fit"
        >
          <Eye className="w-4 h-4" />
          Preview a Sample Profile
        </button>

        <div>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">Trusted By</p>
          <div className="flex items-center gap-4 flex-wrap">
            {hiringLogos.map(p => (
              <img
                key={p.name}
                src={p.logo}
                alt={p.name}
                className="h-5 w-auto object-contain grayscale opacity-50 dark:opacity-40"
              />
            ))}
            <span className="text-xs text-muted-foreground font-medium">and 2,500+ more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    const blocked = getEmailError(email);
    if (blocked) { setError(blocked); return false; }
    return true;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Sign in to your account</h2>
        <p className="text-sm text-muted-foreground mt-1.5">Enter your work email to get started.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (validate()) sendOtpMutation.mutate(); }} noValidate className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder="name@company.com"
              autoComplete="email"
              autoFocus
              className={`h-10 pl-9 text-sm ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
          </div>
          {error
            ? <p className="text-xs text-destructive">{error}</p>
            : <p className="text-xs text-muted-foreground">Personal, academic and free emails are not accepted.</p>
          }
        </div>

        <Button
          id="login_page_email_view_profiles_click"
          type="submit"
          disabled={sendOtpMutation.isPending}
          onClick={() => { if (!sendOtpMutation.isPending) sendGTMEvent("login_page_email_view_profiles_click"); }}
          className="w-full h-11 text-sm font-semibold"
        >
          {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
        </Button>
      </form>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5" />
        We respect your inbox. No spam, ever.
      </div>
    </div>
  );
}

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
    onSuccess: async (data: any) => {
      (window as any).lintrk?.("track", { conversion_id: 23414812 });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      if (data?.user?.onboardingCompleted) {
        navigate("/browse");
      } else {
        navigate("/login/profile");
      }
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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Check your email</h2>
        <p className="text-sm text-muted-foreground mt-1.5">
          We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mt-2">
          Don't see it? Check your <span className="font-semibold">Spam / Junk</span> folder.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (otp.trim().length === 6) verifyMutation.mutate(); else setError("Please enter the full 6-digit code."); }} className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Verification Code</label>
          <Input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
            placeholder="000000"
            className={`h-11 text-lg font-bold text-center tracking-[0.4em] placeholder:tracking-[0.2em] placeholder:text-muted-foreground/50 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          {error
            ? <p className="text-xs text-destructive">{error}</p>
            : <p className="text-xs text-muted-foreground">Code expires in 10 minutes.</p>
          }
        </div>

        <Button
          id="login_page_otp_verify_click"
          type="submit"
          disabled={verifyMutation.isPending || otp.length < 6}
          onClick={() => { if (!verifyMutation.isPending && otp.length >= 6) sendGTMEvent("login_page_otp_verify_click"); }}
          className="w-full h-11 text-sm font-semibold"
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify & Continue"}
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <button id="login_page_otp_change_email_click" onClick={() => { sendGTMEvent("login_page_otp_change_email_click"); onBack(); }} className="text-muted-foreground hover:text-foreground transition-colors text-xs">
          Change email
        </button>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">Didn't receive it?</span>
          {resendCooldown > 0
            ? <span className="text-xs text-muted-foreground/60">Resend in {resendCooldown}s</span>
            : <button id="login_page_otp_resend_click" type="button" onClick={() => { sendGTMEvent("login_page_otp_resend_click"); resendMutation.mutate(); }} disabled={resendMutation.isPending} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                <RotateCcw className="w-3 h-3" />
                {resendMutation.isPending ? "Sending..." : "Resend"}
              </button>
          }
        </div>
      </div>
    </div>
  );
}

function ProfileStep() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", company: "", mobile: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        mobile: form.mobile.replace(/\D/g, "").slice(0, 10),
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
    else if (digits.length !== 10) e.mobile = "Please enter a valid 10-digit mobile number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function field(k: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (k === "mobile") {
        val = val.replace(/\D/g, "");
        if (val.startsWith("91") && val.length > 10) val = val.slice(2);
        if (val.startsWith("0") && val.length > 10) val = val.slice(1);
        val = val.slice(0, 10);
      }
      setForm(p => ({ ...p, [k]: val }));
      setErrors(p => ({ ...p, [k]: "", server: "" }));
    };
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
          <Mail className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Almost there!</h2>
        <p className="text-sm text-muted-foreground mt-1.5">One quick step: tell us about yourself to set up your account.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (validate()) profileMutation.mutate(); }} noValidate className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Full Name</label>
          <Input
            type="text"
            value={form.name}
            onChange={field("name")}
            placeholder="e.g. Arjun Sharma"
            autoComplete="name"
            autoFocus
            className={`h-10 text-sm ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Company Name</label>
          <Input
            type="text"
            value={form.company}
            onChange={field("company")}
            placeholder="e.g. Infosys, TCS, your startup"
            autoComplete="organization"
            className={`h-10 text-sm ${errors.company ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Mobile Number</label>
          <div className="flex gap-2">
            <div className="flex items-center border border-input bg-muted rounded-lg px-3 text-sm text-muted-foreground shrink-0 select-none font-medium h-10">
              +91
            </div>
            <Input
              type="tel"
              value={form.mobile}
              onChange={field("mobile")}
              placeholder="9876543210"
              autoComplete="tel"
              maxLength={10}
              className={`flex-1 h-10 text-sm ${errors.mobile ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
          </div>
          {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
        </div>

        {errors.server && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3.5 py-2.5">
            <p className="text-sm text-destructive">{errors.server}</p>
          </div>
        )}

        <Button
          id="login_page_profile_access_platform_click"
          type="submit"
          disabled={profileMutation.isPending}
          onClick={() => { if (!profileMutation.isPending) sendGTMEvent("login_page_profile_access_platform_click"); }}
          className="w-full h-11 text-sm font-semibold"
        >
          {profileMutation.isPending ? "Saving..." : "Access Platform"}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  const [location, navigate] = useLocation();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [sentEmail, setSentEmail] = useState("");
  const [showSampleProfile, setShowSampleProfile] = useState(false);

  const isProfileRoute = location === "/login/profile";

  const { data: authUser } = useQuery<any>({
    queryKey: ["/api/auth/user"],
    staleTime: 30_000,
    retry: false,
  });
  useEffect(() => {
    if (authUser?.id && authUser?.onboardingCompleted && !isProfileRoute) {
      navigate("/browse");
    }
  }, [authUser, isProfileRoute]);

  useEffect(() => {
    if (step !== "otp") return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [step]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[900px] min-h-[560px] flex rounded-xl border border-border overflow-hidden shadow-lg dark:shadow-2xl">
        <div className="hidden lg:flex w-1/2">
          <LeftPanel onPreview={() => setShowSampleProfile(true)} />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col bg-card">
          <div className="lg:hidden flex items-center h-12 border-b border-border px-5">
            <button onClick={() => navigate("/")} className="focus:outline-none">
              <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-6 w-auto dark:brightness-90" />
            </button>
          </div>

          <div className="lg:hidden bg-muted/40 px-5 py-4 border-b border-border">
            <h2 className="text-base font-bold text-foreground leading-snug mb-1">
              Your Pre-Vetted<br />Shortlist is Ready.
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              2,500+ companies use Edge to hire top freshers, pre-vetted, benchmark-verified, and ready to deploy.
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-10">
            <div className="w-full max-w-sm">
              <div className="hidden lg:block mb-7">
                <button onClick={() => navigate("/")} className="focus:outline-none">
                  <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto hover:opacity-80 transition-opacity dark:brightness-90" />
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

              <div className="mt-7 pt-5 border-t border-border">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  NxtWave Edge is a <span className="text-foreground/60">B2B platform</span> exclusively for companies hiring pre-assessed engineering talent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSampleProfile && <SampleProfileModal onClose={() => setShowSampleProfile(false)} />}
    </div>
  );
}