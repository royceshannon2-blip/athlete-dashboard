import { useState, useEffect, useRef, useCallback } from "react";

export function useRestTimer(initialSecs: number, soundEnabled: boolean) {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(initialSecs * 1000);
  const [duration, setDuration] = useState(initialSecs * 1000);
  const [isFinished, setIsFinished] = useState(false);
  const didPlayRef = useRef(false);

  const isRunning = endTime !== null && remaining > 0;

  const playChime = useCallback(() => {
    if (!soundEnabled || didPlayRef.current) return;
    didPlayRef.current = true;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;

      [0, 0.35, 0.70].forEach((offset) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 440;
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
        gain.gain.setValueAtTime(0.6, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
      });
    } catch {
      console.error("Web Audio failed");
    }
  }, [soundEnabled]);

  const start = useCallback(() => {
    setEndTime(Date.now() + remaining);
    setIsFinished(false);
    didPlayRef.current = false;
  }, [remaining]);

  const pause = useCallback(() => {
    setEndTime(null);
  }, []);

  const reset = useCallback(() => {
    setEndTime(null);
    setRemaining(duration);
    setIsFinished(false);
    didPlayRef.current = false;
  }, [duration]);

  const nudge = useCallback((ms: number) => {
    setRemaining((prev) => Math.max(0, prev + ms));
    if (endTime !== null) {
      setEndTime((prev) => (prev !== null ? prev + ms : null));
    }
  }, [endTime]);

  const setDurationMs = useCallback((ms: number) => {
    setDuration(ms);
    if (endTime === null) {
      setRemaining(ms);
    }
  }, [endTime]);

  useEffect(() => {
    if (endTime === null) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, endTime - now);
      setRemaining(diff);

      if (diff === 0 && !isFinished) {
        setIsFinished(true);
        setEndTime(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [endTime, isFinished]);

  useEffect(() => {
    if (isFinished) {
      playChime();
    }
  }, [isFinished, playChime]);

  return {
    remaining,
    isRunning,
    isFinished,
    duration,
    start,
    pause,
    reset,
    nudge,
    setDuration: setDurationMs,
  };
}
