import type { ErrorBlockProps } from "@/components/exercises/types";

export function ErrorBlock({ data }: ErrorBlockProps) {
  return (
    <section className="rounded-3xl border border-rose-300 bg-rose-50 p-4 text-rose-900">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]">Error</h2>
      <p className="mb-2 text-sm">{data.error}</p>
      {data.block_id ? <p className="mb-2 text-sm">Block ID: {data.block_id}</p> : null}
      {data.raw_input ? (
        <pre className="overflow-x-auto rounded-2xl bg-white/70 p-3 text-xs text-rose-800">
          {data.raw_input}
        </pre>
      ) : null}
    </section>
  );
}
