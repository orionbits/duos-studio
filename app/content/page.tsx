"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { parseTaggedInput } from "@/lib/parser";
import { ExerciseRenderer } from "@/components/ExerciseRenderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type ErrorBlock, type ValidBlock } from "@/lib/schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ParsedState = Array<ValidBlock | ErrorBlock>;

export default function ContentPage() {
  const [blocks, setBlocks] = useState<ParsedState>([]);
  const [loaded, setLoaded] = useState(false);
  const [section, setSection] = useState("all");
  const [pageIndex, setPageIndex] = useState(0);

  const PAGE_SIZE = 3;

  useEffect(() => {
    const savedInput = localStorage.getItem("duos-studio-buffer") ?? "";
    if (savedInput.trim()) {
      try {
        const parsed = parseTaggedInput(savedInput);
        setBlocks(parsed);
      } catch (error) {
        console.error("Failed to parse content page input:", error);
        setBlocks([]);
      }
    }
    setLoaded(true);
  }, []);

  const filteredBlocks = useMemo(() => {
    if (section === "reading") {
      return blocks.filter((block) => !("error" in block) && block.category === "READING");
    }
    if (section === "exercises") {
      return blocks.filter((block) => !("error" in block) && block.category === "EXERCISE");
    }
    if (section === "errors") {
      return blocks.filter((block) => "error" in block);
    }
    return blocks;
  }, [blocks, section]);

  const totalPages = Math.max(1, Math.ceil(filteredBlocks.length / PAGE_SIZE));
  const currentPage = Math.min(pageIndex, totalPages - 1);
  const pageBlocks = filteredBlocks.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  useEffect(() => {
    setPageIndex(0);
  }, [section, blocks.length]);

  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500 mb-2">
              Textbook Focus View
            </p>
            <h1 className="text-4xl font-light tracking-tight text-white">
              Imported Textbook Content
            </h1>
            <p className="max-w-2xl text-sm text-slate-400 mt-3">
              This view isolates the parsed tagged markdown into a content-first experience. Use the back button to return to the importer.
            </p>
          </div>

          <Link href="/">
            <Button className="h-12 rounded-2xl bg-white/5 text-white border border-white/10 hover:bg-white/10 shadow-[0_10px_30px_rgba(255,255,255,0.08)] transition-all">
              <ArrowLeft size={16} className="mr-2" /> Back to Importer
            </Button>
          </Link>
        </div>

        {!loaded ? (
          <div className="min-h-[360px] rounded-[2rem] border border-white/10 bg-black/40 p-12 flex items-center justify-center text-slate-500">
            Loading textbook content…
          </div>
        ) : blocks.length === 0 ? (
          <Card className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-12 text-center text-slate-400">
            <h2 className="text-xl font-semibold text-white mb-3">No tagged textbook content found.</h2>
            <p className="text-sm leading-relaxed">
              Paste or upload tagged markdown first in the importer, then click Compile & Render to open the focused content page.
            </p>
          </Card>
        ) : (
          <div className="space-y-5">
            <Card className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Tabs value={section} onValueChange={setSection}>
                  <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 h-auto">
                    <TabsTrigger value="all" className="data-active:bg-teal-500 data-active:text-black rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="reading" className="data-active:bg-teal-500 data-active:text-black rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                      Reading
                    </TabsTrigger>
                    <TabsTrigger value="exercises" className="data-active:bg-teal-500 data-active:text-black rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                      Exercises
                    </TabsTrigger>
                    <TabsTrigger value="errors" className="data-active:bg-teal-500 data-active:text-black rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                      Errors
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value={section} className="hidden" />
                </Tabs>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-white/10 bg-white/5 text-slate-300"
                    onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">
                    Page {currentPage + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-white/10 bg-white/5 text-slate-300"
                    onClick={() => setPageIndex((value) => Math.min(totalPages - 1, value + 1))}
                    disabled={currentPage >= totalPages - 1}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2.5rem] border border-white/10 bg-black/40 p-8">
              {pageBlocks.length === 0 ? (
                <div className="py-16 text-center text-slate-500">No blocks in this section.</div>
              ) : (
                <ExerciseRenderer blocks={pageBlocks} />
              )}
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
