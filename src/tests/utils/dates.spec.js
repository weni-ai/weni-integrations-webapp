import { describe, it, expect, vi, afterEach } from 'vitest';
import { getLastNDaysRange } from '@/utils/dates';

describe('getLastNDaysRange', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns start and end dates spanning the given number of days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-27T12:00:00'));

    const { start, end } = getLastNDaysRange(90);

    expect(end).toBe('05-27-2026');
    expect(start).toBe('02-26-2026');
  });
});
