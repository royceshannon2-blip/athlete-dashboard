import { Activity, Flame, Wind } from "lucide-react";
import { type BasketballDrill } from "@shared/schema";
import { RepDisplay } from "./RepDisplay";

interface BasketballSectionProps {
  subCategory: "shooting" | "ballHandling" | "finishing";
  drills: BasketballDrill[];
}

const INTENSITY_CONFIG = {
  low: { icon: Wind, color: "text-[#60a5fa]", bg: "bg-[#60a5fa]/10", border: "border-[#60a5fa]/20", label: "Low" },
  medium: { icon: Activity, color: "text-[#fb923c]", bg: "bg-[#fb923c]/10", border: "border-[#fb923c]/20", label: "Medium" },
  high: { icon: Flame, color: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]/20", label: "High" },
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
        const cfg = INTENSITY_CONFIG[drill.intensity];
        const IntensityIcon = cfg.icon;

        return (
          <div key={drill.id} className={`rounded-xl border ${cfg.border} overflow-hidden`}>
            <div className={`${cfg.bg} p-4`}>
              <div className="flex items-start gap-2">
                <IntensityIcon className={`w-4 h-4 ${cfg.color} mt-0.5 flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-bold text-sm uppercase tracking-tight leading-snug">
                    {drill.name}
                  </p>
                  <p className={`text-[11px] font-display font-bold uppercase tracking-widest mt-0.5 ${cfg.color} opacity-70`}>
                    {cfg.label}
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
