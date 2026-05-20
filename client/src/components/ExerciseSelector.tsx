import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExerciseSelectorProps {
  exercises: { exerciseId: string; exerciseName: string }[];
  value: string;
  onValueChange: (value: string) => void;
}

export function ExerciseSelector({ exercises, value, onValueChange }: ExerciseSelectorProps) {
  if (exercises.length === 0) {
    return (
      <div className="px-3 py-2 border border-slate-700 rounded-lg text-slate-500 text-sm">
        No exercises with logged data yet
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full border-slate-700 bg-slate-800 text-white">
        <SelectValue placeholder="Select an exercise" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        {exercises.map((ex) => (
          <SelectItem key={ex.exerciseId} value={ex.exerciseId}>
            {ex.exerciseName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
