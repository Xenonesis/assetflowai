import Link from "next/link";
import { Logo } from "@/components/logo";
import { 
  Shield, 
  ArrowRight, 
  Zap, 
  Box, 
  ShieldCheck, 
  Activity, 
  Check, 
  Lock, 
  Sparkles, 
  Layers, 
  Play, 
  Cpu, 
  FileText, 
  History 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col text-[var(--text-primary)] overflow-x-hidden selection:bg-[var(--primary)] selection:text-white transition-colors duration-300">
      
      {/* Background Mesh Grid (Premium Detail) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--primary-rgb),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary-rgb),0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Header */}
      <header className="h-20 border-b border-[var(--border)] bg-[var(--background)]/75 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-7xl">
          <Link href="/" className="group">
            <Logo textClassName="tracking-tight text-[var(--text-primary)] font-extrabold text-xl" iconClassName="w-9 h-9" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--text-secondary)]">
            <Link href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</Link>
            <Link href="#solutions" className="hover:text-[var(--text-primary)] transition-colors">Solutions</Link>
            <Link href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link href="/dashboard">
                <Button className="rounded-full px-6 h-10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)] transition-all font-semibold">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:block">
                  Log in
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full px-6 h-10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] hover:shadow-[0_0_25px_rgba(var(--primary-rgb),0.25)] transition-all gap-2 group font-semibold">
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
        <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/10 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
          
          <div className="container mx-auto px-6 max-w-7xl text-center flex flex-col items-center">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-6 border border-[var(--primary)]/20 shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Enterprise Platform</span>
            </div>
            
            {/* Elegant Header Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-[var(--text-primary)]">
              The AI-Native Enterprise <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-blue-600 dark:to-cyan-400">Asset Intelligence</span> Platform
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Manage physical assets, automate maintenance, run real-time compliance audits, and chat with your infrastructure data.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
              <Link href={session ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full h-12 px-8 text-base shadow-[0_4px_20px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_4px_30px_rgba(var(--primary-rgb),0.35)] transition-all gap-2 group font-semibold">
                  {session ? "Enter Dashboard" : "Start Free Trial"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full rounded-full h-12 px-8 text-base bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-elevated)] transition-all font-semibold text-[var(--text-primary)]">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Premium Vector Dashboard Mockup */}
            <div className="w-full max-w-5xl rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:scale-[1.005] group">
              {/* Browser Window Bar */}
              <div className="h-10 px-4 bg-[var(--surface-elevated)] border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="w-64 h-5 rounded-md bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--text-muted)] font-medium">
                  app.assetflowai.com/dashboard
                </div>
                <div className="w-8" />
              </div>
              
              {/* Mock Dashboard Layout */}
              <div className="flex h-[380px] bg-[var(--background)] text-left select-none">
                {/* Sidebar Mockup */}
                <aside className="w-48 bg-[var(--surface)] border-r border-[var(--border)] p-3 hidden md:flex flex-col gap-1 shrink-0">
                  <div className="h-6 w-24 bg-[var(--primary)]/10 rounded mb-4" />
                  <div className="h-7 bg-[var(--surface-elevated)] rounded-md flex items-center px-2 gap-2 border border-[var(--border)]">
                    <div className="w-3 h-3 rounded bg-[var(--primary)]" />
                    <div className="w-16 h-2.5 bg-[var(--text-primary)]/80 rounded" />
                  </div>
                  <div className="h-7 rounded flex items-center px-2 gap-2">
                    <div className="w-3 h-3 rounded bg-[var(--text-muted)]/40" />
                    <div className="w-20 h-2.5 bg-[var(--text-muted)]/50 rounded" />
                  </div>
                  <div className="h-7 rounded flex items-center px-2 gap-2">
                    <div className="w-3 h-3 rounded bg-[var(--text-muted)]/40" />
                    <div className="w-14 h-2.5 bg-[var(--text-muted)]/50 rounded" />
                  </div>
                </aside>
                
                {/* Content Mockup */}
                <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4">
                  {/* Summary Bar */}
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <div className="flex flex-col gap-1">
                      <div className="w-28 h-3.5 bg-[var(--text-primary)] rounded" />
                      <div className="w-40 h-2 bg-[var(--text-muted)]/50 rounded" />
                    </div>
                    <div className="w-20 h-7 bg-[var(--primary)]/10 rounded-full border border-[var(--primary)]/30" />
                  </div>
                  
                  {/* Grid Widgets */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col gap-2">
                      <div className="w-10 h-2 bg-[var(--text-muted)] rounded" />
                      <div className="w-14 h-5 bg-[var(--text-primary)] rounded" />
                      <div className="w-16 h-1.5 bg-emerald-500/20 rounded" />
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col gap-2">
                      <div className="w-12 h-2 bg-[var(--text-muted)] rounded" />
                      <div className="w-16 h-5 bg-[var(--text-primary)] rounded" />
                      <div className="w-12 h-1.5 bg-[var(--primary)]/20 rounded" />
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col gap-2">
                      <div className="w-14 h-2 bg-[var(--text-muted)] rounded" />
                      <div className="w-10 h-5 bg-[var(--text-primary)] rounded" />
                      <div className="w-16 h-1.5 bg-yellow-500/20 rounded" />
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col gap-2">
                      <div className="w-10 h-2 bg-[var(--text-muted)] rounded" />
                      <div className="w-12 h-5 bg-[var(--text-primary)] rounded" />
                      <div className="w-8 h-1.5 bg-violet-500/20 rounded" />
                    </div>
                  </div>
                  
                  {/* Bottom Panel */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0">
                    {/* Chart Mock */}
                    <div className="lg:col-span-2 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col gap-2">
                      <div className="w-24 h-3 bg-[var(--text-primary)]/80 rounded" />
                      <div className="flex-1 flex items-end gap-1.5 pt-2">
                        <div className="w-full bg-[var(--primary)]/20 rounded-t h-[40%]" />
                        <div className="w-full bg-[var(--primary)]/35 rounded-t h-[60%]" />
                        <div className="w-full bg-[var(--primary)]/50 rounded-t h-[50%]" />
                        <div className="w-full bg-[var(--primary)]/70 rounded-t h-[80%]" />
                        <div className="w-full bg-[var(--primary)] rounded-t h-[95%]" />
                      </div>
                    </div>
                    {/* List Mock */}
                    <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col gap-3 overflow-hidden">
                      <div className="w-16 h-3 bg-[var(--text-primary)]/80 rounded" />
                      <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between items-center"><div className="w-20 h-2 bg-[var(--text-secondary)] rounded" /><div className="w-10 h-3 bg-emerald-500/10 rounded" /></div>
                        <div className="flex justify-between items-center"><div className="w-14 h-2 bg-[var(--text-secondary)] rounded" /><div className="w-10 h-3 bg-yellow-500/10 rounded" /></div>
                        <div className="flex justify-between items-center"><div className="w-16 h-2 bg-[var(--text-secondary)] rounded" /><div className="w-10 h-3 bg-emerald-500/10 rounded" /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Logo Wall Section */}
        <section className="py-12 border-y border-[var(--border)] bg-[var(--surface-elevated)]/30">
          <div className="container mx-auto px-6 max-w-7xl text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-8">
              TRUSTED BY LEADING ENTERPRISES & INFRASTRUCTURE TEAMS
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 opacity-70">
              <div className="flex items-center gap-2 text-lg font-black tracking-tight text-[var(--text-secondary)] select-none">
                <Layers className="w-5 h-5 text-[var(--primary)]" />
                <span>APEX</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-black tracking-tight text-[var(--text-secondary)] select-none">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <span>SYNAPSE</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-black tracking-tight text-[var(--text-secondary)] select-none">
                <Lock className="w-5 h-5 text-emerald-500" />
                <span>CYPHER</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-black tracking-tight text-[var(--text-secondary)] select-none">
                <History className="w-5 h-5 text-violet-500" />
                <span>CHRONO</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section id="features" className="py-28">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-[var(--text-primary)]">
                Next-Gen Operational Intelligence
              </h2>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg leading-relaxed">
                Streamline compliance, automate audit logging, track real-time locations, and eliminate standard spreadsheets forever.
              </p>
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-[340px]">
              
              {/* Card 1 - Smart Inventory Tracking (Large: 2 cols) */}
              <div className="lg:col-span-2 bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] flex flex-col md:flex-row justify-between gap-8 group hover:border-[var(--primary)]/40 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.06)] transition-all duration-500 overflow-hidden relative">
                <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                      <Box className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Smart Inventory & Tagging</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                      Establish immutable asset nodes with dynamic QR/Barcode tags. Easily assign, locate, and audit items across all enterprise facilities.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--primary)] group-hover:gap-3 transition-all mt-4">
                    <span>Explore Inventory Modules</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Graphic */}
                <div className="w-full md:w-64 h-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-3 select-none">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-4 bg-[var(--primary)]/10 rounded flex items-center justify-center text-[8px] text-[var(--primary)] font-bold">QR09811</div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="w-full h-8 bg-[var(--background)] border border-[var(--border)] rounded flex items-center justify-center font-mono text-xs text-[var(--text-secondary)]">
                      ||| |||| | |||| |
                    </div>
                    <div className="h-3 w-32 bg-[var(--text-primary)] rounded" />
                    <div className="h-2 w-20 bg-[var(--text-muted)] rounded" />
                  </div>
                  <div className="h-8 bg-[var(--background)] border border-[var(--border)] rounded flex items-center justify-between px-3 text-[9px] text-[var(--text-secondary)]">
                    <span>Location: Floor 4</span>
                    <span className="font-semibold">Healthy</span>
                  </div>
                </div>
              </div>

              {/* Card 2 - Predictive Maintenance (Small: 1 col) */}
              <div className="bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] flex flex-col justify-between group hover:border-emerald-500/40 hover:shadow-[0_20px_50px_rgba(16,185,129,0.06)] transition-all duration-500 overflow-hidden relative">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Predictive Maintenance</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                      Reduce operational downtime with automated schedule pipelines and failure forecast indexes.
                    </p>
                  </div>
                  
                  {/* Calendar Widget Graphic */}
                  <div className="mt-4 p-3 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl flex flex-col gap-2 select-none">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase">Schedule</span>
                      <span className="w-10 h-4 bg-emerald-500/10 rounded flex items-center justify-center text-[7px] text-emerald-500 font-bold">Auto-assigned</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[var(--background)] border border-[var(--border)] rounded flex flex-col items-center justify-center text-[10px] font-bold text-[var(--text-primary)]">
                        <span className="text-[6px] text-emerald-500 font-bold leading-none">JUL</span>
                        <span className="leading-none">14</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="h-2.5 w-24 bg-[var(--text-primary)] rounded" />
                        <div className="h-1.5 w-16 bg-[var(--text-muted)]/50 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 - AI Assistant (Small: 1 col) */}
              <div className="bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] flex flex-col justify-between group hover:border-[var(--primary)]/40 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.06)] transition-all duration-500 overflow-hidden relative">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-6 text-[var(--primary)]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">AI-Powered Insights</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                      Interact with your data through natural language. Query asset histories, audits, and schedules instantly.
                    </p>
                  </div>
                  
                  {/* Chat Widget Graphic */}
                  <div className="mt-4 flex flex-col gap-2 select-none">
                    <div className="self-end px-3 py-1.5 rounded-2xl rounded-tr-sm bg-[var(--primary)] text-white text-[9px] max-w-[80%]">
                      List failing assets.
                    </div>
                    <div className="self-start px-3 py-1.5 rounded-2xl rounded-tl-sm bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] text-[9px] max-w-[85%] flex gap-1.5 items-center">
                      <Sparkles className="w-2.5 h-2.5 text-[var(--primary)]" />
                      <span>Found 1: UPS-B2 has critical status.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 - Compliance & Audits (Large: 2 cols) */}
              <div className="lg:col-span-2 bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] flex flex-col md:flex-row justify-between gap-8 group hover:border-violet-500/40 hover:shadow-[0_20px_50px_rgba(139,92,246,0.06)] transition-all duration-500 overflow-hidden relative">
                <div className="flex-1 flex flex-col justify-between h-full relative z-10">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 text-violet-500">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">Enterprise Compliance</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                      Satisfy stringent industry guidelines with automated checklist workflows, immutable logging protocols, and secure role-based controls.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-violet-500 group-hover:gap-3 transition-all mt-4">
                    <span>View Compliance Accreditations</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Audit Checklist Graphic */}
                <div className="w-full md:w-64 h-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-2.5 justify-center select-none">
                  <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-lg p-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[9px] text-[var(--text-primary)] font-semibold">ISO 27001 Certified</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-lg p-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[9px] text-[var(--text-primary)] font-semibold">SOC 2 Type II Compliance</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-lg p-2">
                    <div className="w-4 h-4 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[9px] text-[var(--text-primary)] font-semibold">Immutable Access Logs</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Dynamic CTA Banner */}
        <section className="py-28 relative overflow-hidden border-t border-[var(--border)]">
          <div className="absolute inset-0 bg-[var(--primary)]/[0.02]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-3xl -z-10" />
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-[var(--text-primary)]">
              Transform Your Asset Lifecycle
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Join leading organizations optimizing their tracking, audits, maintenance, and compliance routines today.
            </p>
            <Link href={session ? "/dashboard" : "/signup"}>
              <Button size="lg" className="rounded-full h-14 px-10 text-base shadow-[0_4px_25px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_4px_35px_rgba(var(--primary-rgb),0.45)] hover:scale-105 duration-300 transition-all font-semibold">
                {session ? "Enter Workspace" : "Get Started Instantly"}
              </Button>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface-elevated)]/20 py-12 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-[var(--text-secondary)] font-semibold">
            <Logo mode="icon" iconClassName="w-6 h-6" />
            <span>© 2026 AssetFlow AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)] font-medium">
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
