import { motion } from "framer-motion";
import { Activity, Zap, ShieldAlert, Crosshair } from "lucide-react";

interface SidebarProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
  days: { day: string; focus: string }[];
}

const ProgressBar = ({ 
  label, 
  value, 
  colorClass, 
  glowClass 
}: { 
  label: string; 
  value: number; 
  colorClass: string;
  glowClass: string;
}) => (
  <div className="mb-6 last:mb-0">
    <div className="flex justify-between text-xs mb-2 font-display tracking-wider font-semibold text-slate-300">
      <span className="uppercase">{label}</span>
      <span className={colorClass}>{value}%</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden bg-slate-800">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className={`h-full ${colorClass.replace('text-', 'bg-')} ${glowClass} relative`}
      >
        {/* Shine effect */}
        <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
      </motion.div>
    </div>
  </div>
);

export function Sidebar({ selectedDay, onSelectDay, days }: SidebarProps) {
  return (
    <aside className="w-full md:w-80 h-full border-r border-white/5 bg-slate-900/80 flex flex-col backdrop-blur-2xl relative z-20">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <Activity className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-display font-bold text-white tracking-widest text-shadow-neon-blue">
            APEX
          </h1>
        </div>
        <p className="text-xs font-display text-slate-400 tracking-[0.2em] uppercase">
          Elite Performance System
        </p>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        <h2 className="px-8 text-xs font-display font-semibold tracking-widest text-slate-500 mb-4">
          TRAINING MICROCYCLE
        </h2>
        <ul className="space-y-1">
          {days.map(({ day, focus }) => {
            const isActive = selectedDay === day;
            return (
              <li key={day}>
                <button
                  onClick={() => onSelectDay(day)}
                  className={`w-full text-left px-8 py-4 transition-all duration-300 flex items-center justify-between group
                    ${isActive 
                      ? 'bg-primary/10 border-r-4 border-primary' 
                      : 'hover:bg-white/[0.02] border-r-4 border-transparent'
                    }`}
                >
                  <div>
                    <div className={`font-display text-lg font-bold transition-colors ${isActive ? 'text-primary' : 'text-slate-300 group-hover:text-white'}`}>
                      {day.toUpperCase()}
                    </div>
                    <div className={`text-xs mt-1 transition-colors ${isActive ? 'text-primary/70' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {focus}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div layoutId="activeIndicator">
                      <Crosshair className="w-5 h-5 text-primary opacity-80" />
                    </motion.div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-8 border-t border-white/5 bg-slate-950/50">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-display font-bold tracking-widest text-white">
            TWITCH RADAR
          </h2>
        </div>
        
        <ProgressBar 
          label="Lateral Quickness" 
          value={95} 
          colorClass="text-[#00f0ff]" 
          glowClass="shadow-[0_0_12px_#00f0ff]" 
        />
        <ProgressBar 
          label="First-Step" 
          value={90} 
          colorClass="text-[#ffea00]" 
          glowClass="shadow-[0_0_12px_#ffea00]" 
        />
        <ProgressBar 
          label="Hypertrophy" 
          value={85} 
          colorClass="text-[#39ff14]" 
          glowClass="shadow-[0_0_12px_#39ff14]" 
        />
      </div>
    </aside>
  );
}
