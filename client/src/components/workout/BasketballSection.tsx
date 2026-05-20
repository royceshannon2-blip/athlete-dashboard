import { Zap, Dumbbell, Sparkles } from "lucide-react";
import { type BasketballDrill } from "@shared/schema";
import { RepDisplay } from "./RepDisplay";

interface BasketballSectionProps {
  subCategory: "shooting" | "ballHandling" | "finishing";
  drills: BasketballDrill[];
}

const PHASE_CONFIG = {
  Plyo: { icon: Zap, color: "text-[#39ff14]", bg: "bg-[#39ff14]/10", border: "border-[#39ff14]/20" },
  Strength: { icon: Dumbbell, color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/20" },
  Aesthetic: { icon: Sparkles, color: "text-[#ffea00]", bg: "bg-[#ffea00]/10", border: "border-[#ffea00]/20" },
};

const SUBCATEGORY_LABELS = {
  shooting: "Shooting",
  ballHandling: "Ball Handling",
  finishing: "Finishing",
};

export function BasketballSection({ subCategory, drills }: BasketballSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-display font-bold text-white tracking-widest uppercase mb-4">
        {SUBCATEGORY_LABELS[subCategory]}
      </h3>

      {drills.map((drill) => {
        const cfg = PHASE_CONFIG[drill.phase];
        const PhaseIcon = cfg.icon;

        return (
          <div key={drill.id} className={`rounded-xl border ${cfg.border} overflow-hidden`}>
            <div className={`${cfg.bg} p-4`}>
              <div className="flex items-start gap-2">
                <PhaseIcon className={`w-4 h-4 ${cfg.color} mt-0.5 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-bold text-sm uppercase tracking-tight leading-snug">
                    {drill.name}
                  </p>
                  <p className={`text-[11px] font-display font-bold uppercase tracking-widest mt-0.5 ${cfg.color} opacity-70`}>
                    {drill.phase}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/40 space-y-3">
              <div>
                <div className="text-[9px] text-slate-500 font-display font-bold uppercase mb-2">
                  Description
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{drill.description}</p>
              </div>

              <div>
                <div className="text-[9px] text-slate-500 font-display font-bold uppercase mb-2">
                  Reps
                </div>
                <RepDisplay reps={drill.reps} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
