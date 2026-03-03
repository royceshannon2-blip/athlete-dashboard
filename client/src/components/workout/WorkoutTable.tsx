import { motion } from "framer-motion";
import { Zap, Dumbbell, Sparkles, Clock, Layers, Repeat, Crosshair } from "lucide-react";
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
    case "Plyo":
      return <div className="flex items-center gap-2 text-[#39ff14]"><Zap className="w-4 h-4" /> <span className="font-display font-bold tracking-wider uppercase text-sm">Plyo</span></div>;
    case "Strength":
      return <div className="flex items-center gap-2 text-[#00f0ff]"><Dumbbell className="w-4 h-4" /> <span className="font-display font-bold tracking-wider uppercase text-sm">Strength</span></div>;
    case "Aesthetic":
      return <div className="flex items-center gap-2 text-[#ffea00]"><Sparkles className="w-4 h-4" /> <span className="font-display font-bold tracking-wider uppercase text-sm">Aesthetic</span></div>;
  }
};

const TempoDisplay = ({ tempo }: { tempo: string }) => {
  const parts = tempo.split('-');
  
  return (
    <div className="flex items-center gap-1 font-mono text-sm bg-slate-900 px-3 py-1.5 rounded-md border border-white/5">
      {parts.map((part, idx) => {
        const isLast = idx === parts.length - 1;
        if (part === 'X') {
          return (
            <span key={idx} className="flex items-center">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger className="cursor-help font-bold text-[#00f0ff] hover:text-white transition-colors border-b border-dashed border-[#00f0ff]/50 pb-0.5">
                    {part}
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-800 border border-slate-700 p-4 shadow-xl shadow-black/50">
                    <p className="font-display text-lg mb-1 flex items-center gap-2">
                      <span className="text-[#00f0ff] font-bold">X</span> = EXPLOSIVE
                    </p>
                    <p className="text-sm text-slate-300 max-w-[200px] leading-relaxed">
                      Execute concentric phase with maximum velocity to recruit fast-twitch muscle fibers.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {!isLast && <span className="text-slate-600 mx-1">-</span>}
            </span>
          );
        }
        return (
          <span key={idx} className="flex items-center">
            <span className="text-slate-300">{part}</span>
            {!isLast && <span className="text-slate-600 mx-1">-</span>}
          </span>
        );
      })}
    </div>
  );
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function WorkoutTable({ workout }: WorkoutTableProps) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="bg-slate-900/80 border-b border-white/5 p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase flex items-center gap-3">
            <span className="text-primary opacity-50">///</span>
            {workout.day} BLOCK
          </h2>
          <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm">
            <Crosshair className="w-4 h-4 text-slate-500" />
            Focus: <span className="text-white font-medium">{workout.focus}</span>
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-white/5 text-xs font-display tracking-widest text-slate-400 uppercase">
              <th className="py-4 px-6 font-semibold w-40">Phase</th>
              <th className="py-4 px-6 font-semibold">Exercise</th>
              <th className="py-4 px-6 font-semibold w-32"><div className="flex items-center gap-2"><Layers className="w-3.5 h-3.5" /> Sets x Reps</div></th>
              <th className="py-4 px-6 font-semibold w-40"><div className="flex items-center gap-2"><Repeat className="w-3.5 h-3.5" /> Tempo</div></th>
              <th className="py-4 px-6 font-semibold w-32"><div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Rest</div></th>
            </tr>
          </thead>
          <motion.tbody 
            variants={container}
            initial="hidden"
            animate="show"
            key={workout.id} // Re-animate on day change
          >
            {workout.exercises.map((exercise) => (
              <motion.tr 
                key={exercise.id}
                variants={item}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
              >
                <td className="py-5 px-6 align-middle">
                  <PhaseIcon phase={exercise.phase} />
                </td>
                <td className="py-5 px-6 align-middle">
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors text-base">
                    {exercise.name}
                  </span>
                </td>
                <td className="py-5 px-6 align-middle">
                  <span className="text-slate-300 font-medium bg-white/5 px-2.5 py-1 rounded">
                    {exercise.setsReps}
                  </span>
                </td>
                <td className="py-5 px-6 align-middle">
                  <TempoDisplay tempo={exercise.tempo} />
                </td>
                <td className="py-5 px-6 align-middle">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    {exercise.rest}
                  </span>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
