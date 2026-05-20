import { useState, useEffect } from "react";
import { useWorkouts } from "@/hooks/use-workouts";
import { useWeightLog, parseSetsReps } from "@/hooks/use-weight-log";
import { useRestTimer } from "@/hooks/use-rest-timer";
import { Sidebar } from "@/components/layout/Sidebar";
import { WorkoutTable } from "@/components/workout/WorkoutTable";
import { ScheduleBrowserButton } from "@/components/ScheduleBrowserButton";
import { ScheduleBrowserPanel } from "@/components/ScheduleBrowserPanel";
import { DashboardButton } from "@/components/DashboardButton";
import { SetLogPrompt } from "@/components/SetLogPrompt";
import { RestTimer } from "@/components/RestTimer";
import { TimerSettings } from "@/components/TimerSettings";
import { ProgressionDashboard } from "@/components/ProgressionDashboard";
import { Activity, Loader2 } from "lucide-react";
import type { Exercise, CategoryWorkout, DurationWorkout } from "@shared/schema";

interface PromptState {
  exercise: Exercise;
  setNumber: number;
  totalSets: number;
  targetReps: string;
}

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedCategory, setSelectedCategory] = useState("weightlifting");
  const [selectedDuration, setSelectedDuration] = useState("1h");
  const [scheduleBrowserOpen, setScheduleBrowserOpen] = useState(false);
  const [progressionOpen, setProgressionOpen] = useState(false);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, Set<number>>>({});
  const [timerSettingsOpen, setTimerSettingsOpen] = useState(false);

  const weightLog = useWeightLog();
  const restTimer = useRestTimer(
    weightLog.prefs.defaultDurationSecs,
    weightLog.prefs.soundEnabled
  );

  const { data: workoutsData, isLoading, error } = useWorkouts();

  useEffect(() => {
    setCompletedSets({});
  }, [selectedDay, selectedCategory, selectedDuration]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !workoutsData) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="text-center">
          <Activity className="w-10 h-10 text-destructive mx-auto mb-4" />
          <p className="text-white font-display uppercase tracking-widest">System Error</p>
        </div>
      </div>
    );
  }

  const handleSetComplete = (exercise: Exercise, setNumber: number) => {
    const { sets, reps } = parseSetsReps(exercise.setsReps);
    setPromptState({ exercise, setNumber, totalSets: sets, targetReps: reps });
  };

  const handleLog = (weightKg: number, unit: "lbs" | "kg") => {
    if (!promptState) return;
    weightLog.logSet(
      promptState.exercise.id,
      promptState.exercise.name,
      promptState.setNumber,
      promptState.targetReps,
      weightKg,
      unit
    );
    markSetComplete(promptState.exercise.id, promptState.setNumber);
    setPromptState(null);
    restTimer.reset();
  };

  const handleSkip = () => {
    if (!promptState) return;
    markSetComplete(promptState.exercise.id, promptState.setNumber);
    setPromptState(null);
    restTimer.reset();
  };

  const markSetComplete = (exerciseId: string, setNumber: number) => {
    setCompletedSets((prev) => {
      const next = { ...prev };
      const existing = prev[exerciseId] ?? new Set();
      const updated = new Set(existing);
      updated.add(setNumber);
      next[exerciseId] = updated;
      return next;
    });
  };

  const daysList = workoutsData.workouts.map(w => ({ day: w.day, focus: w.focus || "" }));
  const activeDay = workoutsData.workouts.find(w => w.day === selectedDay) || workoutsData.workouts[0];

  let activeCategoryWorkout: CategoryWorkout | undefined;
  let activeDurationWorkout: DurationWorkout | undefined;
  let activeBasketballWorkout: any = undefined;

  if (activeDay) {
    activeCategoryWorkout = activeDay.categoryWorkouts.find(cw => cw.category === selectedCategory);
    if (activeCategoryWorkout) {
      if (selectedCategory === "basketball") {
        activeBasketballWorkout = activeCategoryWorkout.workouts.find(dw => dw.duration === selectedDuration);
      } else {
        activeDurationWorkout = activeCategoryWorkout.workouts.find(dw => dw.duration === selectedDuration);
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      <Sidebar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedDuration={selectedDuration}
        onSelectDuration={setSelectedDuration}
        days={daysList}
        categories={workoutsData.categories}
        durations={workoutsData.durations}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-24 md:pb-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
            <h2 className="text-xl font-display font-bold text-white tracking-wide uppercase">
              {activeDay.day} <span className="text-slate-600">/</span> {selectedCategory.toUpperCase()} - {selectedDuration}
            </h2>
            <div className="flex items-center gap-4">
              {selectedCategory === "weightlifting" && (
                <DashboardButton onClick={() => setProgressionOpen(true)} />
              )}
              <ScheduleBrowserButton onClick={() => setScheduleBrowserOpen(true)} />
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Optimal</span>
              </div>
            </div>
          </div>

          {selectedCategory === "basketball" && activeBasketballWorkout && (
            <WorkoutTable
              drills={activeBasketballWorkout.drills}
              category={selectedCategory}
            />
          )}
          {selectedCategory !== "basketball" && activeDurationWorkout && (
            <WorkoutTable
              exercises={activeDurationWorkout.exercises}
              category={selectedCategory}
              onSetComplete={handleSetComplete}
              completedSets={completedSets}
            />
          )}

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 px-2 uppercase tracking-tighter">
            <span>SECURE LINK: ESTABLISHED</span>
            <span>V 1.0.5</span>
          </div>
        </div>

        {(selectedCategory === "weightlifting" || selectedCategory === "jumping") && (
          <RestTimer
            remaining={restTimer.remaining}
            isRunning={restTimer.isRunning}
            isFinished={restTimer.isFinished}
            duration={restTimer.duration}
            onStart={restTimer.start}
            onPause={restTimer.pause}
            onReset={restTimer.reset}
            onNudge={restTimer.nudge}
            onOpenSettings={() => setTimerSettingsOpen(true)}
          />
        )}
      </main>

      <SetLogPrompt
        exercise={promptState?.exercise ?? null}
        setNumber={promptState?.setNumber ?? 1}
        totalSets={promptState?.totalSets ?? 1}
        onLog={handleLog}
        onSkip={handleSkip}
      />

      <TimerSettings
        prefs={weightLog.prefs}
        updatePrefs={weightLog.updatePrefs}
        isOpen={timerSettingsOpen}
        onClose={() => setTimerSettingsOpen(false)}
      />

      <ProgressionDashboard
        isOpen={progressionOpen}
        onClose={() => setProgressionOpen(false)}
      />

      <ScheduleBrowserPanel
        isOpen={scheduleBrowserOpen}
        onClose={() => setScheduleBrowserOpen(false)}
      />
    </div>
  );
}
