async function fetchReleaseNotes() {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    "App Router only, with no legacy Pages Router files.",
    "Server Components by default, with a small client island for form state.",
    "Pinned dependency versions so installs stay reproducible."
  ];
}

export async function ReleasePanel() {
  const notes = await fetchReleaseNotes();

  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.01] p-8 shadow-2xl backdrop-blur-3xl">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">
        Engine Updates
      </p>
      <h2 className="mt-4 text-2xl font-light text-white tracking-tight">
        Latest System Enhancements
      </h2>
      <ul className="mt-8 space-y-4 text-xs leading-relaxed text-slate-400">
        {notes.map((note) => (
          <li key={note} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
