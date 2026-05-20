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
  const showIdle = !isRunning && remaining === duration && !isFinished;

  if (showIdle) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-4 py-3 flex items-center gap-3 z-40 transition-all ${
        isFinished ? "animate-pulse" : ""
      }`}
    >
      <div className="flex-1">
        <div className="relative w-full h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-lg font-mono font-bold text-white w-12 text-right">
        {formatTime(remaining)}
      </div>

      <div className="flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={isRunning ? onPause : onStart}
          className="h-8 w-8 p-0 hover:bg-slate-700"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onReset}
          className="h-8 w-8 p-0 hover:bg-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onNudge(-30000)}
          className="h-8 w-8 p-0 hover:bg-slate-700"
        >
          <Minus className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onNudge(30000)}
          className="h-8 w-8 p-0 hover:bg-slate-700"
        >
          <Plus className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onOpenSettings}
          className="h-8 w-8 p-0 hover:bg-slate-700"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
