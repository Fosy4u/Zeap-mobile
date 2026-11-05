import {describe, it, expect} from '@jest/globals';
import {
  canRetryRequest,
  isTrustedApiRoute,
} from '../src/redux/api/requestPolicy';
import {isNotificationForUser} from '../src/modules/notifications/utils/notificationRelevance';

describe('authenticated request boundaries', () => {
  it.each([
    'https://evil.example/path',
    '//evil.example',
    '\\\\evil.example',
    '/\\evil.example',
    'http:evil.example',
    ' /path',
    '/path\n',
  ])('rejects untrusted route %j', route => {
    expect(isTrustedApiRoute(route)).toBe(false);
  });
  it.each(['/orders', 'products', '/userByUid'])(
    'accepts internal route %s',
    route => {
      expect(isTrustedApiRoute(route)).toBe(true);
    },
  );
  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
    'never retries %s, even when defined as a query',
    method => {
      expect(canRetryRequest({url: '/write', method}, 'query')).toBe(false);
    },
  );
  it('does not retry mutations implemented with GET', () => {
    expect(canRetryRequest('/write', 'mutation')).toBe(false);
    expect(canRetryRequest('/read', 'query')).toBe(true);
  });
});
describe('notification relevance', () => {
  const buyer = {isVendor: false};
  it('shows buyer notifications, including ones without audience metadata', () => {
    expect(isNotificationForUser({notificationType: 'order', orderId: 'O1'}, buyer)).toBe(true);
    expect(isNotificationForUser({}, buyer)).toBe(true);
    expect(isNotificationForUser(undefined, buyer)).toBe(true);
  });
  it('requires the matching vendor shop', () => {
    const vendor = {isVendor: true, shopId: 'shop-B'};
    expect(
      isNotificationForUser({roleType: 'vendor', shopId: 'shop-A'}, vendor),
    ).toBe(false);
    expect(
      isNotificationForUser({roleType: 'vendor', shopId: 'shop-B'}, vendor),
    ).toBe(true);
    expect(
      isNotificationForUser({roleType: 'vendor', shopId: 'shop-B'}, buyer),
    ).toBe(false);
  });
});
