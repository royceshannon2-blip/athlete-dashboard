export function parseSetsReps(setsReps: string): { sets: number; reps: string } {
  const match = setsReps.match(/^(\d+)x(.+)$/);
  if (!match) return { sets: 1, reps: setsReps };
  return { sets: parseInt(match[1]), reps: match[2] };
}
