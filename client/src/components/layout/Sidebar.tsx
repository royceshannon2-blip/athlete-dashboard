import { motion } from "framer-motion";
import { Activity, Zap, Crosshair } from "lucide-react";

interface SidebarProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
  days: { day: string; focus: string }[];
}

export function Sidebar({ selectedDay, onSelectDay, days }: SidebarProps) {
  return (
    <aside className="w-full md:w-20 lg:w-80 h-auto md:h-full border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/80 flex flex-col backdrop-blur-2xl relative z-20">
      <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between md:block">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-widest md:block">
            APEX
          </h1>
        </div>
      </div>

      <nav className="flex-1 overflow-x-auto md:overflow-y-auto no-scrollbar">
        <ul className="flex md:flex-col min-w-max md:min-w-0">
          {days.map(({ day, focus }) => {
            const isActive = selectedDay === day;
            return (
              <li key={day} className="flex-1 md:flex-none">
                <button
                  onClick={() => onSelectDay(day)}
                  className={`w-full text-left px-6 md:px-8 py-4 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between group
                    ${isActive 
                      ? 'bg-primary/10 border-b-2 md:border-b-0 md:border-r-4 border-primary' 
                      : 'hover:bg-white/[0.02] border-b-2 md:border-b-0 md:border-r-4 border-transparent'
                    }`}
                >
                  <div>
                    <div className={`font-display text-sm md:text-lg font-bold transition-colors ${isActive ? 'text-primary' : 'text-slate-300 group-hover:text-white'}`}>
                      {day.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                  {isActive && (
                    <div className="hidden md:block">
                      <Crosshair className="w-4 h-4 text-primary opacity-80" />
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden lg:block p-8 border-t border-white/5 bg-slate-950/50">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-yellow-400" />
          <h2 className="text-sm font-display font-bold tracking-widest text-white uppercase">
            Radar
          </h2>
        </div>
        {[
          { label: "LAT", val: 95, color: "text-[#00f0ff]" },
          { label: "1ST", val: 90, color: "text-[#ffea00]" },
          { label: "HYP", val: 85, color: "text-[#39ff14]" }
        ].map((stat) => (
          <div key={stat.label} className="mb-3 last:mb-0">
            <div className="flex justify-between text-[10px] mb-1 font-display font-bold text-slate-400">
              <span>{stat.label}</span>
              <span className={stat.color}>{stat.val}%</span>
            </div>
            <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                style={{ width: `${stat.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
