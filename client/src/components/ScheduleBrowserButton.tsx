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
      size="sm"
      className="gap-2 border-white/20 hover:bg-white/[0.08]"
    >
      <Calendar className="w-4 h-4" />
      <span className="hidden sm:inline">Schedule</span>
    </Button>
  );
}
