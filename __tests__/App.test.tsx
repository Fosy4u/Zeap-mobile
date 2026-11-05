/**
 * @format
 */

import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import App from '../App';
import store from '../src/redux/store/store';

// Note: import explicitly to use the types shipped with jest.
import {it, expect} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer, {act} from 'react-test-renderer';

it('renders correctly', async () => {
  let tree: renderer.ReactTestRenderer | undefined;

  await act(async () => {
    tree = renderer.create(
      <Provider store={store}>
        <App />
      </Provider>,
    );
  });

  expect(tree?.toJSON()).toBeTruthy();

  await act(async () => {
    tree?.unmount();
  });
});
