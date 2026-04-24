import { Studio } from "@/components/studio/Studio";

export default function HomePage() {
  return (
    <main className="min-h-screen relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white/[0.02] rounded-full opacity-20 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1 w-8 bg-teal-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">
                Studio Alpha v2
              </span>
            </div>
            <h1 className="text-3xl font-light tracking-tight text-white flex items-center gap-3">
              Duos <span className="font-bold text-teal-400">Studio</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System Status</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 uppercase">Operational</span>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-3xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-3xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Workflow</p>
          <p className="mt-2 text-sm text-slate-300">
            1) Upload or paste tagged markdown, 2) compile to validate structure, 3) review in the focused content view.
          </p>
        </section>

        <Studio />
      </div>
    </main>
  );
}
