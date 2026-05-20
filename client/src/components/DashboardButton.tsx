import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardButtonProps {
  onClick: () => void;
}

export function DashboardButton({ onClick }: DashboardButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-2 border-white/20 hover:bg-white/[0.08]"
    >
      <TrendingUp className="w-4 h-4" />
      <span className="hidden sm:inline">Dashboard</span>
    </Button>
  );
}
