import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { WeightPrefs } from "@/hooks/use-weight-log";

interface TimerSettingsProps {
  prefs: WeightPrefs;
  updatePrefs: (partial: Partial<WeightPrefs>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TimerSettings({ prefs, updatePrefs, isOpen, onClose }: TimerSettingsProps) {
  const durationMins = Math.floor(prefs.defaultDurationSecs / 60);
  const durationSecs = prefs.defaultDurationSecs % 60;

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalSecs = parseInt(e.target.value) || 0;
    updatePrefs({ defaultDurationSecs: Math.max(0, totalSecs) });
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-slate-900 border-slate-700">
        <DrawerHeader>
          <DrawerTitle className="text-white text-lg font-display font-bold">
            Timer Settings
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-2">
              Default Duration
            </label>
            <input
              type="number"
              min="0"
              value={prefs.defaultDurationSecs}
              onChange={handleDurationChange}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            />
            <p className="text-xs text-slate-500 mt-1">
              {durationMins}:{durationSecs.toString().padStart(2, "0")}
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.autoStart}
                onChange={(e) => updatePrefs({ autoStart: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800"
              />
              <span className="text-sm text-slate-300">Auto-start after logging</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.soundEnabled}
                onChange={(e) => updatePrefs({ soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800"
              />
              <span className="text-sm text-slate-300">Sound notification</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-display font-bold uppercase text-slate-400 mb-2">
              Display Unit
            </label>
            <div className="flex gap-2">
              {(["lbs", "kg"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => updatePrefs({ unit: u })}
                  className={`flex-1 py-2 px-3 rounded-lg font-mono font-bold text-sm uppercase transition-colors ${
                    prefs.unit === u
                      ? "bg-primary text-slate-900"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
