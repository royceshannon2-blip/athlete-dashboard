import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WeightPrefs } from "@/hooks/use-weight-log";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TimerSettingsProps {
  prefs: WeightPrefs;
  updatePrefs: (partial: Partial<WeightPrefs>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TimerSettings({ prefs, updatePrefs, isOpen, onClose }: TimerSettingsProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const durationMins = Math.floor(prefs.defaultDurationSecs / 60);
  const durationSecs = prefs.defaultDurationSecs % 60;

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const totalSecs = parseInt(e.target.value) || 0;
    updatePrefs({ defaultDurationSecs: Math.max(0, totalSecs) });
  };

  const content = (
    <div className="space-y-4">
      <div>
        <label htmlFor="duration-input" className="block text-xs font-display font-bold uppercase text-slate-400 mb-2">
          Rest Duration (seconds)
        </label>
        <input
          id="duration-input"
          type="number"
          inputMode="numeric"
          min="0"
          value={prefs.defaultDurationSecs}
          onChange={handleDurationChange}
          className="w-full min-h-[44px] px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        />
        <p className="text-xs text-slate-500 mt-1">
          {durationMins}:{durationSecs.toString().padStart(2, "0")}
        </p>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={prefs.soundEnabled}
            onChange={(e) => updatePrefs({ soundEnabled: e.target.checked })}
            className="w-6 h-6 rounded border-slate-700 bg-slate-800 cursor-pointer"
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
              className={`flex-1 min-h-[44px] px-3 rounded-lg font-mono font-bold text-sm uppercase transition-colors flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary/70 outline-none ${
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

      <Button
        onClick={onClose}
        className="w-full min-h-[56px] mt-6 font-mono font-bold text-sm uppercase bg-primary text-slate-900 hover:bg-primary/90"
      >
        Save
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-lg font-display font-bold">
              Timer Settings
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} snapPoints={[0.5]}>
      <DrawerContent className="bg-slate-900 border-slate-700">
        <DrawerHeader>
          <DrawerTitle className="text-white text-lg font-display font-bold">
            Timer Settings
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
