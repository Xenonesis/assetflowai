import Link from "next/link";
import { Shield, ArrowRight, LayoutDashboard, Zap, Box, ShieldCheck, Activity, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--primary)] selection:text-white">
      {/* Header */}
      <header className="h-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2.5 text-[var(--primary)] font-bold text-xl group">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <span className="tracking-tight text-[var(--text-primary)]">AssetFlow AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <Link href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-[var(--text-primary)] transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link href="/dashboard">
                <Button className="rounded-full px-6 h-10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)] transition-all">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:block">
                  Log in
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full px-6 h-10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)] transition-all gap-2 group">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--primary)]/5 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none"></div>
          
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold uppercase tracking-wider mb-8 border border-[var(--primary)]/20 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Asset Intelligence</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500">
              The AI-Native Enterprise<br className="hidden md:block" /> Asset Platform
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
              Manage physical assets, maintenance, compliance, and audits from a unified cloud platform powered by autonomous AI systems.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={session ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full h-14 px-8 text-base shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] transition-all gap-2 group">
                  {session ? "Enter Dashboard" : "Start Free Trial"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-full h-14 px-8 text-base bg-transparent border-[var(--border)] hover:bg-[var(--surface)] transition-all">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24 bg-[var(--surface)]/30 border-t border-[var(--border)]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-100">Intelligent Workflows.</h2>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                Stop managing assets in spreadsheets. AssetFlow gives you real-time visibility and predictive control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
              {/* Feature 1 - Large */}
              <div className="md:col-span-2 bg-[var(--surface-elevated)] rounded-3xl p-8 border border-[var(--border)] flex flex-col justify-between group hover:border-[var(--primary)]/50 transition-colors shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                    <Box className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-zinc-100">Smart Inventory Tracking</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed max-w-md">
                    Track every physical asset with QR codes and barcodes. Instantly locate equipment across all your facilities and view comprehensive lifecycle histories.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-[var(--surface-elevated)] rounded-3xl p-8 border border-[var(--border)] flex flex-col justify-between group hover:border-emerald-500/50 transition-colors shadow-sm overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-100">Predictive Maintenance</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                    Automate maintenance scheduling based on usage data and AI predictions, drastically reducing downtime.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-[var(--surface-elevated)] rounded-3xl p-8 border border-[var(--border)] flex flex-col justify-between group hover:border-[var(--primary)]/50 transition-colors shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 w-40 h-40 bg-[var(--primary)]/5 rounded-full blur-3xl -z-10 group-hover:bg-[var(--primary)]/10 transition-colors"></div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-6 text-[var(--primary)]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-100">AI Assistant</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                    Chat with your enterprise data. Ask complex queries and get instant, context-aware answers about any asset.
                  </p>
                </div>
              </div>

              {/* Feature 4 - Large */}
              <div className="md:col-span-2 bg-[var(--surface-elevated)] rounded-3xl p-8 border border-[var(--border)] flex flex-col justify-between group hover:border-violet-500/50 transition-colors shadow-sm overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -z-10 group-hover:bg-violet-500/10 transition-colors"></div>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 text-violet-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-zinc-100">Enterprise Compliance</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed max-w-md">
                    Seamlessly run facility audits and ensure compliance with automated workflows, strict RBAC, and immutable audit logs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--primary)]/5"></div>
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-100">Ready to optimize your assets?</h2>
            <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
              Join leading enterprises using AssetFlow AI to track, maintain, and secure their physical infrastructure.
            </p>
            <Link href={session ? "/dashboard" : "/signup"}>
              <Button size="lg" className="rounded-full h-14 px-10 text-base shadow-xl hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] transition-all scale-100 hover:scale-105 duration-300">
                {session ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-12">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5 text-[var(--text-secondary)] font-medium">
            <Shield className="w-5 h-5" />
            <span>© 2026 AssetFlow AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
