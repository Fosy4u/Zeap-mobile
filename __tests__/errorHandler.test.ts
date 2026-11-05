import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import {Alert} from 'react-native';

let mockSettling = false;
jest.mock('../src/redux/services/session', () => ({
  isSessionSettling: () => mockSettling,
}));

import handleError from '../src/modules/general/hooks/errorHandler_hook';

describe('handleError around account switches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockSettling = false;
  });

  it('stays silent for requests cancelled by an account switch', () => {
    handleError({name: 'AbortError', message: 'Aborted'});
    handleError({status: 'CUSTOM_ERROR', error: 'Session changed or unavailable'});
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('stays silent for empty-result crashes right after an account switch', () => {
    mockSettling = true;
    handleError(new TypeError("Cannot read property 'dynamicFilters' of undefined"));
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('still reports the same crash outside an account switch', () => {
    handleError(new TypeError("Cannot read property 'dynamicFilters' of undefined"));
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('still shows real errors during an account switch', () => {
    mockSettling = true;
    handleError(new Error("We couldn't load your account. Please try logging in again."));
    handleError({status: 500, data: {message: 'Server error'}});
    expect(Alert.alert).toHaveBeenCalledTimes(2);
  });
});
