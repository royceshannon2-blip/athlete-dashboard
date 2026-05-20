import { Play, Pause, RotateCcw, Plus, Minus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestTimerProps {
  remaining: number;
  isRunning: boolean;
  isFinished: boolean;
  duration: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNudge: (ms: number) => void;
  onOpenSettings: () => void;
}

export function RestTimer({
  remaining,
  isRunning,
  isFinished,
  duration,
  onStart,
  onPause,
  onReset,
  onNudge,
  onOpenSettings,
}: RestTimerProps) {
  const formatTime = (ms: number) => {
    const totalSecs = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const isIdle = !isRunning && remaining === duration && !isFinished;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 min-h-[72px] z-40 transition-all opacity-0 pointer-events-none ${
        (isRunning || !isIdle || isFinished) ? 'opacity-100 pointer-events-auto' : ''
      } ${isFinished ? "animate-pulse" : ""}`}
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 px-4 py-2 h-full">
        {/* Progress bar - full width on mobile, compact on desktop */}
        <div className="order-first w-full h-1.5 bg-slate-700 rounded-full overflow-hidden sm:order-2 sm:flex-1">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Time display */}
        <div className="text-lg font-mono font-bold text-white w-16 text-center order-1 sm:order-3 sm:w-14">
          {formatTime(remaining)}
        </div>

        {/* Controls - responsive grouping */}
        <div className="flex gap-1 order-2 sm:order-4">
          {/* Nudge controls (−30s, +30s) */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNudge(-30000)}
              className="min-h-[44px] min-w-[44px] p-0 hover:bg-slate-700 flex items-center justify-center"
              title="−30s"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNudge(30000)}
              className="min-h-[44px] min-w-[44px] p-0 hover:bg-slate-700 flex items-center justify-center"
              title="+30s"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Play/Pause and Reset */}
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={isRunning ? onPause : onStart}
              className={`min-h-[44px] min-w-[44px] p-0 hover:bg-slate-700 flex items-center justify-center transition-all ${
                !isRunning && remaining === duration ? 'animate-pulse' : ''
              }`}
              title={isRunning ? 'Pause' : 'Play'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={onReset}
              className="min-h-[44px] min-w-[44px] p-0 hover:bg-slate-700 flex items-center justify-center"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Settings - always at far right */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenSettings}
            className="min-h-[44px] min-w-[44px] p-0 hover:bg-slate-700 flex items-center justify-center ml-1"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
