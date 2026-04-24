import { Studio } from "@/components/studio/Studio";
import { ReleasePanel } from "@/components/release-panel";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

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
        <header className="mb-12 flex items-center justify-between">
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

        <Studio />

        <section className="mt-20 grid lg:grid-cols-2 gap-12 items-start h-full">
          <div className="space-y-6">
            <h2 className="text-2xl font-light text-white tracking-tight">System Infrastructure</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Duos Studio utilizes a refined Markdown parsing engine to convert tagged textbook content into interactive React components. The system enforces strict atomic validation, ensuring that every exercise meets educational standard schemas.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-1">Real-time Parsing</p>
                 <p className="text-xs text-slate-500 uppercase tracking-tighter">Sub-100ms validation</p>
               </div>
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <p className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mb-1">Persistence</p>
                 <p className="text-xs text-slate-500 uppercase tracking-tighter">Client-side Indexed Records</p>
               </div>
            </div>
          </div>
          
          <Suspense fallback={
            <div className="h-[200px] flex items-center justify-center bg-white/[0.02] rounded-3xl border border-white/5 animate-pulse">
               <Loader2 className="text-teal-500 animate-spin" />
            </div>
          }>
            <ReleasePanel />
          </Suspense>
        </section>

        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 pb-12 text-slate-600">
           <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 Duos Educational Technology</p>
           <div className="flex items-center gap-6">
             <span className="text-[10px] font-bold uppercase tracking-widest hover:text-teal-500 cursor-pointer transition-colors">Documentation</span>
             <span className="text-[10px] font-bold uppercase tracking-widest hover:text-teal-500 cursor-pointer transition-colors">Schema Registry</span>
             <span className="text-[10px] font-bold uppercase tracking-widest hover:text-teal-500 cursor-pointer transition-colors">API Status</span>
           </div>
        </footer>
      </div>
      
      {/* Decorative Sidebar Tag */}
      <div className="fixed right-6 bottom-12 z-50 pointer-events-none hidden xl:block">
        <p className="text-[10px] font-black uppercase tracking-[1em] rotate-90 origin-right text-white/20 whitespace-nowrap">
          EXTRACT_VALIDATE_GENERATE
        </p>
      </div>
    </main>
  );
}
