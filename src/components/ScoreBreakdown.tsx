import type { ScoreSignals } from "@/lib/types";

const LABELS: { key: keyof ScoreSignals; label: string }[] = [
  { key: "semantic", label: "Semantic fit" },
  { key: "experience", label: "Experience" },
  { key: "seniority", label: "Seniority" },
  { key: "location", label: "Location" },
  { key: "availability", label: "Availability" },
];

export function ScoreBreakdown({ signals }: { signals: ScoreSignals }) {
  return (
    <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
      {LABELS.map(({ key, label }) => {
        const pct = Math.round(signals[key] * 100);
        return (
          <div key={key} className="flex items-center gap-2 text-xs">
            <span className="w-24 shrink-0 text-neutral-500">{label}</span>
            <div className="h-1.5 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div className="h-1.5 rounded-full bg-ember" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 shrink-0 text-right tabular-nums text-neutral-500">{pct}</span>
          </div>
        );
      })}
    </div>
  );
}
