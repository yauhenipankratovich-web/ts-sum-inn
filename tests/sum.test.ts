import { describe, it, expect } from 'vitest';
import { sum } from '../src/index';

describe('sum', () => {
  it('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should add negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  it('should add positive and negative numbers', () => {
    expect(sum(5, -3)).toBe(2);
  });

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
    expect(sum(5, 0)).toBe(5);
    expect(sum(0, 0)).toBe(0);
  });

  it('should handle decimal numbers', () => {
    expect(sum(1.5, 2.5)).toBe(4);
  });
});
