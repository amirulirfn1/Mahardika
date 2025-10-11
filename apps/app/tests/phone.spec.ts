import { describe, expect, it } from 'vitest';

import { normalizePhone } from '@/lib/phone';

describe('normalizePhone', () => {
  it('returns null when no digits are present', () => {
    expect(normalizePhone('abc')).toBeNull();
  });

  it('keeps numbers that already start with 60', () => {
    expect(normalizePhone('+60123456789')).toBe('60123456789');
  });

  it('converts local leading zero to 60 prefix', () => {
    expect(normalizePhone('0123456789')).toBe('60123456789');
  });

  it('strips international 00 prefix without duplicating 60', () => {
    expect(normalizePhone('0060123456789')).toBe('60123456789');
  });
});
