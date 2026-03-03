import { motion } from "framer-motion";
import { Zap, Dumbbell, Sparkles, Clock, Layers, Repeat, Info } from "lucide-react";
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

const PhaseIcon = ({ phase }: { phase: Exercise["phase"] }) => {
  switch (phase) {
    case "Plyo": return <Zap className="w-4 h-4 text-[#39ff14]" />;
    case "Strength": return <Dumbbell className="w-4 h-4 text-[#00f0ff]" />;
    case "Aesthetic": return <Sparkles className="w-4 h-4 text-[#ffea00]" />;
  }
};

export function WorkoutTable({ workout }: WorkoutTableProps) {
  return (
    <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-white/5">
      <div className="bg-slate-900/80 p-4 border-b border-white/5">
        <h2 className="text-lg font-display font-bold text-white tracking-widest uppercase">
          {workout.day} <span className="text-slate-500 font-light text-sm">/</span> {workout.focus}
        </h2>
      </div>
      
      <div className="divide-y divide-white/[0.03]">
        {workout.exercises.map((ex) => (
          <div key={ex.id} className="p-4 bg-slate-900/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PhaseIcon phase={ex.phase} />
                <span className="text-white font-bold text-sm uppercase tracking-tight">{ex.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Clock className="w-3 h-3" /> {ex.rest}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded p-2 border border-white/5">
                <div className="text-[10px] text-slate-500 font-display font-bold uppercase mb-1">Load</div>
                <div className="text-slate-200 text-sm font-mono flex items-center gap-1">
                  <Layers className="w-3 h-3 opacity-50" /> {ex.setsReps}
                </div>
              </div>
              
              <div className="bg-white/5 rounded p-2 border border-white/5">
                <div className="text-[10px] text-slate-500 font-display font-bold uppercase mb-1 flex items-center justify-between">
                  Tempo
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger><Info className="w-3 h-3 text-primary opacity-50" /></TooltipTrigger>
                      <TooltipContent className="bg-slate-800 text-xs">X = Explosive velocity</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-slate-200 text-sm font-mono font-bold">
                  {ex.tempo.split('-').map((p, i) => (
                    <span key={i} className={p === 'X' ? 'text-[#00f0ff]' : ''}>
                      {p}{i < 3 ? '-' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
