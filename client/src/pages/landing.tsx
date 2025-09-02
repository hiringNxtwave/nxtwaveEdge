import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Landing() {
  useScrollToTop();
  
  return (
    <div className="bg-[#F7F8FC] text-[#111827]" style={{ fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"' }}>
      {/* Header */}
      <header className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-[28rem] h-[28rem] rounded-full absolute -top-24 -left-16" style={{
            background: 'radial-gradient(60% 60% at 50% 50%, rgba(99,102,241,.35), rgba(99,102,241,.15) 60%, rgba(99,102,241,0) 70%)',
            filter: 'blur(8px)'
          }}></div>
          <div className="w-[32rem] h-[32rem] rounded-full absolute -bottom-24 -right-16" style={{
            background: 'radial-gradient(60% 60% at 50% 50%, rgba(99,102,241,.35), rgba(99,102,241,.15) 60%, rgba(99,102,241,0) 70%)',
            filter: 'blur(8px)'
          }}></div>
        </div>
        <nav className="relative z-10 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <svg width="34" height="34" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
              <rect x="4" y="10" width="40" height="28" rx="8" className="fill-white"/>
              <path d="M10 18h10l4 6 4-6h10" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="24" r="3" fill="#10B981"/>
            </svg>
            <span className="text-xl font-extrabold tracking-tight">TalentBridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#how" className="hover:text-indigo-600">How it works</a>
            <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/for-students" className="hidden sm:inline-block px-4 py-2 rounded-xl border border-indigo-100 bg-white hover:bg-indigo-50 transition">For Students</Link>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-sm"
            >
              <span>Start Hiring</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-6 pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">Hire Pre‑Assessed Freshers</span>
              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">Quality freshers in days, <span className="text-indigo-600">not months</span>.</h1>
              <p className="mt-4 text-lg text-gray-600">Access a refreshed pool of 200,000+ candidates with verified skills in DSA, full‑stack, data, QA and communication. Filter precisely. Interview fast. Hire with confidence.</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => window.location.href = "/api/login"}
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
                >
                  Book a demo
                </Button>
                <a href="#features" className="px-5 py-3 rounded-xl bg-white border border-gray-200 font-semibold hover:bg-gray-50 transition text-center">See how it works</a>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  <img alt="avatar" src="https://i.pravatar.cc/40?img=12" className="w-8 h-8 rounded-full ring-2 ring-white"/>
                  <img alt="avatar" src="https://i.pravatar.cc/40?img=32" className="w-8 h-8 rounded-full ring-2 ring-white"/>
                  <img alt="avatar" src="https://i.pravatar.cc/40?img=45" className="w-8 h-8 rounded-full ring-2 ring-white"/>
                </div>
                <span>Trusted by 2,300+ companies</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl opacity-50" style={{
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}></div>
              <div className="relative rounded-3xl p-4 shadow-lg" style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.6)'
              }}>
                {/* Simple illustrative dashboard */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">Talent Matches</div>
                    <div className="text-xs text-gray-500">Last 7 days</div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-indigo-50">
                      <div className="text-xs text-indigo-700">Profiles seen</div>
                      <div className="text-2xl font-extrabold">1,274</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50">
                      <div className="text-xs text-emerald-700">Shortlisted</div>
                      <div className="text-2xl font-extrabold">146</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50">
                      <div className="text-xs text-amber-700">Interviews</div>
                      <div className="text-2xl font-extrabold">58</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs text-gray-600">Top skill: <span className="font-semibold text-gray-900">Full‑Stack (MERN)</span></div>
                    <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-3/4"></div>
                    </div>
                  </div>
                  <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-gray-100">
                      <div className="text-sm font-semibold">Salary bracket</div>
                      <p className="text-xs text-gray-500 mt-1">₹3.5L – ₹8L CTC</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-gray-100">
                      <div className="text-sm font-semibold">Availability</div>
                      <p className="text-xs text-gray-500 mt-1">Immediate to 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* Logos */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="flex items-center justify-between gap-6 flex-wrap opacity-80">
          <div className="h-6 bg-gray-300 rounded px-4 py-1 text-gray-600 text-sm">Lloyds</div>
          <div className="h-6 bg-gray-300 rounded px-4 py-1 text-gray-600 text-sm">NatWest</div>
          <div className="h-6 bg-gray-300 rounded px-4 py-1 text-gray-600 text-sm">ThoughtSpot</div>
          <div className="h-6 bg-gray-300 rounded px-4 py-1 text-gray-600 text-sm">Fractal</div>
          <div className="h-6 bg-gray-300 rounded px-4 py-1 text-gray-600 text-sm">Client</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative">
        <div className="absolute inset-0 -z-10" style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold">Less sifting. More hiring.</h2>
            <p className="mt-3 text-gray-600">We surface the right candidates the first time—so your team spends time interviewing, not hunting.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold">1</div>
              <h3 className="mt-4 font-bold text-lg">Pre‑Assessed Talent</h3>
              <p className="mt-2 text-gray-600 text-sm">Rigorous assessments in coding, DSA, aptitude & communication. View verified scorecards.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold">2</div>
              <h3 className="mt-4 font-bold text-lg">Precise Filters</h3>
              <p className="mt-2 text-gray-600 text-sm">Search by skill, role, salary, location, notice period and availability. Zero fluff.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold">3</div>
              <h3 className="mt-4 font-bold text-lg">Fast Matchmaking</h3>
              <p className="mt-2 text-gray-600 text-sm">Shortlists in 48 hours with interview scheduling support. Offer‑ready pipelines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-extrabold">How TalentBridge works</h2>
            <ol className="mt-6 space-y-4">
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Tell us your role</h4>
                  <p className="text-gray-600 text-sm">Define skills, salary bracket, location, and hiring urgency.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Get curated shortlists</h4>
                  <p className="text-gray-600 text-sm">Receive verified candidates with assessment breakdowns.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Interview & offer</h4>
                  <p className="text-gray-600 text-sm">We coordinate interviews and you make the hire. Simple.</p>
                </div>
              </li>
            </ol>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400"
            >
              Talk to our team
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl opacity-50" style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}></div>
            <div className="relative bg-white rounded-3xl p-6 border border-gray-100 shadow-lg">
              <img alt="process" className="rounded-2xl w-full" src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop" />
              <p className="text-xs text-gray-500 mt-2">Illustrative UI — replace with your product screenshots later.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-3xl font-extrabold">200k+</div><div className="text-sm text-gray-600">Candidate pool</div></div>
          <div><div className="text-3xl font-extrabold">2,300+</div><div className="text-sm text-gray-600">Hiring partners</div></div>
          <div><div className="text-3xl font-extrabold">48 hrs</div><div className="text-sm text-gray-600">Typical shortlist</div></div>
          <div><div className="text-3xl font-extrabold">95%</div><div className="text-sm text-gray-600">Offer acceptance</div></div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-500 text-white p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3">
              <p className="text-xl md:text-2xl font-semibold leading-relaxed">"TalentBridge helped us close 12 fresher roles in under three weeks with outstanding retention. The pre‑assessment scorecards saved our team dozens of hours."</p>
              <div className="mt-6 flex items-center gap-3">
                <img src="https://i.pravatar.cc/48?img=7" className="w-10 h-10 rounded-full border-2 border-white/40" alt="avatar"/>
                <div>
                  <div className="font-bold">Priya Sharma</div>
                  <div className="text-sm text-white/80">Head of Talent, Fintech Co.</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-2xl p-5" style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.6)'
              }}>
                <div className="text-sm leading-relaxed text-gray-800">Share your hiring plan and get a customised pipeline estimate.</div>
                <form className="mt-4 grid gap-3">
                  <input required placeholder="Work email" className="px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-400 border border-white/60 focus:outline-none focus:ring-2 focus:ring-white/80" />
                  <input required placeholder="Open roles (e.g., 5 Full‑Stack)" className="px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-400 border border-white/60 focus:outline-none focus:ring-2 focus:ring-white/80" />
                  <button className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-semibold text-white">Get estimate</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold">Simple pricing</h2>
          <p className="mt-3 text-gray-600">Pay per hire or choose a subscription. No hidden charges.</p>
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
            <div className="text-sm font-semibold text-gray-500">Starter</div>
            <div className="mt-2 text-3xl font-extrabold">₹0</div>
            <div className="text-sm text-gray-500">/month</div>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Browse talent</li>
              <li>Limited shortlists</li>
              <li>Email support</li>
            </ul>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="mt-6 w-full text-center px-4 py-3 rounded-xl bg-gray-900 text-white font-semibold"
            >
              Get started
            </Button>
          </div>
          <div className="rounded-2xl bg-white p-6 border-2 border-indigo-600 shadow-sm">
            <div className="text-sm font-semibold text-indigo-600">Most popular</div>
            <div className="mt-2 text-3xl font-extrabold">₹49,000</div>
            <div className="text-sm text-gray-500">/month</div>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Unlimited shortlists</li>
              <li>ATS integration</li>
              <li>Priority support</li>
            </ul>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="mt-6 w-full text-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold"
            >
              Start trial
            </Button>
          </div>
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-sm">
            <div className="text-sm font-semibold text-gray-500">Enterprise</div>
            <div className="mt-2 text-3xl font-extrabold">Custom</div>
            <div className="text-sm text-gray-500">per year</div>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Dedicated CSM</li>
              <li>Custom assessments</li>
              <li>SLA & reporting</li>
            </ul>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="mt-6 w-full text-center px-4 py-3 rounded-xl bg-gray-900 text-white font-semibold"
            >
              Talk to sales
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-extrabold text-center">FAQs</h2>
        <div className="mt-8 divide-y divide-gray-200 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <details className="group p-6">
            <summary className="cursor-pointer font-semibold flex items-center justify-between">
              Where do the candidates come from?
              <span className="transition group-open:rotate-90">›</span>
            </summary>
            <p className="mt-3 text-gray-600">From TalentBridge's nationwide assessments and partner campuses. Profiles are refreshed every 90 days.</p>
          </details>
          <details className="group p-6">
            <summary className="cursor-pointer font-semibold flex items-center justify-between">
              Do you offer custom tests?
              <span className="transition group-open:rotate-90">›</span>
            </summary>
            <p className="mt-3 text-gray-600">Yes, we can add role‑specific tests or coding challenges tailored to your JD.</p>
          </details>
          <details className="group p-6">
            <summary className="cursor-pointer font-semibold flex items-center justify-between">
              What integrations are supported?
              <span className="transition group-open:rotate-90">›</span>
            </summary>
            <p className="mt-3 text-gray-600">We support common ATS exports and simple API/webhook‑based integrations.</p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-3xl bg-white border border-gray-100 p-8 md:p-12 shadow-sm grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h3 className="text-2xl md:text-3xl font-extrabold">Ready to meet your next hire?</h3>
            <p className="mt-2 text-gray-600">Share your JD and get a curated shortlist in 48 hours.</p>
          </div>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="justify-self-start md:justify-self-end inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
          >
            Book a demo now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            <span className="text-sm text-gray-600">© 2025 TalentBridge. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}