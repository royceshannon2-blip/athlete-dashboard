import { type BasketballRep } from "@shared/schema";

interface RepDisplayProps {
  reps: BasketballRep;
}

export function RepDisplay({ reps }: RepDisplayProps) {
  if (reps.type === "makes") {
    return <span className="text-slate-300 font-mono">{reps.makes} makes</span>;
  }

  if (reps.type === "setsPerHand") {
    const leftReps = Math.ceil(reps.rightReps * 1.1);
    return (
      <div className="space-y-1">
        <div className="text-slate-300 font-mono">{reps.sets} sets</div>
        <div className="text-slate-300 font-mono">
          {reps.rightReps} reps (R) <span className="text-slate-400">·</span>{" "}
          <span className="font-bold">{leftReps} reps (L)</span>
        </div>
      </div>
    );
  }

  if (reps.type === "makesPerHand") {
    const leftMakes = Math.ceil(reps.rightMakes * 1.1);
    return (
      <div className="text-slate-300 font-mono">
        {reps.rightMakes} makes (R) <span className="text-slate-400">·</span>{" "}
        <span className="font-bold">{leftMakes} makes (L)</span>
      </div>
    );
  }

  return null;
}
