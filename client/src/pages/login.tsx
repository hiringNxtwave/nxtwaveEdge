import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
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

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", mobile: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      navigate("/");
    },
    onError: (err: any) => {
      let msg = "Login failed. Please try again.";
      try {
        // apiRequest throws Error with message like "400: {\"message\":\"...\"}"
        const rawMsg: string = err?.message || "";
        const jsonPart = rawMsg.indexOf("{");
        if (jsonPart !== -1) {
          const parsed = JSON.parse(rawMsg.slice(jsonPart));
          if (parsed?.message) msg = parsed.message;
        }
      } catch {}
      setErrors({ server: msg });
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
      e.email = "Please use your company email address. Personal emails (Gmail, Yahoo, etc.) are not allowed.";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      loginMutation.mutate(form);
    }
  }

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
      if (errors.server) setErrors((prev) => ({ ...prev, server: "" }));
    };
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-slate-800 flex items-center px-6">
        <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto brightness-0 invert" />
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
            {/* Heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">
                  Enterprise Access
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
                Access NxtWave Edge
              </h1>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                India's national engineering hiring standard — exclusively for hiring companies.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                  className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 ${
                    errors.name ? "border-red-500/70" : "border-slate-700"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                )}
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
                  className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 ${
                    errors.email ? "border-red-500/70" : "border-slate-700"
                  }`}
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
                    className={`flex-1 bg-slate-800 border rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 ${
                      errors.mobile ? "border-red-500/70" : "border-slate-700"
                    }`}
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.mobile}</p>
                )}
              </div>

              {/* Server error */}
              {errors.server && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-400">{errors.server}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors mt-2"
              >
                {loginMutation.isPending ? "Verifying..." : "Get Access →"}
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <p className="text-xs text-slate-600 text-center leading-relaxed">
                NxtWave Edge is a{" "}
                <span className="text-slate-500">B2B platform</span> exclusively for companies hiring
                pre-assessed engineering talent. By accessing, you confirm you represent a hiring organisation.
              </p>
            </div>
          </div>

          {/* Stats strip */}
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
