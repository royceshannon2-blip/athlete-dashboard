import { useState } from "react";
import { useWorkouts } from "@/hooks/use-workouts";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkoutTable } from "@/components/workout/WorkoutTable";
import { Activity, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const { data: workouts, isLoading, error } = useWorkouts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !workouts) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="text-center">
          <Activity className="w-10 h-10 text-destructive mx-auto mb-4" />
          <p className="text-white font-display uppercase tracking-widest">System Error</p>
        </div>
      </div>
    );
  }

  const daysList = workouts.map(w => ({ day: w.day, focus: w.focus }));
  const activeWorkout = workouts.find(w => w.day === selectedDay) || workouts[0];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      <Sidebar 
        selectedDay={selectedDay} 
        onSelectDay={setSelectedDay} 
        days={daysList}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
            <h2 className="text-xl font-display font-bold text-white tracking-wide uppercase">
              {activeWorkout.day} <span className="text-slate-600">/</span> PRO
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Optimal</span>
            </div>
          </div>

          <WorkoutTable workout={activeWorkout} />
          
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 px-2 uppercase tracking-tighter">
            <span>SECURE LINK: ESTABLISHED</span>
            <span>V 1.0.4</span>
          </div>
        </div>
      </main>
    </div>
  );
}
