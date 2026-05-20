import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useWeightLog, toDisplayWeight, toKg } from "@/hooks/use-weight-log";

interface SetLogPromptProps {
  exercise: { id: string; name: string } | null;
  setNumber: number;
  totalSets: number;
  onLog: (weightKg: number, unit: "lbs" | "kg") => void;
  onSkip: () => void;
}

export function SetLogPrompt({
  exercise,
  setNumber,
  totalSets,
  onLog,
  onSkip,
}: SetLogPromptProps) {
  const isOpen = exercise !== null;
  const weightLog = useWeightLog();
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"lbs" | "kg">(weightLog.prefs.unit);

  useEffect(() => {
    if (isOpen && exercise) {
      const lastWeight = weightLog.getLastWeight(exercise.id);
      if (lastWeight) {
        const displayed = toDisplayWeight(lastWeight.weightKg, lastWeight.unit);
        setWeight(displayed.toFixed(2));
        setUnit(lastWeight.unit);
      } else {
        setWeight("");
      }
    }
  }, [isOpen, exercise, weightLog]);

  const handleLog = () => {
    const val = parseFloat(weight);
    if (!isNaN(val) && val >= 0) {
      const kg = toKg(val, unit);
      onLog(kg, unit);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onSkip()} snapPoints={[0.5, 0.92]}>
      <DrawerContent className="bg-slate-900 border-slate-700">
        <DrawerHeader>
          <DrawerTitle className="text-white text-lg font-display font-bold">
            {exercise?.name} — Set {setNumber} of {totalSets}
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-2">
              Weight
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 text-4xl font-bold text-center bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-600"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-2">
              Unit
            </label>
            <div className="flex gap-2">
              {(["lbs", "kg"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`flex-1 min-h-[44px] px-3 rounded-lg font-mono font-bold text-sm uppercase transition-colors flex items-center justify-center ${
                    unit === u
                      ? "bg-primary text-slate-900"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleLog} className="w-full min-h-[56px] text-base font-semibold bg-primary hover:bg-primary/90">
              Log it
            </Button>
            <Button
              variant="outline"
              onClick={onSkip}
              className="w-full min-h-[44px] text-sm border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Skip
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
