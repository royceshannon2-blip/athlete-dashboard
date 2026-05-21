import { useState } from "react";
import { X, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useWeightLog, toDisplayWeight } from "@/hooks/use-weight-log";
import { ExerciseSelector } from "@/components/ExerciseSelector";
import { ExerciseProgressChart } from "@/components/ExerciseProgressChart";

interface ProgressionDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressionDashboard({ isOpen, onClose }: ProgressionDashboardProps) {
  const weightLog = useWeightLog();
  const exercises = weightLog.exercisesWithLogs();
  const [selectedId, setSelectedId] = useState(exercises[0]?.exerciseId || "");

  const sessions = selectedId ? weightLog.getSessionSummaries(selectedId) : [];

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm("Clear all data for this exercise?")) {
      weightLog.clearExerciseLogs(selectedId);
      const remaining = weightLog.exercisesWithLogs();
      setSelectedId(remaining[0]?.exerciseId || "");
    }
  };

  const content = (
    <>
      {exercises.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-slate-400 text-center">No weight data logged yet</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-2">
              Exercise
            </label>
            <ExerciseSelector
              exercises={exercises}
              value={selectedId}
              onValueChange={setSelectedId}
            />
          </div>

          {selectedId && (
            <>
              <ExerciseProgressChart
                sessions={sessions}
                unit={weightLog.prefs.unit}
                height={220}
              />

              <div className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
                <table className="w-full text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-800">
                      <th className="px-4 py-2 text-left text-xs font-display font-bold uppercase text-slate-400">
                        Date
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-display font-bold uppercase text-slate-400">
                        Sets
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-display font-bold uppercase text-slate-400">
                        Max
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-display font-bold uppercase text-slate-400">
                        Volume
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.date} data-testid="session-row" data-date={session.date} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                        <td className="px-4 py-2 text-slate-300 font-mono text-xs">
                          {session.date}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-300 font-mono text-xs">
                          {session.sets.length}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-300 font-mono text-xs">
                          {toDisplayWeight(session.maxWeightKg, weightLog.prefs.unit).toFixed(1)}{" "}
                          {weightLog.prefs.unit}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-300 font-mono text-xs">
                          {toDisplayWeight(session.totalVolumeKg, weightLog.prefs.unit).toFixed(0)}{" "}
                          {weightLog.prefs.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={weightLog.exportCSV}
                  className="w-full min-h-[44px] gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="w-full min-h-[44px] gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Data
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );

  // Desktop view (side panel)
  return (
    <>
      {/* Desktop overlay - hidden on mobile */}
      <div className="hidden sm:fixed sm:inset-0 sm:z-40 sm:bg-black/50" onClick={onClose} />

      {/* Desktop side panel - hidden on mobile */}
      <div className="hidden sm:flex sm:fixed sm:inset-y-0 sm:right-0 sm:z-50 sm:w-full sm:max-w-3xl sm:flex-col sm:overflow-hidden bg-slate-900 border sm:border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <h2 className="text-xl font-display font-bold text-white uppercase">
            Progression Dashboard
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        {content}
      </div>

      {/* Mobile drawer - hidden on desktop */}
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} snapPoints={[0.92]}>
        <DrawerContent className="bg-slate-900 border-slate-700 flex flex-col max-h-[92vh]">
          <DrawerHeader className="pb-3">
            <DrawerTitle className="text-white text-xl font-display font-bold uppercase">
              Progression Dashboard
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    </>
  );
}
