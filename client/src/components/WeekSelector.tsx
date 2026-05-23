import { useState, useEffect } from "react";
import { useWeeklyRotation } from "@/hooks/use-weekly-rotation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkoutTable } from "@/components/workout/WorkoutTable";
import { Loader2, AlertCircle } from "lucide-react";
import type { BasketballDrill } from "@shared/schema";

export function WeekSelector() {
  const [selectedHistoryWeek, setSelectedHistoryWeek] = useState<number | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState("Monday");

  // Use current week
  const currentWeek = useWeeklyRotation();

  // Use selected history week
  const historyWeek = useWeeklyRotation(selectedHistoryWeek);

  // Determine which data to display based on tab
  const [activeTab, setActiveTab] = useState("current");
  const displayData = activeTab === "current" ? currentWeek : historyWeek;

  // Generate week options for history tab
  const weekOptions = displayData.totalWeeks > 0
    ? Array.from({ length: displayData.totalWeeks }, (_, i) => ({
        value: i,
        label: `Week ${i + 1}`,
      }))
    : [];

  if (currentWeek.loading && activeTab === "current") {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (currentWeek.error && activeTab === "current") {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-destructive">Error loading rotation</p>
          <p className="text-xs text-destructive/80">{currentWeek.error}</p>
        </div>
      </div>
    );
  }

  const displayFullWeekPlan = activeTab === "current" ? currentWeek.fullWeekPlan : historyWeek.fullWeekPlan;
  const displayLoading = activeTab === "current" ? currentWeek.loading : historyWeek.loading;
  const selectedDayData = displayFullWeekPlan?.days.find(d => d.day === selectedDay);

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="border-b border-white/10 px-4 md:px-6">
          <TabsList className="bg-transparent border-b border-white/10 rounded-none w-full justify-start h-auto p-0">
            <TabsTrigger
              value="current"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="current" className="flex-1 overflow-auto m-0">
          <div className="p-4 md:p-6 space-y-4">
            {displayFullWeekPlan && (
              <>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                  <div>
                    <h2 className="text-xl font-display font-bold text-white tracking-wide uppercase">
                      {displayFullWeekPlan.label}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Week {currentWeek.weekIndex + 1} of {currentWeek.totalWeeks}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Active</span>
                  </div>
                </div>

                {/* Day Tabs */}
                <div className="mb-6">
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    {displayFullWeekPlan.days.map(day => (
                      <button
                        key={day.day}
                        onClick={() => setSelectedDay(day.day)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                          selectedDay === day.day
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-slate-800/50 text-slate-300 border border-transparent hover:bg-slate-700/50"
                        }`}
                      >
                        {day.day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDayData && (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-slate-400">{selectedDayData.focus}</p>
                    </div>

                    <div className="space-y-8">
                      {Object.entries(selectedDayData.categories).map(([category, categoryData]) => (
                        <div key={category}>
                          <h3 className="text-lg font-display font-bold text-white uppercase tracking-wide mb-4">
                            {category}
                          </h3>
                          <div className="space-y-4">
                            {categoryData.workouts.map((workout, idx) => (
                              <div key={idx}>
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                  {workout.duration} Duration
                                </h4>
                                <WorkoutTable drills={workout.drills as BasketballDrill[]} category="basketball" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-auto m-0">
          <div className="p-4 md:p-6 space-y-4">
            {weekOptions.length > 0 && (
              <div className="flex items-center gap-3">
                <label htmlFor="week-select" className="text-sm font-semibold text-slate-300">
                  Select Week:
                </label>
                <Select
                  value={selectedHistoryWeek?.toString() ?? "0"}
                  onValueChange={(val) => setSelectedHistoryWeek(parseInt(val))}
                >
                  <SelectTrigger id="week-select" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {displayLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : historyWeek.error ? (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Error loading week</p>
                  <p className="text-xs text-destructive/80">{historyWeek.error}</p>
                </div>
              </div>
            ) : displayFullWeekPlan ? (
              <>
                <div className="border-b border-white/5 pb-4">
                  <h2 className="text-xl font-display font-bold text-white tracking-wide uppercase">
                    {displayFullWeekPlan.label}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Week {selectedHistoryWeek! + 1} of {displayData.totalWeeks}
                  </p>
                </div>

                {/* Day Tabs */}
                <div className="mb-6">
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    {displayFullWeekPlan.days.map(day => (
                      <button
                        key={day.day}
                        onClick={() => setSelectedDay(day.day)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                          selectedDay === day.day
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-slate-800/50 text-slate-300 border border-transparent hover:bg-slate-700/50"
                        }`}
                      >
                        {day.day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDayData && (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-slate-400">{selectedDayData.focus}</p>
                    </div>

                    <div className="space-y-8">
                      {Object.entries(selectedDayData.categories).map(([category, categoryData]) => (
                        <div key={category}>
                          <h3 className="text-lg font-display font-bold text-white uppercase tracking-wide mb-4">
                            {category}
                          </h3>
                          <div className="space-y-4">
                            {categoryData.workouts.map((workout, idx) => (
                              <div key={idx}>
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                  {workout.duration} Duration
                                </h4>
                                <WorkoutTable drills={workout.drills as BasketballDrill[]} category="basketball" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-slate-400">Select a week to view</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
