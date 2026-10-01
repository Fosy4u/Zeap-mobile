import {describe, expect, it} from '@jest/globals';
import normalizeDeliveryCountry from '../src/utils/normalizeDeliveryCountry';

describe('normalizeDeliveryCountry', () => {
  it.each([
    ['UK', 'United Kingdom'],
    ['GB', 'United Kingdom'],
    ['United Kingdom', 'United Kingdom'],
    ['USA', 'United States'],
    ['United States of America', 'United States'],
    ['Nigeria', 'Nigeria'],
    ['Canada', 'Canada'],
  ])('normalizes %s for checkout', (country, expected) => {
    expect(normalizeDeliveryCountry(country)).toBe(expected);
  });

  it('trims unknown values without hiding them from server validation', () => {
    expect(normalizeDeliveryCountry('  France  ')).toBe('France');
  });
});
