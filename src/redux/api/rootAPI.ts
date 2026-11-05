import {createApi, fetchBaseQuery, retry} from '@reduxjs/toolkit/query/react';
import AuthorizationHeader from '../services/authorizationHeader';
import baseURL from './api_route';

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import {
  captureSession,
  isCurrentSession,
  isSessionBlocked,
} from '../services/session';

import {
  isTrustedApiRoute,
  canRetryRequest,
  requestTimeout,
} from './requestPolicy';

const fetchQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: async headers => AuthorizationHeader(headers),
  credentials: 'omit',
  redirect: 'error',
});
const sessionError = {
  error: {
    status: 'CUSTOM_ERROR' as const,
    error: 'Session changed or unavailable',
  },
};
const guardedQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, options) => {
  const session = captureSession();
  if (api.signal.aborted || isSessionBlocked() || !session.uid)
    return sessionError;
  if (!isTrustedApiRoute(typeof args === 'string' ? args : args.url)) {
    return {error: {status: 'CUSTOM_ERROR', error: 'Untrusted API route'}};
  }
  const timedArgs: FetchArgs =
    typeof args === 'string'
      ? {url: args, timeout: requestTimeout(args)}
      : {...args, timeout: args.timeout ?? requestTimeout(args)};
  const result = await fetchQuery(timedArgs, api, options);
  return isCurrentSession(session) ? result : sessionError;
};
const rootAPI = createApi({
  reducerPath: 'rootAPI',
  baseQuery: retry(guardedQuery, {
    retryCondition: (error, args, {attempt, extraOptions, baseQueryApi}) => {
      if (!canRetryRequest(args, baseQueryApi.type) || isSessionBlocked())
        return false;
      const max =
        (extraOptions as {maxRetries?: number} | undefined)?.maxRetries ?? 3;
      const status = (error as FetchBaseQueryError).status;
      if (
        attempt > max ||
        status === 'CUSTOM_ERROR' ||
        status === 'TIMEOUT_ERROR'
      )
        return false;
      return !(typeof status === 'number' && status >= 400 && status < 500);
    },
  }),
  tagTypes: [
    'user',
    'Product',
    'Products',
    'ProductOptions',
    'Reviews',
    'Shop',
    'BodyMeasurement',
    'BodyMeasurements',
    'BodyMeasurementGuide',
    'ProductMeasurementFields',
    'RequiredMeasurementFormFields',
    'BodyMeasurementEnumerations',
    'SizeGuide',
    'Cart',
    'DeliveryAddress',
    'DeliveryAddresses',
    'PaymentReference',
    'PromoProduct',
    'DynamicFilterOptions',
    'Orders',
    'Order',
    'OrderDetails',
    'OrderSummary',
    'OrderHistory',
    'DeliveryMethod',
    'DeliveryDate',
    'Points',
    'Vouchers',
    'Wishlist',
    'Help',

    // Vebdor
    'VendorAnalytics',
    'DraftProducts',
    'VendorProductPreview',
    'VendorProductDetails',
    'Promotions',
    'Promotion',
    'VendorProductBodyMeasurement',
    'VendorOrders',
    'VendorOrderDetails',
    'VendorOrderHistory',
    'VendorPayments',
    'OnboardingDocuments',

    'notifications',
  ],
  endpoints: () => ({}),
});

export default rootAPI;
