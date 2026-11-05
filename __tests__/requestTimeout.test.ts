import {describe, it, expect} from '@jest/globals';
import {
  REQUEST_TIMEOUT_MS,
  UPLOAD_TIMEOUT_MS,
  requestTimeout,
} from '../src/redux/api/requestPolicy';

describe('request time limits', () => {
  it('uses 45 seconds for normal requests', () => {
    expect(REQUEST_TIMEOUT_MS).toBe(45000);
    expect(requestTimeout('/orders')).toBe(45000);
    expect(requestTimeout({url: '/cart', method: 'PUT', body: {quantity: 1}})).toBe(45000);
  });

  it('uses 120 seconds for file uploads', () => {
    const form = new FormData();
    form.append('file', 'x');
    expect(UPLOAD_TIMEOUT_MS).toBe(120000);
    expect(requestTimeout({url: '/product/upload', method: 'POST', body: form})).toBe(120000);
  });
});
