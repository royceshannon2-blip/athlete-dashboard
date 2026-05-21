// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWeightLog } from './use-weight-log';
import { lbsToKg } from '@/utils/weight-convert';

const mockExercise = {
  exerciseId: 'ex-1',
  exerciseName: 'Back Squat',
};

function seedLog(
  hook: ReturnType<typeof useWeightLog>,
  overrides: {
    exerciseId?: string;
    setNumber?: number;
    weightLbs?: number;
    targetReps?: string;
  } = {}
) {
  const {
    exerciseId = mockExercise.exerciseId,
    setNumber = 1,
    weightLbs = 225,
    targetReps = '5',
  } = overrides;
  hook.logSet(
    exerciseId,
    mockExercise.exerciseName,
    setNumber,
    targetReps,
    weightLbs,
    'lbs'
  );
}

describe('useWeightLog — logSet', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('writes an entry to localStorage', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => seedLog(result.current));
    const logs = result.current.getLogsForExercise(mockExercise.exerciseId);
    expect(logs).toHaveLength(1);
  });

  it('stores weight in kg regardless of input unit', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => seedLog(result.current, { weightLbs: 225 }));
    const logs = result.current.getLogsForExercise(mockExercise.exerciseId);
    expect(logs[0].weightKg).toBeCloseTo(lbsToKg(225), 1);
  });

  it('appends to index without duplicating keys', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => {
      seedLog(result.current, { setNumber: 1 });
      seedLog(result.current, { setNumber: 2 });
    });
    const logs = result.current.getLogsForExercise(mockExercise.exerciseId);
    expect(logs).toHaveLength(2);
  });

  it('records kg input directly without extra conversion', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => {
      result.current.logSet('ex-kg', 'Deadlift', 1, '3', 100, 'kg');
    });
    const logs = result.current.getLogsForExercise('ex-kg');
    expect(logs[0].weightKg).toBeCloseTo(100, 1);
  });
});

describe('useWeightLog — getLastWeight', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when no logs exist', () => {
    const { result } = renderHook(() => useWeightLog());
    expect(result.current.getLastWeight('nonexistent')).toBeNull();
  });

  it('pre-fills last weight for an exercise', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => {
      seedLog(result.current, { setNumber: 1, weightLbs: 225 });
      seedLog(result.current, { setNumber: 2, weightLbs: 230 });
    });
    const last = result.current.getLastWeight(mockExercise.exerciseId);
    expect(last).not.toBeNull();
    expect(last!.weightKg).toBeCloseTo(lbsToKg(230), 1);
  });
});

describe('useWeightLog — getSessionSummaries', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty array when no logs exist', () => {
    const { result } = renderHook(() => useWeightLog());
    expect(result.current.getSessionSummaries('nonexistent-id')).toEqual([]);
  });

  it('computes maxWeightKg correctly', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => {
      seedLog(result.current, { setNumber: 1, weightLbs: 225 });
      seedLog(result.current, { setNumber: 2, weightLbs: 250 });
    });
    const summaries = result.current.getSessionSummaries(mockExercise.exerciseId);
    expect(summaries).toHaveLength(1);
    expect(summaries[0].maxWeightKg).toBeCloseTo(lbsToKg(250), 1);
  });

  it('computes totalVolumeKg as sum of weight × reps', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => {
      // 2 sets × 5 reps × 100kg + 1 set × 5 reps × 105kg = 1525
      result.current.logSet('ex-vol', 'Squat', 1, '5', 100, 'kg');
      result.current.logSet('ex-vol', 'Squat', 2, '5', 100, 'kg');
      result.current.logSet('ex-vol', 'Squat', 3, '5', 105, 'kg');
    });
    const summaries = result.current.getSessionSummaries('ex-vol');
    expect(summaries[0].totalVolumeKg).toBeCloseTo(1525, 0);
  });

  it('groups sets by date into one session', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => {
      seedLog(result.current, { setNumber: 1 });
      seedLog(result.current, { setNumber: 2 });
    });
    const summaries = result.current.getSessionSummaries(mockExercise.exerciseId);
    expect(summaries).toHaveLength(1);
    expect(summaries[0].sets).toHaveLength(2);
  });
});

describe('useWeightLog — clearExerciseLogs', () => {
  beforeEach(() => localStorage.clear());

  it('removes all entries for one exercise and leaves others', () => {
    const { result } = renderHook(() => useWeightLog());
    act(() => {
      seedLog(result.current, { exerciseId: 'ex-1' });
      result.current.logSet('ex-2', 'Bench', 1, '5', 100, 'lbs');
    });
    act(() => result.current.clearExerciseLogs('ex-1'));
    expect(result.current.getSessionSummaries('ex-1')).toHaveLength(0);
    expect(result.current.getLogsForExercise('ex-2')).toHaveLength(1);
  });
});

describe('useWeightLog — localStorage persistence', () => {
  beforeEach(() => localStorage.clear());

  it('survives a simulated page reload', () => {
    const { result: r1 } = renderHook(() => useWeightLog());
    act(() => seedLog(r1.current));

    // Fresh hook simulates reload
    const { result: r2 } = renderHook(() => useWeightLog());
    expect(r2.current.getLastWeight(mockExercise.exerciseId)).not.toBeNull();
  });

  it('handles corrupted localStorage index gracefully', () => {
    localStorage.setItem('wt:index', 'not-valid-json');
    expect(() => renderHook(() => useWeightLog())).not.toThrow();
    const { result } = renderHook(() => useWeightLog());
    expect(result.current.getAllLogs()).toEqual([]);
  });

  it('handles localStorage quota exceeded without crashing', () => {
    const { result } = renderHook(() => useWeightLog());
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => {
      act(() => seedLog(result.current));
    }).not.toThrow();
  });
});
