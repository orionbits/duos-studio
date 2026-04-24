"use client";

type RevealAnswerButtonProps = {
  revealed: boolean;
  onToggle: () => void;
};

export function RevealAnswerButton({
  revealed,
  onToggle
}: RevealAnswerButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {revealed ? "Hide answer" : "Reveal answer"}
    </button>
  );
}
