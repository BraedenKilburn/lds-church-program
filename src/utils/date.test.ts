import { describe, expect, it } from 'vitest';
import { getNextSunday, isFirstSundayOfMonth } from './date';

describe('date helpers', () => {
  it('returns the same date when the input is Sunday', () => {
    expect(getNextSunday(new Date('2026-06-07T12:00:00'))).toBe('2026-06-07');
  });

  it('returns the following Sunday for Monday through Saturday', () => {
    expect(getNextSunday(new Date('2026-06-08T12:00:00'))).toBe('2026-06-14');
    expect(getNextSunday(new Date('2026-06-13T12:00:00'))).toBe('2026-06-14');
  });

  it('detects only Sundays in the first seven days of a month', () => {
    expect(isFirstSundayOfMonth('2026-06-07')).toBe(true);
    expect(isFirstSundayOfMonth('2026-06-14')).toBe(false);
    expect(isFirstSundayOfMonth('2026-06-01')).toBe(false);
  });
});
