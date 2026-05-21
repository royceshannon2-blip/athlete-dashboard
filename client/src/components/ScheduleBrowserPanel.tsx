import { useState, useEffect, useRef } from "react";
import { X, Loader2, ChevronRight } from "lucide-react";
import { useScheduleBrowser } from "@/hooks/use-schedule-browser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutTable } from "@/components/workout/WorkoutTable";
import type { Exercise } from "@shared/schema";

interface ScheduleBrowserPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PHASE_COLORS: Record<string, string> = {
  Plyo: "from-[#39ff14]/20 to-[#39ff14]/5 border-[#39ff14]/30",
  Strength: "from-[#00f0ff]/20 to-[#00f0ff]/5 border-[#00f0ff]/30",
  Aesthetic: "from-[#ffea00]/20 to-[#ffea00]/5 border-[#ffea00]/30",
};

function getPhaseColor(exercises: Exercise[]): string {
  if (exercises.length === 0) return "";
  const firstPhase = exercises[0].phase;
  return PHASE_COLORS[firstPhase] || "";
}

export function ScheduleBrowserPanel({ isOpen, onClose }: ScheduleBrowserPanelProps) {
  const { weeks, weekPlans, fetchWeekPlan, loading, error, currentWeekIndex } = useScheduleBrowser();
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [weekLoading, setWeekLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Pre-select current week when data loads
  useEffect(() => {
    if (weeks.length > 0 && selectedWeekIndex === null) {
      const currentWeek = weeks.find(w => w.isCurrent);
      if (currentWeek) {
        setSelectedWeekIndex(currentWeek.index);
      } else {
        setSelectedWeekIndex(weeks[0].index);
      }
    }
  }, [weeks, selectedWeekIndex]);

  // Fetch week plan when week selection changes
  useEffect(() => {
    if (selectedWeekIndex !== null && !weekPlans[selectedWeekIndex]) {
      setWeekLoading(true);
      fetchWeekPlan(selectedWeekIndex).then(() => setWeekLoading(false));
    }
  }, [selectedWeekIndex, weekPlans, fetchWeekPlan]);

  const selectedWeek = weeks.find(w => w.index === selectedWeekIndex);
  const selectedWeekPlan = selectedWeekIndex !== null ? weekPlans[selectedWeekIndex] : null;
  const selectedDayData = selectedWeekPlan?.days.find(d => d.day === selectedDay);

  if (!isOpen) return null;

  return (
    <div data-testid="schedule-panel" className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-browser-title"
        tabIndex={-1}
        className="relative ml-auto w-full max-w-2xl h-full bg-[#0f172a] border-l border-white/10 flex flex-col outline-none"
      >
        <div className="flex items-center justify-between border-b border-white/5 p-4">
          <h2 id="schedule-browser-title" className="text-lg font-display font-bold text-white tracking-wide uppercase">
            Schedule Browser
          </h2>
          <button
            onClick={onClose}
            aria-label="Close schedule browser"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-ring/50 outline-none"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Week List - Left Column */}
          <div className="w-full md:w-64 border-r border-white/5 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-destructive">{error}</div>
            ) : (
              <div className="p-2">
                {/* Past Weeks */}
                {weeks.some(w => w.isPast) && (
                  <>
                    <div className="px-2 py-2 text-xs font-display font-bold text-slate-500 uppercase tracking-wider">
                      Past
                    </div>
                    {weeks
                      .filter(w => w.isPast)
                      .map(week => (
                        <button
                          data-testid="past-week-row"
                          key={week.index}
                          onClick={() => setSelectedWeekIndex(week.index)}
                          aria-pressed={selectedWeekIndex === week.index}
                          className={`w-full text-left min-h-[44px] px-2 py-2 rounded-lg text-sm transition-colors mb-1 focus-visible:ring-1 focus-visible:ring-ring/50 outline-none ${
                            selectedWeekIndex === week.index
                              ? "bg-primary/20 border border-primary/30"
                              : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className="font-semibold text-slate-200">{week.label}</div>
                          <div className="text-xs text-slate-500">
                            {week.from.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })} –{" "}
                            {week.to.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </button>
                      ))}
                  </>
                )}

                {/* Current Week */}
                {weeks.find(w => w.isCurrent) && (
                  <>
                    <div className="px-2 py-2 mt-4 text-xs font-display font-bold text-emerald-400 uppercase tracking-wider">
                      Current
                    </div>
                    {weeks
                      .filter(w => w.isCurrent)
                      .map(week => (
                        <button
                          data-testid="current-week-row"
                          key={week.index}
                          onClick={() => setSelectedWeekIndex(week.index)}
                          aria-pressed={selectedWeekIndex === week.index}
                          className={`w-full text-left min-h-[44px] px-2 py-2 rounded-lg text-sm transition-colors mb-1 highlighted focus-visible:ring-1 focus-visible:ring-ring/50 outline-none ${
                            selectedWeekIndex === week.index
                              ? "bg-primary/20 border border-primary/30"
                              : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className="font-semibold text-slate-200">{week.label}</div>
                          <div className="text-xs text-slate-500">
                            {week.from.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })} –{" "}
                            {week.to.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">ACTIVE</span>
                          </div>
                        </button>
                      ))}
                  </>
                )}

                {/* Upcoming Weeks */}
                {weeks.some(w => w.isUpcoming) && (
                  <>
                    <div className="px-2 py-2 mt-4 text-xs font-display font-bold text-slate-500 uppercase tracking-wider">
                      Upcoming
                    </div>
                    {weeks
                      .filter(w => w.isUpcoming)
                      .map(week => (
                        <button
                          data-testid="upcoming-week-row"
                          key={week.index}
                          onClick={() => setSelectedWeekIndex(week.index)}
                          aria-pressed={selectedWeekIndex === week.index}
                          className={`w-full text-left min-h-[44px] px-2 py-2 rounded-lg text-sm transition-colors mb-1 focus-visible:ring-1 focus-visible:ring-ring/50 outline-none ${
                            selectedWeekIndex === week.index
                              ? "bg-primary/20 border border-primary/30"
                              : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-slate-200">{week.label}</div>
                              <div className="text-xs text-slate-500">
                                {week.from.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })} –{" "}
                                {week.to.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                            <div className="px-1.5 py-0.5 bg-slate-700/50 rounded text-[10px] font-mono text-slate-400 font-bold">
                              PREVIEW
                            </div>
                          </div>
                        </button>
                      ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Day Detail - Right Column */}
          <div className="flex-1 overflow-y-auto">
            {weekLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : selectedWeekPlan ? (
              <div className="p-4 md:p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-display font-bold text-white tracking-wide uppercase mb-1">
                    {selectedWeekPlan.label}
                  </h3>
                  {selectedWeek && (
                    <p className="text-xs text-slate-500">
                      {selectedWeek.from.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })} –{" "}
                      {selectedWeek.to.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {selectedWeek.isUpcoming && (
                        <span className="ml-3 px-1.5 py-0.5 bg-slate-700/50 rounded text-[10px] font-mono text-slate-400 font-bold">
                          PREVIEW
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Day Tabs */}
                <div className="mb-6">
                  <div data-testid="day-tab-row" className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4">
                    {selectedWeekPlan.days.map(day => (
                      <button
                        key={day.day}
                        onClick={() => setSelectedDay(day.day)}
                        aria-current={selectedDay === day.day ? "true" : undefined}
                        className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0 focus-visible:ring-1 focus-visible:ring-ring/50 outline-none ${
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

                {/* Day Focus */}
                {selectedDayData && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-400">{selectedDayData.focus}</p>
                  </div>
                )}

                {/* Category Cards */}
                {selectedDayData ? (
                  <div className="space-y-6">
                    {Object.entries(selectedDayData.categories).map(([category, categoryData]) => (
                      <div key={category}>
                        <h4 className="text-lg font-display font-bold text-white uppercase tracking-wide mb-3">
                          {category}
                        </h4>
                        <div className="space-y-3">
                          {categoryData.workouts.map((workout, idx) => (
                            <div key={idx}>
                              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                {workout.duration} Duration
                              </div>
                              {workout.exercises.length > 0 ? (
                                <WorkoutTable exercises={workout.exercises as Exercise[]} />
                              ) : (
                                <div className="p-3 text-center text-sm text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                  No exercises scheduled
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400">
                    Select a week to view details
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Select a week to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
