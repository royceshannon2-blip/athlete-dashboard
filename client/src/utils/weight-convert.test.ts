import { describe, it, expect } from 'vitest';
import { kgToLbs, lbsToKg } from './weight-convert';

describe('kgToLbs', () => {
  it('converts correctly', () => expect(kgToLbs(100)).toBeCloseTo(220.46, 1));
  it('handles zero', () => expect(kgToLbs(0)).toBe(0));
  it('handles decimals', () => expect(kgToLbs(102.5)).toBeCloseTo(226.0, 0));
  it('handles small values', () => expect(kgToLbs(20)).toBeCloseTo(44.09, 1));
});

describe('lbsToKg', () => {
  it('converts correctly', () => expect(lbsToKg(225)).toBeCloseTo(102.06, 1));
  it('handles zero', () => expect(lbsToKg(0)).toBe(0));
  it('round-trips without significant drift', () => {
    expect(kgToLbs(lbsToKg(225))).toBeCloseTo(225, 1);
  });
  it('round-trips kg → lbs → kg', () => {
    expect(lbsToKg(kgToLbs(100))).toBeCloseTo(100, 1);
  });
});
