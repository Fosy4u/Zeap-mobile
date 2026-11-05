import type {FetchArgs} from '@reduxjs/toolkit/query';

export const isTrustedApiRoute = (url: string) =>
  !/^[a-z][a-z0-9+.-]*:/i.test(url) &&
  !/^[\\/]{2}/.test(url) &&
  !/[\\\s]/.test(url);
export const REQUEST_TIMEOUT_MS = 45000;
export const UPLOAD_TIMEOUT_MS = 120000;
export const requestTimeout = (args: string | FetchArgs) =>
  typeof args !== 'string' &&
  typeof FormData !== 'undefined' &&
  args.body instanceof FormData
    ? UPLOAD_TIMEOUT_MS
    : REQUEST_TIMEOUT_MS;
export const canRetryRequest =(args: string | FetchArgs, type: string) =>
  type === 'query' &&
  ['GET', 'HEAD'].includes(
    typeof args === 'string' ? 'GET' : (args.method ?? 'GET').toUpperCase(),
  );
