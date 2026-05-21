import { describe, it, expect } from 'vitest';
import { parseSetsReps } from './parse-sets-reps';

describe('parseSetsReps', () => {
  it('parses standard format', () => {
    expect(parseSetsReps('4x5')).toEqual({ sets: 4, reps: '5' });
  });

  it('parses rep range', () => {
    expect(parseSetsReps('3x8-10')).toEqual({ sets: 3, reps: '8-10' });
  });

  it('parses timed sets', () => {
    expect(parseSetsReps('4x30s')).toEqual({ sets: 4, reps: '30s' });
  });

  it('parses single set', () => {
    expect(parseSetsReps('1x5')).toEqual({ sets: 1, reps: '5' });
  });

  it('falls back gracefully on unexpected format', () => {
    expect(parseSetsReps('AMRAP')).toEqual({ sets: 1, reps: 'AMRAP' });
  });

  it('returns sets: 1 for empty string', () => {
    expect(parseSetsReps('')).toEqual({ sets: 1, reps: '' });
  });

  it('parses large set counts', () => {
    expect(parseSetsReps('10x3')).toEqual({ sets: 10, reps: '3' });
  });

  it('parses reps with letters', () => {
    expect(parseSetsReps('3x6-8')).toEqual({ sets: 3, reps: '6-8' });
  });
});
