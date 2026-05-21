import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleBrowserButtonProps {
  onClick: () => void;
}

export function ScheduleBrowserButton({ onClick }: ScheduleBrowserButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="min-h-[44px] min-w-[44px] px-3 gap-2 border-white/20 hover:bg-white/[0.08] flex items-center justify-center"
    >
      <Calendar className="w-4 h-4" />
      <span>Schedule</span>
    </Button>
  );
}
