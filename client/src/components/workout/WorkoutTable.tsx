import { useState } from "react";
import { Zap, Dumbbell, Sparkles, Clock, Layers, Info, ChevronDown } from "lucide-react";
import { type DayWorkout, type Exercise } from "@shared/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WorkoutTableProps {
  workout: DayWorkout;
}

const PHASE_CONFIG = {
  Plyo: { icon: Zap, color: "text-[#39ff14]", bg: "bg-[#39ff14]/10", border: "border-[#39ff14]/20" },
  Strength: { icon: Dumbbell, color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/20" },
  Aesthetic: { icon: Sparkles, color: "text-[#ffea00]", bg: "bg-[#ffea00]/10", border: "border-[#ffea00]/20" },
};

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = PHASE_CONFIG[exercise.phase];
  const PhaseIconComp = cfg.icon;

  return (
    <div className={`rounded-xl border ${cfg.border} overflow-hidden`}>
      <div className={`${cfg.bg} p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0">
            <PhaseIconComp className={`w-4 h-4 ${cfg.color} mt-0.5 flex-shrink-0`} />
            <div className="min-w-0">
              <p className="text-white font-bold text-sm uppercase tracking-tight leading-snug">{exercise.name}</p>
              <p className={`text-[11px] font-display font-bold uppercase tracking-widest mt-0.5 ${cfg.color} opacity-70`}>{exercise.phase}</p>
            </div>
          </div>
          {exercise.note && (
            <button
              data-testid={`btn-expand-${exercise.id}`}
              onClick={() => setExpanded(v => !v)}
              className={`flex-shrink-0 p-1.5 rounded-lg border ${cfg.border} transition-colors ${expanded ? cfg.bg : 'bg-white/5'}`}
            >
              <ChevronDown className={`w-3.5 h-3.5 ${cfg.color} transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-900/40 grid grid-cols-3 gap-2">
        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
          <div className="text-[9px] text-slate-500 font-display font-bold uppercase mb-1 flex items-center gap-1">
            <Layers className="w-2.5 h-2.5" /> Load
          </div>
          <div className="text-slate-200 text-sm font-mono font-bold">{exercise.setsReps}</div>
        </div>

        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
          <div className="text-[9px] text-slate-500 font-display font-bold uppercase mb-1 flex items-center gap-1 justify-between">
            <span>Tempo</span>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-2.5 h-2.5 text-primary/50 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 border-slate-700 text-xs max-w-[180px]">
                  <span className="text-[#00f0ff] font-bold">X</span> = Execute concentric phase with maximum velocity to recruit fast-twitch fibers.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-slate-200 text-sm font-mono font-bold">
            {exercise.tempo.split('-').map((p, i, arr) => (
              <span key={i} className={p === 'X' ? 'text-[#00f0ff]' : ''}>
                {p}{i < arr.length - 1 ? '-' : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
          <div className="text-[9px] text-slate-500 font-display font-bold uppercase mb-1 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Rest
          </div>
          <div className="text-slate-200 text-sm font-mono font-bold">{exercise.rest}</div>
        </div>
      </div>

      {exercise.note && expanded && (
        <div className={`px-4 pb-4 bg-slate-900/40 border-t ${cfg.border}`}>
          <div className={`${cfg.bg} rounded-lg p-3 mt-2 border ${cfg.border}`}>
            <div className={`text-[9px] font-display font-bold uppercase tracking-widest mb-2 ${cfg.color} flex items-center gap-1`}>
              <Info className="w-2.5 h-2.5" /> Coaching Cue
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{exercise.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkoutTable({ workout }: WorkoutTableProps) {
  return (
    <div className="space-y-3">
      <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5">
        <h2 className="text-lg font-display font-bold text-white tracking-widest uppercase">
          {workout.day}
        </h2>
        <p className="text-slate-400 text-xs font-display uppercase tracking-widest mt-0.5">{workout.focus}</p>
      </div>

      {workout.exercises.map((ex) => (
        <ExerciseCard key={ex.id} exercise={ex} />
      ))}
    </div>
  );
}
