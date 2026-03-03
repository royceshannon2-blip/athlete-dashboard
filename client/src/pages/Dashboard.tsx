import { useState } from "react";
import { useWorkouts } from "@/hooks/use-workouts";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkoutTable } from "@/components/workout/WorkoutTable";
import { Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const { data: workouts, isLoading, error } = useWorkouts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-primary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 mb-4 opacity-80" />
        </motion.div>
        <h2 className="font-display tracking-[0.3em] uppercase text-xl text-shadow-neon-blue">
          Loading Matrix
        </h2>
      </div>
    );
  }

  if (error || !workouts) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-destructive">
        <div className="glass-panel p-8 max-w-md text-center rounded-2xl">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="font-display tracking-widest text-xl mb-2 text-white">SYSTEM ERROR</h2>
          <p className="text-slate-400 text-sm">Failed to load training protocols.</p>
        </div>
      </div>
    );
  }

  const daysList = workouts.map(w => ({ day: w.day, focus: w.focus }));
  const activeWorkout = workouts.find(w => w.day === selectedDay) || workouts[0];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-body">
      {/* Mobile Overlay - Only visible on sm/md screens to handle responsive sidebar (simplified for this design) */}
      <Sidebar 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay} 
        days={daysList}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background ambient glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        
        <header className="px-8 lg:px-12 py-8 flex items-center justify-between border-b border-white/[0.02] z-10">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-display font-bold tracking-widest text-primary mb-3"
            >
              ACTIVE CYCLE
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white tracking-wide">
              PROTOCOL <span className="text-slate-500 font-light">/</span> {activeWorkout.day.toUpperCase()}
            </h2>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-right">
            <div>
              <div className="text-xs font-display tracking-widest text-slate-500 uppercase">Athlete Status</div>
              <div className="text-emerald-400 font-medium font-mono text-sm flex items-center justify-end gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                OPTIMAL
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <WorkoutTable workout={activeWorkout} />
            
            <div className="mt-8 flex gap-4 text-xs font-mono text-slate-500 justify-end">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#00f0ff]/50" /> Fast-Twitch
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#39ff14]/50" /> Elastic Energy
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
