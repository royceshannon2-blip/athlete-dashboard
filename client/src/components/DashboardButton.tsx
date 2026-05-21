import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardButtonProps {
  onClick: () => void;
}

export function DashboardButton({ onClick }: DashboardButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="min-h-[44px] min-w-[44px] px-3 gap-2 border-white/20 hover:bg-white/[0.08] flex items-center justify-center"
    >
      <TrendingUp className="w-4 h-4" />
      <span>Dashboard</span>
    </Button>
  );
}
