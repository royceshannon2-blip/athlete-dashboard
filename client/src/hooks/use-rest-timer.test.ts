// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRestTimer } from './use-rest-timer';

describe('useRestTimer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts counting down from the given duration', () => {
    const { result } = renderHook(() => useRestTimer(120, false));
    expect(result.current.remaining).toBe(120_000);

    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(30_000));

    expect(result.current.remaining / 1000).toBeCloseTo(90, 0);
  });

  it('isRunning is true after start and false initially', () => {
    const { result } = renderHook(() => useRestTimer(120, false));
    expect(result.current.isRunning).toBe(false);

    act(() => result.current.start());
    expect(result.current.isRunning).toBe(true);
  });

  it('pausing freezes the countdown', () => {
    const { result } = renderHook(() => useRestTimer(120, false));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(30_000));

    const beforePause = result.current.remaining;
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(30_000));

    expect(result.current.remaining).toBe(beforePause);
    expect(result.current.isRunning).toBe(false);
  });

  it('reset returns to full duration', () => {
    const { result } = renderHook(() => useRestTimer(120, false));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(60_000));
    act(() => result.current.reset());

    expect(result.current.remaining).toBe(120_000);
    expect(result.current.isRunning).toBe(false);
  });

  it('sets isFinished when reaching zero', () => {
    const { result } = renderHook(() => useRestTimer(10, false));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(11_000));

    expect(result.current.isFinished).toBe(true);
    expect(result.current.remaining).toBe(0);
  });

  it('does not go below zero', () => {
    const { result } = renderHook(() => useRestTimer(10, false));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(30_000));

    expect(result.current.remaining).toBe(0);
  });

  it('+30s nudge adds 30 seconds to remaining time', () => {
    const { result } = renderHook(() => useRestTimer(120, false));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(60_000));
    act(() => result.current.nudge(30_000));

    expect(result.current.remaining / 1000).toBeCloseTo(90, 0);
  });

  it('−30s nudge subtracts time without going below zero', () => {
    const { result } = renderHook(() => useRestTimer(120, false));
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(100_000)); // 20s left
    act(() => result.current.nudge(-30_000));   // would be −10, clamp to 0

    expect(result.current.remaining).toBe(0);
  });

  it('setDuration changes the base duration when timer is idle', () => {
    const { result } = renderHook(() => useRestTimer(120, false));
    act(() => result.current.setDuration(180_000));

    expect(result.current.duration).toBe(180_000);
    expect(result.current.remaining).toBe(180_000);
  });
});
