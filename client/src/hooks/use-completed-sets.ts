import { useState, useEffect } from "react";

interface CompletedSetData {
  [day: string]: Record<string, number[]>;
}

export function useCompletedSets() {
  const [completedSets, setCompletedSets] = useState<Record<string, Set<number>>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("completed-sets-v1");
    if (stored) {
      try {
        const data: CompletedSetData = JSON.parse(stored);
        const today = new Date().toDateString();
        const todayData = data[today] || {};
        const reconstructed: Record<string, Set<number>> = {};
        for (const [exerciseId, setNumbers] of Object.entries(todayData)) {
          reconstructed[exerciseId] = new Set(setNumbers);
        }
        setCompletedSets(reconstructed);
      } catch (e) {
        console.error("Failed to load completed sets:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateCompletedSets = (newSets: Record<string, Set<number>>) => {
    setCompletedSets(newSets);
    if (isLoaded) {
      const today = new Date().toDateString();
      const serialized: CompletedSetData = {};
      serialized[today] = {};
      for (const [exerciseId, setNumbers] of Object.entries(newSets)) {
        serialized[today][exerciseId] = Array.from(setNumbers);
      }
      localStorage.setItem("completed-sets-v1", JSON.stringify(serialized));
    }
  };

  const clearForDay = () => {
    setCompletedSets({});
    const today = new Date().toDateString();
    const stored = localStorage.getItem("completed-sets-v1");
    if (stored) {
      try {
        const data: CompletedSetData = JSON.parse(stored);
        delete data[today];
        localStorage.setItem("completed-sets-v1", JSON.stringify(data));
      } catch (e) {
        console.error("Failed to clear completed sets:", e);
      }
    }
  };

  return {
    completedSets,
    setCompletedSets: updateCompletedSets,
    clearForDay,
    isLoaded,
  };
}
